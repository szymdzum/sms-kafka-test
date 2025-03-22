/**
 * Types for EmailForge package
 */

/**
 * Email message types
 */
export enum EmailType {
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
 * Email template configuration
 */
export interface EmailTemplateConfig {
  type: EmailType;
  template: string;
  requiredParams: string[];
  status?: OrderStatus;
  htmlTemplate?: string;
  subject: string;
  from?: string;
  replyTo?: string;
}

/**
 * Email template parameters
 */
export interface EmailTemplateParams {
  [key: string]: string | number | boolean;
}

/**
 * Formatted email content
 */
export interface FormattedEmail {
  subject: string;
  text: string;
  html?: string;
  from?: string;
  replyTo?: string;
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