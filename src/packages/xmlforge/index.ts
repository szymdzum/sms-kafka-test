/**
 * XmlForge - XML to JSON transformation and SMS notification package
 *
 * This package provides tools for converting XML order data to JSON,
 * extracting relevant information, and sending SMS notifications.
 */

// Export types
export * from './types.js';

// Export configuration
export { getXmlForgeConfig, SMS_TEMPLATES } from './config.js';

// Export transformer functions
export {
  transformXmlToJson,
  transformOrderXml,
  extractSmsFields
} from './transformer.js';

// Export ATG SOAP transformer
export {
  transformAtgSoapXml,
  isAtgSoapXml
} from './atg-transformer.js';

// Export template functions
export {
  fillTemplate,
  validateTemplateData,
  getOrderTemplate,
  generateOrderSms
} from './template.js';

// Export handlers
export {
  processOrderAndSendSms,
  processBatchOrders
} from './handler.js';

// Default export for convenience
import { processOrderAndSendSms } from './handler.js';
export default processOrderAndSendSms;