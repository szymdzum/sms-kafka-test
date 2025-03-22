/**
 * Full allocation message template
 */
import { MessageTemplate, MessageType, OrderStatus } from '../template.js';

/**
 * Template for full allocation notification
 */
export const fullAllocationTemplate = new MessageTemplate({
  type: MessageType.SMS,
  status: OrderStatus.ALLOCATED,
  template: "All or part of your order {orderId} is now ready for collection, we've emailed you further details. See what ID is required at http://www.diy.com/collect",
  requiredParams: ['orderId']
});