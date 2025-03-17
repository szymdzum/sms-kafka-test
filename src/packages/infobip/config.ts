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

// Read configuration from environment variables
const INFOBIP_URL = process.env.INFOBIP_BASE_URL;
const INFOBIP_KEY = process.env.INFOBIP_API_KEY;
const DEFAULT_SENDER = process.env.INFOBIP_DEFAULT_SENDER || 'KingFisher';

// Validate required configuration
if (!INFOBIP_URL || !INFOBIP_KEY) {
  const error = 'Missing required environment variables: INFOBIP_BASE_URL or INFOBIP_API_KEY';
  logger.error(error);
  throw new Error(error);
}

/**
 * Get the Infobip configuration from environment variables
 */
export const getInfobipConfig = (): InfobipConfig => {
  return {
    baseUrl: INFOBIP_URL,
    apiKey: INFOBIP_KEY,
    defaultSender: DEFAULT_SENDER
  };
};

export default getInfobipConfig;