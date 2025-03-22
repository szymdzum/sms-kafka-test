/**
 * Collection confirmation message template
 */
import { MessageTemplate, SmsType, OrderStatus } from '../template.js';

/**
 * Template for collection confirmation
 */
export const collectionConfirmationTemplate = new MessageTemplate({
  type: SmsType.ORDER,
  status: OrderStatus.COLLECTED,
  template: "This is to confirm that item(s) from order {orderId} were collected today. Further details have been emailed to you. Thank you.",
  requiredParams: ['orderId']
});