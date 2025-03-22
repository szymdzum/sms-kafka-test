/**
 * SMS-specific extraction functions for XmlForge
 */
import logger from '../../../logger.js';
import { GenericXml, clearXmlCache } from './xml.js';
import { XML_PATHS } from '../config.js';
import { getXmlTextValue } from './xml.js';

/**
 * Extract the phone number from ATG SOAP XML
 */
export function extractPhoneNumber(xml: GenericXml): string {
  clearXmlCache();
  try {
    const phone = getXmlTextValue(xml, XML_PATHS.phoneNumber.path);
    return phone ?? '';
  } catch (error) {
    logger.warn('Could not extract phone number from SOAP XML', { error });
    return '';
  }
}

/**
 * Extract the message content from ATG SOAP XML
 */
export function extractMessage(xml: GenericXml): string {
  clearXmlCache();
  try {
    const message = getXmlTextValue(xml, XML_PATHS.message.path);
    return message ?? '';
  } catch (error) {
    logger.warn('Could not extract message from SOAP XML', { error });
    return '';
  }
}

/**
 * Extract the brand information from ATG SOAP XML
 */
export function extractBrand(xml: GenericXml): string {
  clearXmlCache();
  try {
    const brandName = getXmlTextValue(xml, XML_PATHS.brand.path, 'name');
    if (brandName) return brandName;

    const brandCode = getXmlTextValue(xml, XML_PATHS.brand.path);
    return brandCode ?? 'Unknown';
  } catch (error) {
    logger.warn('Could not extract brand from SOAP XML', { error });
    return 'Unknown';
  }
}

/**
 * Extract the brand name from ATG SOAP XML
 */
export function extractBrandName(xml: GenericXml): string | undefined {
  clearXmlCache();
  try {
    return getXmlTextValue(xml, XML_PATHS.brand.path, 'name');
  } catch (error) {
    logger.warn('Could not extract brand name from SOAP XML', { error });
    return undefined;
  }
}

/**
 * Extract the channel code from ATG SOAP XML
 */
export function extractChannel(xml: GenericXml): string | undefined {
  clearXmlCache();
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
export function extractChannelName(xml: GenericXml): string | undefined {
  clearXmlCache();
  try {
    return getXmlTextValue(xml, XML_PATHS.channel.path, 'name');
  } catch (error) {
    logger.warn('Could not extract channel name from SOAP XML', { error });
    return undefined;
  }
}

/**
 * Extract order ID from ATG SOAP XML
 */
export function extractOrderId(xml: GenericXml): string | undefined {
  clearXmlCache();
  try {
    return getXmlTextValue(xml, XML_PATHS.orderId.path) || undefined;
  } catch (error) {
    logger.warn('Could not extract order ID from SOAP XML', { error });
    return undefined;
  }
}

/**
 * Extract creation date and time from ATG SOAP XML
 */
export function extractCreationDateTime(xml: GenericXml): string | undefined {
  clearXmlCache();
  try {
    return getXmlTextValue(xml, XML_PATHS.creationDateTime.path) || undefined;
  } catch (error) {
    logger.warn('Could not extract creation date/time from SOAP XML', { error });
    return undefined;
  }
}

/**
 * Extract action expression from ATG SOAP XML
 */
export function extractActionExpression(xml: GenericXml): string | undefined {
  clearXmlCache();
  try {
    return getXmlTextValue(xml, XML_PATHS.actionExpression.path) || undefined;
  } catch (error) {
    logger.warn('Could not extract action expression from SOAP XML', { error });
    return undefined;
  }
}
