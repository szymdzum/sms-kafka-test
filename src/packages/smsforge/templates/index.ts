/**
 * SMSForge templates exports
 */

// Collection templates
export * from './collection.js';        // Full allocation template
export * from './confirmation.js';      // Collection confirmation template
export * from './partial.js';           // Partial allocation template
export * from './cancelled.js';         // Zero allocation/cancelled template

// Order acknowledgement templates
export * from './order-submitted.js';   // Order from WEB template
export * from './new-order.js';         // Order from .com+ template

// Reminder templates
export * from './reminder.js';          // Collection reminder template
export * from './final-reminder.js';    // Final collection reminder template
export * from './expiry.js';            // Collection expiry alert template
