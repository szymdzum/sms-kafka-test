import { MessageTemplate, MessageType } from '../template.js';

describe('MessageTemplate', () => {
  describe('constructor', () => {
    it('should create a template with valid config', () => {
      const template = new MessageTemplate({
        type: MessageType.SMS,
        template: 'Hello {name}!',
        requiredParams: ['name']
      });

      expect(template.getType()).toBe(MessageType.SMS);
      expect(template.getTemplate()).toBe('Hello {name}!');
      expect(template.getRequiredParams()).toEqual(['name']);
    });

    it('should throw error for empty template', () => {
      expect(() => new MessageTemplate({
        type: MessageType.SMS,
        template: '',
        requiredParams: []
      })).toThrow('Template string is required');
    });

    it('should throw error for invalid requiredParams', () => {
      expect(() => new MessageTemplate({
        type: MessageType.SMS,
        template: 'Hello {name}!',
        requiredParams: null as any
      })).toThrow('Required parameters must be an array');
    });
  });

  describe('format', () => {
    it('should format template with all required parameters', () => {
      const template = new MessageTemplate({
        type: MessageType.SMS,
        template: 'Hello {name}! Your order {orderId} is ready.',
        requiredParams: ['name', 'orderId']
      });

      const result = template.format({
        name: 'John',
        orderId: '12345'
      });

      expect(result).toBe('Hello John! Your order 12345 is ready.');
    });

    it('should throw error for missing required parameters', () => {
      const template = new MessageTemplate({
        type: MessageType.SMS,
        template: 'Hello {name}!',
        requiredParams: ['name']
      });

      expect(() => template.format({})).toThrow('Missing required parameters: name');
    });

    it('should handle optional parameters', () => {
      const template = new MessageTemplate({
        type: MessageType.SMS,
        template: 'Hello {name}! {greeting}',
        requiredParams: ['name']
      });

      const result = template.format({
        name: 'John',
        greeting: 'Good morning!'
      });

      expect(result).toBe('Hello John! Good morning!');
    });
  });
});