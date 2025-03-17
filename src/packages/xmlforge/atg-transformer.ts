/**
 * ATG SOAP XML transformer for order data
 *
 * This module handles the specific format of SOAP XML messages from ATG
 */
import { parseStringPromise } from 'xml2js';
import logger from '../../logger.js';
import { Order, OrderStatus, ShippingMethod, Customer, OrderItem } from './types.js';
import { transformXmlToJson } from './transformer.js';
import getXmlForgeConfig from './config.js';

/**
 * Extract the brand information from ATG SOAP XML
 *
 * @param xmlData - Parsed XML data object
 * @returns Brand name/code
 */
function extractBrand(xmlData: any): string {
  try {
    // Navigate through the SOAP structure to find the brand code
    const brandElement = xmlData?.['SOAP-ENV:Envelope']?.['SOAP-ENV:Body']?.[0]
      ?.ProcessCommunication?.[0]?.DataArea?.[0]?.Communication?.[0]
      ?.CommunicationHeader?.[0]?.BrandChannel?.[0]?.Brand?.[0]?.['oa:Code']?.[0];

    // Get brand name or code (name attribute or text content)
    const brandName = brandElement?.$?.name;
    const brandCode = brandElement?._ || brandElement?.[0];

    return brandName || brandCode || 'Unknown';
  } catch (error) {
    logger.warn('Could not extract brand from SOAP XML', { error });
    return 'Unknown';
  }
}

/**
 * Extract the phone number from ATG SOAP XML
 *
 * @param xmlData - Parsed XML data object
 * @returns Phone number
 */
function extractPhoneNumber(xmlData: any): string {
  try {
    // Navigate through the SOAP structure to find the phone number
    const phoneNumber = xmlData?.['SOAP-ENV:Envelope']?.['SOAP-ENV:Body']?.[0]
      ?.ProcessCommunication?.[0]?.DataArea?.[0]?.Communication?.[0]
      ?.CommunicationHeader?.[0]?.CustomerParty?.[0]?.Contact?.[0]
      ?.SMSTelephoneCommunication?.[0]?.['oa:FormattedNumber']?.[0]?.trim();

    return phoneNumber || '';
  } catch (error) {
    logger.warn('Could not extract phone number from SOAP XML', { error });
    return '';
  }
}

/**
 * Extract the message content from ATG SOAP XML
 *
 * @param xmlData - Parsed XML data object
 * @returns Message text
 */
function extractMessage(xmlData: any): string {
  try {
    // Navigate through the SOAP structure to find the message content
    const message = xmlData?.['SOAP-ENV:Envelope']?.['SOAP-ENV:Body']?.[0]
      ?.ProcessCommunication?.[0]?.DataArea?.[0]?.Communication?.[0]
      ?.CommunicationItem?.[0]?.['oa:Message']?.[0]?.['oa:Note']?.[0];

    return message || '';
  } catch (error) {
    logger.warn('Could not extract message from SOAP XML', { error });
    return '';
  }
}

/**
 * Extract order ID or BODID from SOAP XML
 *
 * @param xmlData - Parsed XML data object
 * @returns Order ID
 */
function extractOrderId(xmlData: any): string {
  try {
    // Try to get the BODID from ApplicationArea
    const bodId = xmlData?.['SOAP-ENV:Envelope']?.['SOAP-ENV:Body']?.[0]
      ?.ProcessCommunication?.[0]?.['oa:ApplicationArea']?.[0]?.['oa:BODID']?.[0];

    if (bodId) {
      return bodId;
    }

    // Fallback to ActionExpression code
    const actionCode = xmlData?.['SOAP-ENV:Envelope']?.['SOAP-ENV:Body']?.[0]
      ?.ProcessCommunication?.[0]?.DataArea?.[0]?.['oa:Process']?.[0]
      ?.['oa:ActionCriteria']?.[0]?.['oa:ActionExpression']?.[0]?._;

    return actionCode || 'Unknown-ID';
  } catch (error) {
    logger.warn('Could not extract order ID from SOAP XML', { error });
    return 'Unknown-ID';
  }
}

/**
 * Extract creation date from SOAP XML
 *
 * @param xmlData - Parsed XML data object
 * @returns Creation date string
 */
