import axios from 'axios';

import logger from './logger';
import { createCircuitBreaker, retryWithBackoff } from './retryUtils';


const INFOBIP_BASE_URL = process.env.INFOBIP_BASE_URL || 'https://pev4gm.api.infobip.com';
const INFOBIP_API_KEY = process.env.INFOBIP_API_KEY;
const DEFAULT_SENDER = 'KingFisher';

const apiClient = axios.create({
  baseURL: INFOBIP_BASE_URL,
  headers: {
    'Authorization': `App ${INFOBIP_API_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

interface InfobipResponse {
  messages: Array<{
    messageId: string;
    status: {
      name: string;
    };
  }>;
}

async function callInfobipApi(phoneNumber: string, text: string, senderId?: string) {
  const formattedNumber = formatPhoneNumber(phoneNumber);
  const actualSenderId = senderId || DEFAULT_SENDER;

  const payload = {
    messages: [
      {
        from: actualSenderId,
        destinations: [{ to: formattedNumber }],
        content: {
          text: text
        }
      }
    ]
  };

  logger.debug('Calling Infobip API', { to: formattedNumber, sender: actualSenderId });

  try {
    const response = await apiClient.post<InfobipResponse>('/sms/3/messages', payload);

    return {
      messageId: response.data.messages?.[0]?.messageId || 'unknown',
      status: response.data.messages?.[0]?.status?.name || 'unknown'
    };
  } catch (error) {
    // Handle Axios errors with detailed logging
    if (error && typeof error === 'object' && 'isAxiosError' in error) {
      const axiosError = error as any;  // Type assertion needed due to axios types
      const statusCode = axiosError.response?.status;
      const responseData = axiosError.response?.data;
      const requestUrl = axiosError.config?.url;

      logger.error('Infobip API call failed', {
        error: axiosError.message,
        statusCode,
        responseData,
        requestUrl,
        payload,
        phoneNumber: formattedNumber,
        sender: actualSenderId,
        apiKey: INFOBIP_API_KEY ? 'Set' : 'Not set'
      });
    } else {
      // Handle non-Axios errors
      logger.error('Infobip API call failed with non-HTTP error', {
        error: error instanceof Error ? error.message : String(error),
        phoneNumber: formattedNumber,
        sender: actualSenderId
      });
    }

    // Re-throw the error to be handled by the circuit breaker
    throw error;
  }
}

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

function formatPhoneNumber(phoneNumber: string): string {
  // Remove any non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');

  // UK number formatting
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return '44' + cleaned.substring(1);
  }

  return cleaned;
}