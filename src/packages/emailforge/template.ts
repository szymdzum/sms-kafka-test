/**
 * Email template implementation
 */
import {
  EmailType,
  OrderStatus,
  EmailTemplateConfig,
  EmailTemplateParams,
  TemplateValidationError,
  TemplateParameterError,
  FormattedEmail
} from './types.js';

export { EmailType, OrderStatus };

/**
 * Email template class for handling email message formatting
 */
export class EmailTemplate {
  private readonly type: EmailType;
  private readonly status?: OrderStatus;
  private readonly template: string;
  private readonly htmlTemplate?: string;
  private readonly subject: string;
  private readonly from?: string;
  private readonly replyTo?: string;
  private readonly requiredParams: string[];

  constructor(config: EmailTemplateConfig) {
    this.validateConfig(config);
    this.type = config.type;
    this.status = config.status;
    this.template = config.template;
    this.htmlTemplate = config.htmlTemplate;
    this.subject = config.subject;
    this.from = config.from;
    this.replyTo = config.replyTo;
    this.requiredParams = config.requiredParams;
  }

  /**
   * Format the email with provided parameters
   */
  format(params: EmailTemplateParams): FormattedEmail {
    this.validateParams(params);
    return {
      subject: this.replaceParams(this.subject, params),
      text: this.replaceParams(this.template, params),
      html: this.htmlTemplate ? this.replaceParams(this.htmlTemplate, params) : undefined,
      from: this.from,
      replyTo: this.replyTo
    };
  }

  /**
   * Get the email type
   */
  getType(): EmailType {
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
   * Get the HTML template string
   */
  getHtmlTemplate(): string | undefined {
    return this.htmlTemplate;
  }

  /**
   * Get the email subject
   */
  getSubject(): string {
    return this.subject;
  }

  /**
   * Get the from address
   */
  getFrom(): string | undefined {
    return this.from;
  }

  /**
   * Get the reply-to address
   */
  getReplyTo(): string | undefined {
    return this.replyTo;
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
  private validateConfig(config: EmailTemplateConfig): void {
    if (!config.template) {
      throw new TemplateValidationError('Template string is required');
    }
    if (!config.subject) {
      throw new TemplateValidationError('Subject is required');
    }
    if (!Array.isArray(config.requiredParams)) {
      throw new TemplateValidationError('Required parameters must be an array');
    }
  }

  /**
   * Validate provided parameters
   */
  private validateParams(params: EmailTemplateParams): void {
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
  private replaceParams(template: string, params: EmailTemplateParams): string {
    return template.replace(/\{(\w+)\}/g, (match: string, key: string): string => {
      const value = params[key];
      return value !== undefined ? String(value) : match;
    });
  }
}