import dotenv from 'dotenv';
dotenv.config();  // Load .env file if present for local development

interface AppConfig {
  kafkaBrokers: string[];         // Kafka broker list, e.g., ["b-1.msk.amazonaws.com:9092", "b-2.msk.amazonaws.com:9092"]
  kafkaTopic: string;            // Kafka topic name for SMS requests
  kafkaConsumerGroup: string;    // Consumer group ID for Kafka (for the event source or local consumer)
  infobipBaseUrl: string;        // Base URL for Infobip API (could be region-specific)
  infobipApiKey: string;         // API key for Infobip (securely provided)
  infobipFrom: string;           // Sender ID or phone for Infobip SMS
  environment: string;           // Environment name (e.g., "dev", "prod"), for logging or conditional logic
}

const requiredEnv = (name: string): string => {
  const val = process.env[name];
  if (!val) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return val;
};

const config: AppConfig = {
  kafkaBrokers: requiredEnv('KAFKA_BROKERS').split(','),
  kafkaTopic: requiredEnv('KAFKA_TOPIC'),
  kafkaConsumerGroup: process.env.KAFKA_CONSUMER_GROUP || 'sms-consumer-group',
  infobipBaseUrl: process.env.INFOBIP_BASE_URL || 'https://api.infobip.com',
  infobipApiKey: requiredEnv('INFOBIP_API_KEY'),
  infobipFrom: process.env.INFOBIP_FROM || 'InfoSMS',  // default sender
  environment: process.env.NODE_ENV || 'development'
};

export default config;