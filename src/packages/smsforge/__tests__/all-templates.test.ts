/**
 * Tests for all SMS templates based on ATG types
 */

import { OrderStatus } from '../types.js';
import { TemplateParameterError } from '../types.js';
import {
  // Order acknowledgement templates
  orderSubmittedTemplate,
  newOrderTemplate,

  // Collection templates
  fullAllocationTemplate,
  partialAllocationTemplate,
  cancelledOrderTemplate,
  collectionConfirmationTemplate,

  // Reminder templates
  collectionReminderTemplate,
  finalReminderTemplate,
  expiryAlertTemplate
} from '../templates/index.js';

describe('Order Acknowledgement Templates', () => {
  describe('orderSubmittedTemplate (WEB)', () => {
    it('should have the correct status', () => {
      expect(orderSubmittedTemplate.getStatus()).toBe(OrderStatus.ORDER_SUBMITTED);
    });

    it('should format order submitted message correctly', () => {
      const result = orderSubmittedTemplate.format({
        orderId: 'ORDER123',
        brand: 'diy.com'
      });

      expect(result).toBe("Thanks for your B&Q order ORDER123. If you have a diy.com account, you can see your order online at https://www.diy.com/customer/signin - we've emailed you further details.");
    });

    it('should throw error for missing parameters', () => {
      expect(() => orderSubmittedTemplate.format({})).toThrow(TemplateParameterError);
      expect(() => orderSubmittedTemplate.format({ orderId: 'ORDER123' })).toThrow(TemplateParameterError);
      expect(() => orderSubmittedTemplate.format({ brand: 'diy.com' })).toThrow(TemplateParameterError);
    });
  });

  describe('newOrderTemplate (.com+)', () => {
    it('should have the correct status', () => {
      expect(newOrderTemplate.getStatus()).toBe(OrderStatus.NEW_ORDER);
    });

    it('should format new order message correctly', () => {
      const result = newOrderTemplate.format({
        orderId: 'ORDER123'
      });

      expect(result).toBe("Your B&Q order ORDER123 is being processed. Further details have been emailed to you. Thank you for shopping with B&Q.");
    });

    it('should throw error for missing parameters', () => {
      expect(() => newOrderTemplate.format({})).toThrow(TemplateParameterError);
    });
  });
});

describe('Collection Templates', () => {
  describe('cancelledOrderTemplate (Zero Allocation)', () => {
    it('should have the correct status', () => {
      expect(cancelledOrderTemplate.getStatus()).toBe(OrderStatus.CANCELLED);
    });

    it('should format cancelled order message correctly', () => {
      const result = cancelledOrderTemplate.format({
        orderId: 'ORDER123'
      });

      expect(result).toBe("We're very sorry we've had to cancel all or part of your B&Q order ORDER123 as some items were out of stock. We've emailed you further details.");
    });

    it('should throw error for missing parameters', () => {
      expect(() => cancelledOrderTemplate.format({})).toThrow(TemplateParameterError);
    });
  });

  describe('partialAllocationTemplate', () => {
    it('should have the correct status', () => {
      expect(partialAllocationTemplate.getStatus()).toBe(OrderStatus.PARTIAL);
    });

    it('should format partial allocation message correctly', () => {
      const result = partialAllocationTemplate.format({
        orderId: 'ORDER123'
      });

      expect(result).toBe("Your B&Q order ORDER123 is ready to collect, however we're very sorry some item(s) were out of stock. For quicker collection, have your QR code ready from your email confirmation or your order number. Please bring photo ID for any age restricted products.");
    });

    it('should throw error for missing parameters', () => {
      expect(() => partialAllocationTemplate.format({})).toThrow(TemplateParameterError);
    });
  });

  describe('fullAllocationTemplate', () => {
    it('should have the correct status', () => {
      expect(fullAllocationTemplate.getStatus()).toBe(OrderStatus.ALLOCATED);
    });

    it('should format full allocation message correctly', () => {
      const result = fullAllocationTemplate.format({
        orderId: 'ORDER123'
      });

      expect(result).toBe("All or part of your order ORDER123 is now ready for collection, we've emailed you further details. See what ID is required at http://www.diy.com/collect");
    });

    it('should throw error for missing parameters', () => {
      expect(() => fullAllocationTemplate.format({})).toThrow(TemplateParameterError);
    });
  });

  describe('collectionConfirmationTemplate', () => {
    it('should have the correct status', () => {
      expect(collectionConfirmationTemplate.getStatus()).toBe(OrderStatus.COLLECTED);
    });

    it('should format collection confirmation message correctly', () => {
      const result = collectionConfirmationTemplate.format({
        orderId: 'ORDER123'
      });

      expect(result).toBe("This is to confirm that item(s) from order ORDER123 were collected today. Further details have been emailed to you. Thank you.");
    });

    it('should throw error for missing parameters', () => {
      expect(() => collectionConfirmationTemplate.format({})).toThrow(TemplateParameterError);
    });
  });
});

