/**
 * Message template implementation
 */
import { MessageType, OrderStatus, TemplateConfig, TemplateParams, TemplateValidationError, TemplateParameterError } from './types.js';

export { MessageType, OrderStatus };

/**
 * Message template class for handling message formatting
 */
export class MessageTemplate {
  private readonly type: MessageType;
  private readonly status?: OrderStatus;
  private readonly template: string;
  private readonly requiredParams: string[];

  constructor(config: TemplateConfig) {
    this.validateConfig(config);
    this.type = config.type;
    this.status = config.status;
    this.template = config.template;
    this.requiredParams = config.requiredParams;
  }

  /**
   * Format the template with provided parameters
   */
  format(params: TemplateParams): string {
    this.validateParams(params);
    return this.replaceParams(this.template, params);
  }

  /**
   * Get the message type
   */
  getType(): MessageType {
    return this.type;
  }

  /**
   * Get the order status
   */
  getStatus(): OrderStatus | undefined {
    return this.status;
  }

  /**
   * Get the template string
   */
  getTemplate(): string {
    return this.template;
  }

  /**
   * Get required parameters
   */
  getRequiredParams(): string[] {
    return [...this.requiredParams];
  }

  /**
   * Validate template configuration
   */
  private validateConfig(config: TemplateConfig): void {
    if (!config.template) {
      throw new TemplateValidationError('Template string is required');
    }
    if (!Array.isArray(config.requiredParams)) {
      throw new TemplateValidationError('Required parameters must be an array');
    }
  }

  /**
   * Validate provided parameters
   */
  private validateParams(params: TemplateParams): void {
    const missingParams = this.requiredParams.filter(param => !(param in params));
    if (missingParams.length > 0) {
      throw new TemplateParameterError(
        `Missing required parameters: ${missingParams.join(', ')}`
      );
    }
  }

  /**
   * Replace parameters in template string
   */
  private replaceParams(template: string, params: TemplateParams): string {
    return template.replace(/\{(\w+)\}/g, (match: string, key: string): string => {
      const value = params[key];
      return value !== undefined ? value : match;
    });
  }
}