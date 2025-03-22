/**
 * Collection confirmation message template
 */
import { MessageTemplate, MessageType, OrderStatus } from '../template.js';

/**
 * Template for collection confirmation
 */
export const collectionConfirmationTemplate = new MessageTemplate({
  type: MessageType.SMS,
  status: OrderStatus.COLLECTED,
  template: "This is to confirm that item(s) from order {orderId} were collected today. Further details have been emailed to you. Thank you.",
  requiredParams: ['orderId']
});