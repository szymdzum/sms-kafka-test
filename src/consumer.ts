import { brandConfig } from "./brandConfig";
import logger from "./logger";
import { readConfig } from "./index";
import { metrics } from "./server";
import { sendSms } from "./infobipClient";

const { Kafka } = require("@confluentinc/kafka-javascript").KafkaJS;

type KafkaMessage = {
    key: Buffer;
    value: Buffer;
    topic: string;
    partition: number;
    timestamp: number;
};

interface MessageData {
    banner?: string;
    to?: string;
    phoneNumber?: string;
    orderNumber?: string;
}

export async function consume(topic: string, config: Record<string, string>): Promise<void> {
    // setup graceful shutdown
    const kafka = new Kafka({
        kafkaJS: {
            brokers: config["bootstrap.servers"]!.split(','),
            ssl: config["security.protocol"]!.includes('SSL'),
            sasl: {
                mechanism: config["sasl.mechanisms"]!.toUpperCase(),
                username: config["sasl.username"]!,
                password: config["sasl.password"]!
            }
        }
    });
    const consumer = kafka.consumer({
        kafkaJS: {
            groupId: "sms-consumer-group"
        }
    });

    const disconnect = () => {
        consumer.commitOffsets().finally(() => {
            consumer.disconnect();
        });
    };
    process.on("SIGTERM", disconnect);
    process.on("SIGINT", disconnect);

    // connect the consumer to the broker
    await consumer.connect();

    // subscribe to the topic
    await consumer.subscribe({ topics: [topic] });

    // consume messages from the topic
    consumer.run({
        eachMessage: async ({ topic, partition, message }: { topic: string, partition: number, message: KafkaMessage }) => {

            const messageStr = message.value.toString();
            logger.info(`Received message: ${messageStr.substring(0, 100)}...`);

             try {
        const messageData = JSON.parse(messageStr);

        const brand = determineBrand(messageData);
        if (!brand) {
          logger.warn('Unable to determine brand from message', { messageData });
          return;
        }

        const { phoneNumber, orderNumber } = extractOrderInfo(messageData, brand);

        if (!phoneNumber || !orderNumber) {
          logger.warn(`Missing required fields in ${brand} message`, { messageData });
          return;
        }

        const smsText = createSmsText(brand, orderNumber);

        const result = await sendSms(phoneNumber, smsText, brandConfig[brand].senderId);

        metrics.smsCounter.inc({ status: 'success', brand });

        logger.info(`${brand} SMS sent successfully`, { phoneNumber, orderNumber, messageId: result.messageId });
      } catch (error) {
        metrics.smsCounter.inc({ status: 'error' });
        logger.error('Error processing message', { error: error instanceof Error ? error.message : 'Unknown error' });

      }
        },
    });
}


function determineBrand(messageData: MessageData) {
  // Determine which brand based on message content
  if (messageData.banner) {
    const banner = messageData.banner.toUpperCase();
    if (banner === 'BQ' || banner === 'BQUK') return 'BQUK';
    if (banner === 'TP') return 'TradePoint';
    if (banner === 'SF') return 'Screwfix';
  }

  // Default fallback
  return 'BQUK';
}

function extractOrderInfo(messageData: MessageData, brand: keyof typeof brandConfig) {
  // Extract order info from the message
  return {
    phoneNumber: messageData.to || messageData.phoneNumber,
    orderNumber: messageData.orderNumber || 'unknown'
  };
}

function createSmsText(brand: keyof typeof brandConfig, orderNumber: string): string {
  const template = brandConfig[brand].smsTemplate;
  return template.replace('{orderNumber}', orderNumber);
}

// This function would be called from index.js
export function start() {
  const config = readConfig("client.properties");
  const topic = "topic_0";

  consume(topic, config).catch(error => {
    logger.error('Fatal error', { error: error.message });
    process.exit(1);
  });
}