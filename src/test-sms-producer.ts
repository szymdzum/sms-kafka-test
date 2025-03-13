// test-kafka-producer.js
import { Kafka } from '@confluentinc/kafka-javascript/lib/kafkajs';
import dotenv from 'dotenv';

dotenv.config();

const kafka = new Kafka({
  clientId: 'test-producer',
  brokers: process.env.KAFKA_BROKERS,


  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD
  }
});

const producer = kafka.producer();

async function sendTestMessages() {
  await producer.connect();
  console.log('Connected to Kafka');

  // Send a test message for each brand
  const brands = ['BQUK', 'TradePoint', 'Screwfix'];

  for (const brand of brands) {
    const testMessage = {
      banner: brand,
      phoneNumber: process.env.TEST_PHONE_NUMBER,
      orderNumber: `TEST${Math.floor(Math.random() * 10000)}`,
      store: 'TestStore'
    };

    await producer.send({
      topic: process.env.KAFKA_TOPIC,
      messages: [{ value: JSON.stringify(testMessage) }]
    });

    console.log(`Sent test message for ${brand}`);
  }

  await producer.disconnect();
  console.log('Test messages sent, disconnected from Kafka');
}

sendTestMessages().catch(console.error);