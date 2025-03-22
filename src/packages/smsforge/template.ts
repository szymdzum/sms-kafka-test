/**
 * SMS template implementation
 */
import {
  SmsType,
  OrderStatus,
  TemplateConfig,
  TemplateParams
} from './types.js';
import { validateTemplateConfig, validateTemplateParams, replaceTemplateParams } from './utils/validators.js';

export { SmsType, OrderStatus };

/**
 * SMS template class for handling message formatting
 */
export class MessageTemplate {
  private readonly type: SmsType;
  private readonly status?: OrderStatus;
  private readonly template: string;
  private readonly requiredParams: string[];

  constructor(config: TemplateConfig) {
    validateTemplateConfig(config);
    this.type = config.type;
    this.status = config.status;
    this.template = config.template;
    this.requiredParams = config.requiredParams;
  }

  getType(): SmsType {
    return this.type;
  }

  getTemplate(): string {
    return this.template;
  }

  getRequiredParams(): string[] {
    return this.requiredParams;
  }

  /**
   * Format the template with provided parameters
   */
  format(params: TemplateParams): string {
    validateTemplateParams(params, this.requiredParams);
    return replaceTemplateParams(this.template, params);
  }

  /**
   * Get the order status
   */
  getStatus(): OrderStatus | undefined {
    return this.status;
  }
}