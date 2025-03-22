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
 * Order status types
 */
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  ALLOCATED = 'allocated',
  COLLECTED = 'collected',
  REMINDER = 'reminder'
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