describe('Reminder Templates', () => {
  describe('collectionReminderTemplate', () => {
    it('should have the correct status', () => {
      expect(collectionReminderTemplate.getStatus()).toBe(OrderStatus.REMINDER);
    });

    it('should format reminder message correctly', () => {
      const result = collectionReminderTemplate.format({
        orderId: 'ORDER123',
        expiryDate: '2024-03-25'
      });

      expect(result).toBe("Just a gentle reminder that your B&Q order ORDER123 is still waiting to be collected. It will be held until 2024-03-25. We've emailed you further details.");
    });

    it('should throw error for missing parameters', () => {
      expect(() => collectionReminderTemplate.format({})).toThrow(TemplateParameterError);
      expect(() => collectionReminderTemplate.format({ orderId: 'ORDER123' })).toThrow(TemplateParameterError);
      expect(() => collectionReminderTemplate.format({ expiryDate: '2024-03-25' })).toThrow(TemplateParameterError);
    });
  });

  describe('finalReminderTemplate', () => {
    it('should have the correct status', () => {
      expect(finalReminderTemplate.getStatus()).toBe(OrderStatus.FINAL_REMINDER);
    });

    it('should format final reminder message correctly', () => {
      const result = finalReminderTemplate.format({
        orderId: 'ORDER123',
        expiryDate: '2024-03-25'
      });

      expect(result).toBe("FINAL REMINDER: Your B&Q order ORDER123 is still waiting for collection and will expire on 2024-03-25. After this date, items will be returned to stock and a refund processed. We've emailed you further details.");
    });

    it('should throw error for missing parameters', () => {
      expect(() => finalReminderTemplate.format({})).toThrow(TemplateParameterError);
      expect(() => finalReminderTemplate.format({ orderId: 'ORDER123' })).toThrow(TemplateParameterError);
      expect(() => finalReminderTemplate.format({ expiryDate: '2024-03-25' })).toThrow(TemplateParameterError);
    });
  });

  describe('expiryAlertTemplate', () => {
    it('should have the correct status', () => {
      expect(expiryAlertTemplate.getStatus()).toBe(OrderStatus.EXPIRY_ALERT);
    });

    it('should format expiry alert message correctly', () => {
      const result = expiryAlertTemplate.format({
        orderId: 'ORDER123',
        expiryDate: '2024-03-25'
      });

      expect(result).toBe("Just to let you know your B&Q order ORDER123 which was due for collection by 2024-03-25 has now expired. Your order will be refunded. We've emailed you further details.");
    });

    it('should throw error for missing parameters', () => {
      expect(() => expiryAlertTemplate.format({})).toThrow(TemplateParameterError);
      expect(() => expiryAlertTemplate.format({ orderId: 'ORDER123' })).toThrow(TemplateParameterError);
      expect(() => expiryAlertTemplate.format({ expiryDate: '2024-03-25' })).toThrow(TemplateParameterError);
    });
  });
});