/**
 * Final Collection Reminder message template
 */
import { MessageTemplate, SmsType, OrderStatus } from '../template.js';

/**
 * Template for final collection reminder
 * Note: According to the table, this bundle was not configured, so using a standard format
 */
export const finalReminderTemplate = new MessageTemplate({
  type: SmsType.ORDER,
  status: OrderStatus.FINAL_REMINDER,
  template: "FINAL REMINDER: Your B&Q order {orderId} is still waiting for collection and will expire on {expiryDate}. After this date, items will be returned to stock and a refund processed. We've emailed you further details.",
  requiredParams: ['orderId', 'expiryDate']
});