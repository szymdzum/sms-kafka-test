import { Infobip, AuthType } from '@infobip-api/sdk';
import * as dotenv from 'dotenv';
import logger from '../logger.js';

// Load environment variables from .env file
dotenv.config();

// Infobip SMS API Types
interface InfobipDestination {
  to: string;  // Required, 0-64 characters
  messageId?: string;  // Optional, 0-200 characters
  networkId?: number;  // Optional, int32, available in US and Canada
}

interface InfobipTextContent {
  text: string;
}

interface InfobipMessage {
  from: string;  // Sender ID, alphanumeric or numeric
  destinations: InfobipDestination[];  // Required array of destinations
  text?: string;  // For simple text messages
  content?: InfobipTextContent;  // For more complex content
}

interface InfobipSmsRequest {
  type: 'text';
  messages: InfobipMessage[];
}

const INFOBIP_URL = process.env.INFOBIP_BASE_URL;
const INFOBIP_KEY = process.env.INFOBIP_API_KEY;
const DEFAULT_SENDER = 'KingFisher';

if (!INFOBIP_URL || !INFOBIP_KEY) {
  throw new Error('Missing required environment variables: INFOBIP_BASE_URL or INFOBIP_API_KEY');
}

const infobip = new Infobip({
  baseUrl: INFOBIP_URL,
  apiKey: INFOBIP_KEY,
  authType: AuthType.ApiKey,
});

// Export the function so it can be imported by other modules
export const sendSms = async (phoneNumber: string, message: string, senderId?: string) => {

  logger.info(`Sending SMS to ${phoneNumber} with message ${message}`);

  const formattedNumber = formatPhoneNumber(phoneNumber);
  const actualSenderId = senderId || DEFAULT_SENDER;

  const messagePayload: InfobipSmsRequest = {
    type: 'text',
    messages: [{
      from: actualSenderId,
      destinations: [{ to: formattedNumber }],
      text: message,
    }],
  };

  const smsChannel = infobip.channels.sms;

  try {
    const response = await smsChannel.send(messagePayload);
    const { data } = response;

     logger.info('SMS sent successfully', { data });
     return data;
  } catch (error) {
     logger.error('Failed to send SMS', { error });
     throw error;
  }
};

// This was just a test call - let's comment it out as we're moving to a proper test module
// sendSms('48889403808', 'Siema Elo Wariatku');

function formatPhoneNumber(phoneNumber: string): string {
  // Remove any non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');

  // UK number formatting
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return '44' + cleaned.substring(1);
  }

  // PL number formatting
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return '48' + cleaned.substring(1);
  }

  return cleaned;
}

// Also export the phone formatter function for potential reuse
export { formatPhoneNumber };

/**
  const infobipBreaker = createCircuitBreaker(
  (phoneNumber: string, text: string, senderId?: string) => callInfobipApi(phoneNumber, text, senderId),
  'infobip-api'
);


export async function sendSms(phoneNumber: string, text: string, senderId?: string) {
  try {
    return await retryWithBackoff(
      () => infobipBreaker.fire(phoneNumber, text, senderId),
      {
        maxRetries: 3,
        initialDelay: 1000
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error('Failed to send SMS', { error: error.message });
    }
    throw error;
  }
}

*/