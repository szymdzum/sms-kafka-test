import { EmailTemplate, EmailType, OrderStatus } from '../template.js';
import { EmailTemplateConfig, EmailTemplateParams, TemplateValidationError, TemplateParameterError } from '../types.js';

describe('EmailTemplate', () => {
  const validConfig: EmailTemplateConfig = {
    type: EmailType.ORDER,
    status: OrderStatus.CONFIRMED,
    template: 'Order {orderId} has been {status}',
    htmlTemplate: '<p>Order <strong>{orderId}</strong> has been <em>{status}</em></p>',
    subject: 'Order Status Update',
    requiredParams: ['orderId', 'status']
  };

  describe('constructor', () => {
    it('should create a valid template instance', () => {
      const template = new EmailTemplate(validConfig);
      expect(template.getType()).toBe(EmailType.ORDER);
      expect(template.getStatus()).toBe(OrderStatus.CONFIRMED);
      expect(template.getTemplate()).toBe(validConfig.template);
      expect(template.getHtmlTemplate()).toBe(validConfig.htmlTemplate);
      expect(template.getSubject()).toBe(validConfig.subject);
      expect(template.getRequiredParams()).toEqual(['orderId', 'status']);
    });

    it('should throw error for missing template', () => {
      const invalidConfig = { ...validConfig, template: '' };
      expect(() => new EmailTemplate(invalidConfig)).toThrow(TemplateValidationError);
    });

    it('should throw error for invalid required params', () => {
      const invalidConfig = { ...validConfig, requiredParams: null as any };
      expect(() => new EmailTemplate(invalidConfig)).toThrow(TemplateValidationError);
    });
  });

  describe('format', () => {
    it('should format template with valid parameters', () => {
      const template = new EmailTemplate(validConfig);
      const params: EmailTemplateParams = {
        orderId: '12345',
        status: 'confirmed'
      };
      const result = template.format(params);
      expect(result.subject).toBe('Order Status Update');
      expect(result.text).toBe('Order 12345 has been confirmed');
      expect(result.html).toBe('<p>Order <strong>12345</strong> has been <em>confirmed</em></p>');
    });

    it('should throw error for missing required parameters', () => {
      const template = new EmailTemplate(validConfig);
      const params: EmailTemplateParams = {
        orderId: '12345'
      };
      expect(() => template.format(params)).toThrow(TemplateParameterError);
    });
  });

  describe('getters', () => {
    it('should return correct values', () => {
      const template = new EmailTemplate(validConfig);
      expect(template.getType()).toBe(EmailType.ORDER);
      expect(template.getStatus()).toBe(OrderStatus.CONFIRMED);
      expect(template.getTemplate()).toBe(validConfig.template);
      expect(template.getHtmlTemplate()).toBe(validConfig.htmlTemplate);
      expect(template.getSubject()).toBe(validConfig.subject);
      expect(template.getRequiredParams()).toEqual(['orderId', 'status']);
    });
  });
});