import { MessageTemplate, SmsType } from '../template.js';
import { TemplateConfig, TemplateParams, TemplateValidationError, TemplateParameterError } from '../types.js';

describe('MessageTemplate', () => {
  describe('constructor', () => {
    it('should create a template with valid config', () => {
      const template = new MessageTemplate({
        type: SmsType.ORDER,
        template: 'Hello {name}!',
        requiredParams: ['name']
      });

      expect(template.getType()).toBe(SmsType.ORDER);
      expect(template.getTemplate()).toBe('Hello {name}!');
      expect(template.getRequiredParams()).toEqual(['name']);
    });

    it('should throw error for empty template', () => {
      expect(() => new MessageTemplate({
        type: SmsType.ORDER,
        template: '',
        requiredParams: []
      })).toThrow(TemplateValidationError);
    });

    it('should throw error for invalid requiredParams', () => {
      expect(() => new MessageTemplate({
        type: SmsType.ORDER,
        template: 'Hello {name}!',
        requiredParams: null as any
      })).toThrow(TemplateValidationError);
    });
  });

  describe('format', () => {
    it('should format template with all required parameters', () => {
      const template = new MessageTemplate({
        type: SmsType.ORDER,
        template: 'Hello {name}! Your order {orderId} is ready.',
        requiredParams: ['name', 'orderId']
      });

      const params: TemplateParams = {
        name: 'John',
        orderId: '12345'
      };

      expect(template.format(params)).toBe('Hello John! Your order 12345 is ready.');
    });

    it('should throw error for missing required parameters', () => {
      const template = new MessageTemplate({
        type: SmsType.ORDER,
        template: 'Hello {name}!',
        requiredParams: ['name']
      });

      const params: TemplateParams = {
        // Missing required 'name' parameter
      };

      expect(() => template.format(params)).toThrow(TemplateParameterError);
    });

    it('should handle optional parameters', () => {
      const template = new MessageTemplate({
        type: SmsType.ORDER,
        template: 'Hello {name}! {greeting}',
        requiredParams: ['name']
      });

      const params: TemplateParams = {
        name: 'John',
        greeting: 'Good morning!'
      };

      expect(template.format(params)).toBe('Hello John! Good morning!');
    });
  });
});