/**
 * Handler for processing XML orders and sending SMS notifications
 */
import logger from '../../logger.js';
import { sendSms } from '../infobip/index.js';
import { Order } from './types.js';
import { transformOrderXml } from './transformer.js';
import { generateOrderSms } from './template.js';
import getXmlForgeConfig from './config.js';
import { transformAtgSoapXml } from './atg-transformer.js';
import { isAtgSoapXml } from './utils.js';

/**
 * Process an XML order and send SMS notification if needed
 *
 * @param xmlData - XML order data (can be simple XML or SOAP XML)
 * @param templateType - The type of notification template to use
 * @returns The processed order and SMS result
 */
export async function processOrderAndSendSms(
  xmlData: string,
  templateType: string = 'order_confirmation'
): Promise<{ order: Order; smsSent: boolean; smsError?: Error }> {
  try {
    // Parse XML to order object - detect if it's ATG SOAP format
    const order = isAtgSoapXml(xmlData)
      ? await transformAtgSoapXml(xmlData)
      : await transformOrderXml(xmlData);

    // Generate SMS text from order
    const smsText = generateOrderSms(order, templateType);

    let smsSent = false;
    let smsError: Error | undefined;

    // Only send SMS if we have a valid message and phone number
    if (smsText && order.customer?.phoneNumber) {
      try {
        logger.info('Sending order notification SMS', {
          orderId: order.id,
          orderNumber: order.orderNumber,
          templateType
        });

        // Send SMS via Infobip
        await sendSms(
          order.customer.phoneNumber,
          smsText,
          order.brand // Use brand as sender ID
        );

        smsSent = true;

        logger.info('Order notification SMS sent successfully', {
          orderId: order.id,
          orderNumber: order.orderNumber
        });
      } catch (error) {
        smsError = error instanceof Error ? error : new Error(String(error));
        logger.error('Failed to send order notification SMS', {
          error: smsError,
          orderId: order.id,
          orderNumber: order.orderNumber
        });
      }
    } else {
      if (!smsText) {
        logger.warn('Could not generate SMS text for order', {
          orderId: order.id,
          orderNumber: order.orderNumber
        });
      }
      if (!order.customer?.phoneNumber) {
        logger.warn('Order has no customer phone number', {
          orderId: order.id,
          orderNumber: order.orderNumber
        });
      }
    }

    return { order, smsSent, smsError };
  } catch (error) {
    logger.error('Failed to process order XML', { error });
    throw error;
  }
}

/**
 * Process a batch of XML orders and send SMS notifications
 *
 * @param xmlDataArray - Array of XML order data
 * @param templateType - The type of notification template to use
 * @returns Processing results for each order
 */
export async function processBatchOrders(
  xmlDataArray: string[],
  templateType: string = 'order_confirmation'
): Promise<Array<{ order: Order; smsSent: boolean; smsError?: Error }>> {
  const results = [];

  for (const xmlData of xmlDataArray) {
    try {
      const result = await processOrderAndSendSms(xmlData, templateType);
      results.push(result);
    } catch (error) {
      logger.error('Failed to process order in batch', { error });
      // Continue with next order even if one fails
    }
  }

  return results;
}