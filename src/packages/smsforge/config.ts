/**
 * SMSForge configuration
 */
import { MessageTemplate, OrderStatus } from './template.js';
import {
  fullAllocationTemplate,
  collectionConfirmationTemplate,
  collectionReminderTemplate
} from './templates/index.js';

/**
 * Map of order statuses to their corresponding templates
 */
export const TEMPLATE_MAP = new Map<OrderStatus, MessageTemplate>([
  [OrderStatus.ALLOCATED, fullAllocationTemplate],
  [OrderStatus.COLLECTED, collectionConfirmationTemplate],
  [OrderStatus.REMINDER, collectionReminderTemplate]
]);

/**
 * Template parameter requirements for each status
 */
export const TEMPLATE_REQUIREMENTS = {
  [OrderStatus.ALLOCATED]: ['orderId'],
  [OrderStatus.COLLECTED]: ['orderId'],
  [OrderStatus.REMINDER]: ['orderId']
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
  [OrderStatus.ALLOCATED]: {
    type: 'order',
    category: 'collection',
  },
  [OrderStatus.COLLECTED]: {
    type: 'order',
    category: 'collection',
  },
  [OrderStatus.REMINDER]: {
    type: 'order',
    category: 'collection',
  }
} as const;

/**
 * Validation rules for template parameters
 */
export const PARAMETER_RULES = {
  orderId: {
    pattern: /^[A-Z0-9]{6,12}$/,  // Example pattern for order IDs
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