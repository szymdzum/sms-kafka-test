import { MessageTemplate, SmsType, OrderStatus } from '../template.js';
import { TemplateParams, TemplateValidationError, TemplateParameterError } from '../types.js';

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

  describe('message generation', () => {
    it('should generate message with order status', () => {
      const template = new MessageTemplate({
        type: SmsType.ORDER,
        status: OrderStatus.ALLOCATED,
        template: 'Order {orderId} is {status}',
        requiredParams: ['orderId']
      });

      const message = template.format({ orderId: '12345' });
      expect(message).toBe('Order 12345 is {status}');
      expect(template.getStatus()).toBe(OrderStatus.ALLOCATED);
    });

    it('should handle multiple parameters in template', () => {
      const template = new MessageTemplate({
        type: SmsType.ORDER,
        template: 'Order {orderId} for {customerName} is ready at {location}',
        requiredParams: ['orderId', 'customerName', 'location']
      });

      const message = template.format({
        orderId: '12345',
        customerName: 'John Doe',
        location: 'Store A'
      });

      expect(message).toBe('Order 12345 for John Doe is ready at Store A');
    });

    it('should preserve non-parameter text in template', () => {
      const template = new MessageTemplate({
        type: SmsType.ORDER,
        template: 'Your order {orderId} is ready. Please collect from {location}. Thank you!',
        requiredParams: ['orderId', 'location']
      });

      const message = template.format({
        orderId: '12345',
        location: 'Main Store'
      });

      expect(message).toBe('Your order 12345 is ready. Please collect from Main Store. Thank you!');
    });

    it('should handle special characters in parameters', () => {
      const template = new MessageTemplate({
        type: SmsType.ORDER,
        template: 'Order {orderId} - {description}',
        requiredParams: ['orderId', 'description']
      });

      const message = template.format({
        orderId: '12345',
        description: 'Special chars: !@#$%^&*()'
      });

      expect(message).toBe('Order 12345 - Special chars: !@#$%^&*()');
    });
  });
});