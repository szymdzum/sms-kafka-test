import * as fs from "fs";
const { Kafka } = require("@confluentinc/kafka-javascript").KafkaJS;

type KafkaMessage = {
    key: Buffer;
    value: Buffer;
    topic: string;
    partition: number;
    timestamp: number;
};

function readConfig(fileName: string): Record<string, string> {
    const data = fs.readFileSync(fileName, "utf8").toString().split("\n");
    return data.reduce((config: Record<string, string>, line: string) => {
        const [key, value] = line.split("=");
        if (key && value) {
            config[key] = value;
        }
        return config;
    }, {});
}

async function produce(topic: string, config: Record<string, string>): Promise<void> {
    const key = "key";
    const value = "value";

    // create a new producer instance
    const kafka = new Kafka({
        kafkaJS: {
            brokers: config["bootstrap.servers"].split(','),
            ssl: config["security.protocol"].includes('SSL'),
            sasl: {
                mechanism: config["sasl.mechanisms"].toUpperCase(),
                username: config["sasl.username"],
                password: config["sasl.password"]
            }
        }
    });
    const producer = kafka.producer();

    // connect the producer to the broker
    await producer.connect();

    // send a single message
    const produceRecord = await producer.send({
        topic,
        messages: [{ key, value }],
    });
    console.log(
        `\n\n Produced message to topic ${topic}: key = ${key}, value = ${value}, ${JSON.stringify(
            produceRecord,
            null,
            2
        )} \n\n`
    );

    // disconnect the producer
    await producer.disconnect();
}

async function consume(topic: string, config: Record<string, string>): Promise<void> {
    // setup graceful shutdown
    const kafka = new Kafka({
        kafkaJS: {
            brokers: config["bootstrap.servers"].split(','),
            ssl: config["security.protocol"].includes('SSL'),
            sasl: {
                mechanism: config["sasl.mechanisms"].toUpperCase(),
                username: config["sasl.username"],
                password: config["sasl.password"]
            }
        }
    });
    const consumer = kafka.consumer({
        kafkaJS: {
            groupId: "nodejs-group-1"
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
            console.log(
                `Consumed message from topic ${topic}, partition ${partition}: key = ${message.key.toString()}, value = ${message.value.toString()}`
            );
        },
    });
}

async function main() {
    const config = readConfig("client.properties");
    const topic = "topic_0";

    await produce(topic, config);
    await consume(topic, config);
}

main();