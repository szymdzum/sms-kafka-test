/**
 * Order Submitted message template (WEB)
 */
import { MessageTemplate, SmsType, OrderStatus } from '../template.js';

/**
 * Template for order acknowledgement from WEB
 */
export const orderSubmittedTemplate = new MessageTemplate({
  type: SmsType.ORDER,
  status: OrderStatus.ORDER_SUBMITTED,
  template: "Thanks for your B&Q order {orderId}. If you have a {brand} account, you can see your order online at https://www.{brand}/customer/signin - we've emailed you further details.",
  requiredParams: ['orderId', 'brand']
});