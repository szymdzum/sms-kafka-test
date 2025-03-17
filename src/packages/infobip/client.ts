import { Infobip, AuthType } from '@infobip-api/sdk';
import logger from '../../logger.js';
import getInfobipConfig from './config.js';
import { InfobipSmsRequest, InfobipMessage } from './types.js';
import { formatPhoneNumber, isValidPhoneNumber } from './utils.js';

/**
 * Creates and returns an Infobip client instance
 */
export const createInfobipClient = () => {
  const config = getInfobipConfig();

  return new Infobip({
    baseUrl: config.baseUrl,
    apiKey: config.apiKey,
    authType: AuthType.ApiKey,
  });
};

/**
 * Sends an SMS message via the Infobip API
 *
 * @param phoneNumber - The recipient's phone number
 * @param message - The SMS message text
 * @param senderId - Optional custom sender ID
 * @returns The API response data
 * @throws Error if phone number is invalid
 */
export const sendSms = async (phoneNumber: string, message: string, senderId?: string) => {
  const config = getInfobipConfig();
  const infobip = createInfobipClient();

  logger.info(`Sending SMS to ${phoneNumber}`);

  // Format the phone number to E.164 format
  const formattedNumber = formatPhoneNumber(phoneNumber);

  // Log a warning if the phone number might be invalid
  if (!isValidPhoneNumber(phoneNumber)) {
    logger.warn(`Potentially invalid phone number: ${phoneNumber} (formatted: ${formattedNumber})`);
  }

  const actualSenderId = senderId || config.defaultSender;

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

/**
 * Sends multiple SMS messages in a single request
 *
 * @param messages - Array of message objects with recipient, text, and optional senderId
 * @returns The API response data
 */
export const sendBulkSms = async (
  messages: Array<{ phoneNumber: string; message: string; senderId?: string }>
) => {
  const config = getInfobipConfig();
  const infobip = createInfobipClient();

  logger.info(`Sending bulk SMS to ${messages.length} recipients`);

  // Format and validate all phone numbers
  const infobipMessages: InfobipMessage[] = messages.map(({ phoneNumber, message, senderId }) => {
    const formattedNumber = formatPhoneNumber(phoneNumber);

    // Log a warning if the phone number might be invalid
    if (!isValidPhoneNumber(phoneNumber)) {
      logger.warn(`Potentially invalid phone number: ${phoneNumber} (formatted: ${formattedNumber})`);
    }

    return {
      from: senderId || config.defaultSender,
      destinations: [{ to: formattedNumber }],
      text: message,
    };
  });

  const messagePayload: InfobipSmsRequest = {
    type: 'text',
    messages: infobipMessages,
  };

  const smsChannel = infobip.channels.sms;

  try {
    const response = await smsChannel.send(messagePayload);
    const { data } = response;

    logger.info('Bulk SMS sent successfully', { data });
    return data;
  } catch (error) {
    logger.error('Failed to send bulk SMS', { error });
    throw error;
  }
};