/**
 * SMS-specific extraction functions for XmlForge
 */
import logger from '../../../logger.js';
import { AtgSoapXml } from '../types.js';
import { XML_PATHS } from '../config.js';
import { getXmlTextValue } from './xml.js';

/**
 * Extract the phone number from ATG SOAP XML
 */
export function extractPhoneNumber(xml: AtgSoapXml): string {
  try {
    const phone = getXmlTextValue(xml, XML_PATHS.phone.path);
    return phone || '';
  } catch (error) {
    logger.warn('Could not extract phone number from SOAP XML', { error });
    return '';
  }
}

/**
 * Extract the message content from ATG SOAP XML
 */
export function extractMessage(xml: AtgSoapXml): string {
  try {
    const message = getXmlTextValue(xml, XML_PATHS.message.path);
    return message || '';
  } catch (error) {
    logger.warn('Could not extract message from SOAP XML', { error });
    return '';
  }
}

/**
 * Extract the brand information from ATG SOAP XML
 */
export function extractBrand(xml: AtgSoapXml): string {
  try {
    // Get brand name attribute if available, otherwise use the text content
    const brand = getXmlTextValue(xml, XML_PATHS.brand.path, 'name') ||
                  getXmlTextValue(xml, XML_PATHS.brand.path);
    return brand || 'Unknown';
  } catch (error) {
    logger.warn('Could not extract brand from SOAP XML', { error });
    return 'Unknown';
  }
}

/**
 * Extract the brand name from ATG SOAP XML
 */
export function extractBrandName(xml: AtgSoapXml): string | undefined {
  try {
    return getXmlTextValue(xml, XML_PATHS.brandName.path);
  } catch (error) {
    logger.warn('Could not extract brand name from SOAP XML', { error });
    return undefined;
  }
}

/**
 * Extract the channel code from ATG SOAP XML
 */
export function extractChannel(xml: AtgSoapXml): string | undefined {
  try {
    return getXmlTextValue(xml, XML_PATHS.channel.path);
  } catch (error) {
    logger.warn('Could not extract channel from SOAP XML', { error });
    return undefined;
  }
}

/**
 * Extract the channel name from ATG SOAP XML
 */
export function extractChannelName(xml: AtgSoapXml): string | undefined {
  try {
    return getXmlTextValue(xml, XML_PATHS.channelName.path);
  } catch (error) {
    logger.warn('Could not extract channel name from SOAP XML', { error });
    return undefined;
  }
}

/**
 * Extract order ID from ATG SOAP XML
 */
export function extractOrderId(xml: AtgSoapXml): string | undefined {
  try {
    return getXmlTextValue(xml, XML_PATHS.orderId.path);
  } catch (error) {
    logger.warn('Could not extract order ID from SOAP XML', { error });
    return undefined;
  }
}

/**
 * Extract creation date and time from ATG SOAP XML
 */
export function extractCreationDateTime(xml: AtgSoapXml): string | undefined {
  try {
    return getXmlTextValue(xml, XML_PATHS.creationDateTime.path);
  } catch (error) {
    logger.warn('Could not extract creation date/time from SOAP XML', { error });
    return undefined;
  }
}

/**
 * Extract action expression from ATG SOAP XML
 */
export function extractActionExpression(xml: AtgSoapXml): string | undefined {
  try {
    return getXmlTextValue(xml, XML_PATHS.actionExpression.path);
  } catch (error) {
    logger.warn('Could not extract action expression from SOAP XML', { error });
    return undefined;
  }
}