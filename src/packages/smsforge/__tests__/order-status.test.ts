import { fullAllocationTemplate, collectionConfirmationTemplate, collectionReminderTemplate } from '../templates/index.js';
import { OrderStatus } from '../types.js';

describe('Order Status Templates', () => {
  describe('fullAllocationTemplate', () => {
    it('should have correct status', () => {
      expect(fullAllocationTemplate.getStatus()).toBe(OrderStatus.ALLOCATED);
    });

    it('should format full allocation message', () => {
      const result = fullAllocationTemplate.format({
        orderId: 'ORDER123'
      });

      expect(result).toBe("All or part of your order ORDER123 is now ready for collection, we've emailed you further details. See what ID is required at http://www.diy.com/collect");
    });
  });

  describe('collectionConfirmationTemplate', () => {
    it('should have correct status', () => {
      expect(collectionConfirmationTemplate.getStatus()).toBe(OrderStatus.COLLECTED);
    });

    it('should format collection confirmation message', () => {
      const result = collectionConfirmationTemplate.format({
        orderId: 'ORDER123'
      });

      expect(result).toBe("This is to confirm that item(s) from order ORDER123 were collected today. Further details have been emailed to you. Thank you.");
    });
  });

  describe('collectionReminderTemplate', () => {
    it('should have correct status', () => {
      expect(collectionReminderTemplate.getStatus()).toBe(OrderStatus.REMINDER);
    });

    it('should format collection reminder message', () => {
      const result = collectionReminderTemplate.format({
        orderId: 'ORDER123',
        expiryDate: '2024-03-25'
      });

      expect(result).toBe("Just a gentle reminder that your B&Q order ORDER123 is still waiting to be collected. It will be held until 2024-03-25. We've emailed you further details.");
    });
  });
});