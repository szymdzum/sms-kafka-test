/**
 * Collection Expiry message template
 */
import { MessageTemplate, SmsType, OrderStatus } from '../template.js';

/**
 * Template for collection expiry notification
 */
export const expiryAlertTemplate = new MessageTemplate({
  type: SmsType.ORDER,
  status: OrderStatus.EXPIRY_ALERT,
  template: "Just to let you know your B&Q order {orderId} which was due for collection by {expiryDate} has now expired. Your order will be refunded. We've emailed you further details.",
  requiredParams: ['orderId', 'expiryDate']
});