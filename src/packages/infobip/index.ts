/**
 * Infobip SMS API Client Package
 *
 * This package provides a client for the Infobip SMS API,
 * with utilities for sending SMS messages and managing configuration.
 */

import { sendSms } from './client.js';

// Re-export types
export * from './types.js';

// Re-export configuration
export { getInfobipConfig } from './config.js';
export type { InfobipConfig } from './config.js';

// Re-export utilities
export { formatPhoneNumber, isValidPhoneNumber } from './utils.js';

// Re-export client functionality
export {
  sendSms,
  sendBulkSms,
  createInfobipClient
  } from './client.js';

// Default export for convenience
export default sendSms;