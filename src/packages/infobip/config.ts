import * as dotenv from 'dotenv';
import logger from '../../logger.js';

// Load environment variables from .env file
dotenv.config();

/**
 * Configuration for the Infobip client
 */
export interface InfobipConfig {
  /** Base URL for the Infobip API */
  baseUrl: string;
  /** API key for authentication */
  apiKey: string;
  /** Default sender ID for SMS messages */
  defaultSender: string;
}

/**
 * Environment-specific configuration
 */
const environments = {
  development: {
    baseUrl: process.env.INFOBIP_DEV_BASE_URL,
    apiKey: process.env.INFOBIP_DEV_API_KEY,
    defaultSender: process.env.INFOBIP_DEV_DEFAULT_SENDER || 'KingFisher-Dev'
  },
  test: {
    baseUrl: process.env.INFOBIP_TEST_BASE_URL,
    apiKey: process.env.INFOBIP_TEST_API_KEY,
    defaultSender: process.env.INFOBIP_TEST_DEFAULT_SENDER || 'KingFisher-Test'
  },
  production: {
    baseUrl: process.env.INFOBIP_PROD_BASE_URL,
    apiKey: process.env.INFOBIP_PROD_API_KEY,
    defaultSender: process.env.INFOBIP_PROD_DEFAULT_SENDER || 'KingFisher'
  }
};

// Get current environment from NODE_ENV or default to development
const currentEnv = (process.env.NODE_ENV || 'development') as keyof typeof environments;

/**
 * Get the Infobip configuration for the current environment
 */
export const getInfobipConfig = (): InfobipConfig => {
  const envConfig = environments[currentEnv];

  // Validate required configuration
  if (!envConfig.baseUrl || !envConfig.apiKey) {
    const error = `Missing required environment variables for ${currentEnv} environment: INFOBIP_${currentEnv.toUpperCase()}_BASE_URL or INFOBIP_${currentEnv.toUpperCase()}_API_KEY`;
    logger.error(error);
    throw new Error(error);
  }

  return {
    baseUrl: envConfig.baseUrl,
    apiKey: envConfig.apiKey,
    defaultSender: envConfig.defaultSender
  };
};

export default getInfobipConfig;