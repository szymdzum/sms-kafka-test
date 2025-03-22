/**
 * Partial Allocation message template
 */
import { MessageTemplate, SmsType, OrderStatus } from '../template.js';

/**
 * Template for partial allocation notification
 */
export const partialAllocationTemplate = new MessageTemplate({
  type: SmsType.ORDER,
  status: OrderStatus.PARTIAL,
  template: "Your B&Q order {orderId} is ready to collect, however we're very sorry some item(s) were out of stock. For quicker collection, have your QR code ready from your email confirmation or your order number. Please bring photo ID for any age restricted products.",
  requiredParams: ['orderId']
});