/**
 * New Order message template (.com+)
 */
import { MessageTemplate, SmsType, OrderStatus } from '../template.js';

/**
 * Template for order acknowledgement from .com+
 */
export const newOrderTemplate = new MessageTemplate({
  type: SmsType.ORDER,
  status: OrderStatus.NEW_ORDER,
  template: "Your B&Q order {orderId} is being processed. Further details have been emailed to you. Thank you for shopping with B&Q.",
  requiredParams: ['orderId']
});