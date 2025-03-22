/**
 * SMS-specific extraction functions for XmlForge
 */
import logger from '../../../logger.js';
import { AtgSoapXml } from '../types.js';
import { XML_PATHS } from '../config.js';
import { getXmlValue } from './xml.js';

/**
 * Extract the phone number from ATG SOAP XML
 */
export function extractPhoneNumber(xml: AtgSoapXml): string {
  try {
    return getXmlValue(xml, XML_PATHS.phone.path);
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
    return getXmlValue(xml, XML_PATHS.message.path);
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
    const brandElement = getXmlValue<{ $?: { name: string } } | string>(xml, XML_PATHS.brand.path);

    // Handle both string and object with name attribute
    if (typeof brandElement === 'string') {
      return brandElement || 'Unknown';
    }
    return brandElement?.$?.name || 'Unknown';
  } catch (error) {
    logger.warn('Could not extract brand from SOAP XML', { error });
    return 'Unknown';
  }
}

/**
 * Extract order ID from ATG SOAP XML
 */
export function extractOrderId(xml: AtgSoapXml): string | undefined {
  try {
    const orderId = getXmlValue<string>(xml, XML_PATHS.orderId.path);
    return orderId || undefined;
  } catch (error) {
    logger.warn('Could not extract order ID from SOAP XML', { error });
    return undefined;
  }
}