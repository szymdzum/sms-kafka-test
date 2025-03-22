/**
 * SMSForge configuration
 */
import { MessageTemplate, OrderStatus } from './template.js';
import {
  // Collection templates
  fullAllocationTemplate,
  partialAllocationTemplate,
  cancelledOrderTemplate,
  collectionConfirmationTemplate,

  // Order acknowledgement templates
  orderSubmittedTemplate,
  newOrderTemplate,

  // Reminder templates
  collectionReminderTemplate,
  finalReminderTemplate,
  expiryAlertTemplate
} from './templates/index.js';

/**
 * Map of order statuses to their corresponding templates
 */
export const TEMPLATE_MAP = new Map<OrderStatus, MessageTemplate>([
  // Order acknowledgement templates
  [OrderStatus.ORDER_SUBMITTED, orderSubmittedTemplate],
  [OrderStatus.NEW_ORDER, newOrderTemplate],

  // Collection templates
  [OrderStatus.ALLOCATED, fullAllocationTemplate],
  [OrderStatus.PARTIAL, partialAllocationTemplate],
  [OrderStatus.CANCELLED, cancelledOrderTemplate],
  [OrderStatus.COLLECTED, collectionConfirmationTemplate],

  // Reminder templates
  [OrderStatus.REMINDER, collectionReminderTemplate],
  [OrderStatus.FINAL_REMINDER, finalReminderTemplate],
  [OrderStatus.EXPIRY_ALERT, expiryAlertTemplate]
]);

/**
 * Template parameter requirements for each status
 */
export const TEMPLATE_REQUIREMENTS = {
  // Order acknowledgement statuses
  [OrderStatus.ORDER_SUBMITTED]: ['orderId', 'brand'],
  [OrderStatus.NEW_ORDER]: ['orderId'],

  // Order allocation statuses
  [OrderStatus.CANCELLED]: ['orderId'],
  [OrderStatus.PARTIAL]: ['orderId'],
  [OrderStatus.ALLOCATED]: ['orderId'],

  // Collection status
  [OrderStatus.COLLECTED]: ['orderId'],

  // Reminder statuses
  [OrderStatus.REMINDER]: ['orderId', 'expiryDate'],
  [OrderStatus.FINAL_REMINDER]: ['orderId', 'expiryDate'],
  [OrderStatus.EXPIRY_ALERT]: ['orderId', 'expiryDate']
} as const;

/**
 * Custom error types for SMSForge
 */
export class TemplateNotFoundError extends Error {
  constructor(orderStatus: OrderStatus) {
    super(`No template found for order status: ${orderStatus}`);
    this.name = 'TemplateNotFoundError';
  }
}

/**
 * SMS message types and their configurations
 */
export const SMS_CONFIG = {
  // Order acknowledgement
  [OrderStatus.ORDER_SUBMITTED]: {
    type: 'order',
    category: 'acknowledgement',
  },
  [OrderStatus.NEW_ORDER]: {
    type: 'order',
    category: 'acknowledgement',
  },

  // Allocation statuses
  [OrderStatus.CANCELLED]: {
    type: 'cancellation',
    category: 'collection',
  },
  [OrderStatus.PARTIAL]: {
    type: 'order',
    category: 'collection',
  },
  [OrderStatus.ALLOCATED]: {
    type: 'order',
    category: 'collection',
  },

  // Collection status
  [OrderStatus.COLLECTED]: {
    type: 'order',
    category: 'collection',
  },

  // Reminder statuses
  [OrderStatus.REMINDER]: {
    type: 'order',
    category: 'reminder',
  },
  [OrderStatus.FINAL_REMINDER]: {
    type: 'order',
    category: 'reminder',
  },
  [OrderStatus.EXPIRY_ALERT]: {
    type: 'order',
    category: 'reminder',
  }
} as const;

/**
 * Validation rules for template parameters
 */
export const PARAMETER_RULES = {
  orderId: {
    pattern: /^[A-Z0-9]{6,12}$/,  // Example pattern for order IDs
    required: true
  },
  expiryDate: {
    pattern: /^[\d\/-]{8,10}$/,  // Simple pattern for dates like YYYY-MM-DD or DD/MM/YYYY
    required: true
  },
  brand: {
    pattern: /^[A-Za-z0-9]{2,20}$/,  // Simple pattern for brand names
    required: true
  }
} as const;

/**
 * Default sender IDs for different brands
 */
export const DEFAULT_SENDERS = {
  BQUK: 'BQUK',
  TRADEPOINT: 'TRADEPOINT',
  SCREWFIX: 'SCREWFIX'
} as const;