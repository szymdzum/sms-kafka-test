/**
 * Cancelled Order message template (Zero Allocation)
 */
import { MessageTemplate, SmsType, OrderStatus } from '../template.js';

/**
 * Template for zero allocation notification
 */
export const cancelledOrderTemplate = new MessageTemplate({
  type: SmsType.CANCELLATION,
  status: OrderStatus.CANCELLED,
  template: "We're very sorry we've had to cancel all or part of your B&Q order {orderId} as some items were out of stock. We've emailed you further details.",
  requiredParams: ['orderId']
});