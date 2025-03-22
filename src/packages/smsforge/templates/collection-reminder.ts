/**
 * Collection reminder message template
 */
import { MessageTemplate, MessageType, OrderStatus } from '../template.js';

/**
 * Template for collection reminder
 */
export const collectionReminderTemplate = new MessageTemplate({
  type: MessageType.SMS,
  status: OrderStatus.REMINDER,
  template: "Just a gentle reminder that your B&Q order {orderId} is still waiting to be collected. It will be held until {expiryDate}. We've emailed you further details.",
  requiredParams: ['orderId', 'expiryDate']
});