/**
 * XmlForge - XML to SMS data transformer
 *
 * This package provides tools for extracting SMS data from ATG SOAP XML messages.
 */

import { extractSmsData } from './parser.js';

// Export types
export * from './types.js';
export * from './config.js';
export * from './parser.js';

// Export main parser
export { extractSmsData } from './parser.js';

// Default export for convenience
export default extractSmsData;