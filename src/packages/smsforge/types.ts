/**
 * Types for SMSForge package
 */

/**
 * SMS message types
 */
export enum SmsType {
  ORDER = 'order',
  SHIPPING = 'shipping',
  DELIVERY = 'delivery',
  CANCELLATION = 'cancellation',
  REFUND = 'refund',
  CUSTOMER_SERVICE = 'customer_service'
}

/**
 * Order status types based on ATG types
 */
export enum OrderStatus {
  // Order acknowledgment statuses
  ORDER_SUBMITTED = 'ORDER_SUBMITTED',  // Order from WEB
  NEW_ORDER = 'NEW_ORDER',              // Order from .com+

  // Order allocation statuses
  CANCELLED = 'CANCELLED',              // Zero Allocation
  PARTIAL = 'PARTIAL',                  // Partial allocation
  ALLOCATED = 'ALLOCATED',              // Full allocation

  // Collection statuses
  COLLECTED = 'COLLECTED',              // Collection confirmation

  // Collection reminder statuses
  REMINDER = 'REMINDER',                // Collection reminder
  FINAL_REMINDER = 'FINAL_REMINDER',    // Final collection reminder
  EXPIRY_ALERT = 'EXPIRY_ALERT'         // Collection expiry
}

/**
 * Template configuration
 */
export interface TemplateConfig {
  type: SmsType;
  template: string;
  requiredParams: string[];
  status?: OrderStatus;
  from?: string;
}

/**
 * Template parameters
 */
export interface TemplateParams {
  [key: string]: string;
}

/**
 * Template validation error
 */
export class TemplateValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TemplateValidationError';
  }
}

/**
 * Template parameter error
 */
export class TemplateParameterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TemplateParameterError';
  }
}
