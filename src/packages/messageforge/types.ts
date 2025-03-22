/**
 * Types for MessageForge package
 */

/**
 * Supported message types
 */
export enum MessageType {
  SMS = 'SMS',
  EMAIL = 'EMAIL'
}

/**
 * Order status types
 */
export enum OrderStatus {
  ALLOCATED = 'ALLOCATED',
  COLLECTED = 'COLLECTED',
  REMINDER = 'REMINDER'
}

/**
 * Template configuration
 */
export interface TemplateConfig {
  type: MessageType;
  template: string;
  requiredParams: string[];
  status?: OrderStatus;
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