/**
 * XmlForge - XML to SMS data transformer
 *
 * This package provides tools for extracting SMS data from ATG SOAP XML messages.
 */

// Export types
export * from './types.js';

// Export transformer function
export { transformXmlToSmsData } from './transformer.js';

// Default export for convenience
import { transformXmlToSmsData } from './transformer.js';
export default transformXmlToSmsData;