function extractCreationDate(xmlData: any): string {
  try {
    // Get creation date from ApplicationArea
    const date = xmlData?.['SOAP-ENV:Envelope']?.['SOAP-ENV:Body']?.[0]
      ?.ProcessCommunication?.[0]?.['oa:ApplicationArea']?.[0]?.['oa:CreationDateTime']?.[0];

    return date || new Date().toISOString();
  } catch (error) {
    logger.warn('Could not extract creation date from SOAP XML', { error });
    return new Date().toISOString();
  }
}

/**
 * Extract channel information from SOAP XML
 *
 * @param xmlData - Parsed XML data object
 * @returns Channel name/code
 */
function extractChannel(xmlData: any): string {
  try {
    // Navigate through the SOAP structure to find the channel code
    const channelElement = xmlData?.['SOAP-ENV:Envelope']?.['SOAP-ENV:Body']?.[0]
      ?.ProcessCommunication?.[0]?.DataArea?.[0]?.Communication?.[0]
      ?.CommunicationHeader?.[0]?.BrandChannel?.[0]?.Channel?.[0]?.['oa:Code']?.[0];

    // Get channel name or code (name attribute or text content)
    const channelName = channelElement?.$?.name;
    const channelCode = channelElement?._ || channelElement?.[0];

    return channelName || channelCode || '';
  } catch (error) {
    logger.warn('Could not extract channel from SOAP XML', { error });
    return '';
  }
}

/**
 * Transforms ATG SOAP XML to a normalized Order object
 *
 * @param soapXml - SOAP XML string
 * @returns Order object
 */
export async function transformAtgSoapXml(soapXml: string): Promise<Order> {
  try {
    // Parse the SOAP XML
    const options = {
      explicitArray: true,
      mergeAttrs: false,
      tagNameProcessors: [],
      normalize: true,
      trim: true
    };

    const parsedXml = await parseStringPromise(soapXml, options);

    // Extract key information
    const brand = extractBrand(parsedXml);
    const phoneNumber = extractPhoneNumber(parsedXml);
    const message = extractMessage(parsedXml);
    const orderId = extractOrderId(parsedXml);
    const creationDate = extractCreationDate(parsedXml);
    const channel = extractChannel(parsedXml);

    // Extract order number from message if possible
    let orderNumber = orderId;
    if (message) {
      const orderNumberMatch = message.match(/order\s+([A-Z0-9]+)/i);
      if (orderNumberMatch && orderNumberMatch[1]) {
        orderNumber = orderNumberMatch[1];
      }
    }

    // Create a simplified Order object
    const order: Order = {
      id: orderId,
      orderNumber: orderNumber,
      orderDate: creationDate,
      status: OrderStatus.PROCESSING, // Default status
      customer: {
        id: 'ATG-CUSTOMER',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: phoneNumber
      },
      shippingAddress: {
        street1: '',
        city: '',
        postalCode: '',
        country: 'UK' // Default country
      },
      billingAddress: {
        street1: '',
        city: '',
        postalCode: '',
        country: 'UK' // Default country
      },
      items: [],
      shippingMethod: ShippingMethod.STANDARD, // Default shipping method
      subtotal: 0,
      shippingCost: 0,
      tax: 0,
      total: 0,
      brand: brand
    };

    // Add collection store info if it's in the message
    if (message.includes('collection') || channel.includes('COLLECT')) {
      order.shippingMethod = ShippingMethod.CLICK_AND_COLLECT;

      // Try to extract store name from message
      const storeMatch = message.match(/from\s+([^\.]+)/i);
      if (storeMatch && storeMatch[1]) {
        order.collectionStore = storeMatch[1].trim();
      }
    }

    // Try to extract delivery date if mentioned in message
    if (message) {
      const deliveryMatch = message.match(/delivery:?\s+([^\.]+)/i);
      if (deliveryMatch && deliveryMatch[1]) {
        order.estimatedDeliveryDate = deliveryMatch[1].trim();
      }
    }

    logger.info('Transformed ATG SOAP XML to Order object', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      brand: order.brand
    });

    return order;
  } catch (error) {
    logger.error('Failed to transform ATG SOAP XML', { error });
    throw new Error(`ATG SOAP XML transformation failed: ${(error as Error).message}`);
  }
}

/**
 * Detect if the XML is an ATG SOAP message
 *
 * @param xml - XML string to check
 * @returns True if it's an ATG SOAP message
 */
export function isAtgSoapXml(xml: string): boolean {
  return xml.includes('ProcessCommunication') &&
         xml.includes('SOAP-ENV:Envelope') &&
         xml.includes('SOAP-ENV:Body');
}