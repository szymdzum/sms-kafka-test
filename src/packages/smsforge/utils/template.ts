/**
 * Template utility functions
 */
import { MessageTemplate, OrderStatus } from '../template.js';
import {
  TEMPLATE_MAP,
  TemplateNotFoundError
} from '../config.js';

/**
 * Get the appropriate template based on order status
 *
 * @param orderStatus - The order status to get template for
 * @returns The corresponding MessageTemplate
 * @throws TemplateNotFoundError if no template is found for the given status
 */
export function createMessageForStatus(orderStatus: OrderStatus): MessageTemplate {
  const template = TEMPLATE_MAP.get(orderStatus);
  if (!template) {
    throw new TemplateNotFoundError(orderStatus);
  }
  return template;
}

/**
 * Generate an SMS message for an order based on its status
 * Only requires the minimum data needed to generate the message text
 *
 * @param data - Object containing only the data needed for message generation
 * @returns The generated SMS message
 */
export async function createMessage(data: {
  orderId: string;
  orderStatus: OrderStatus;
}): Promise<string> {
  const template = createMessageForStatus(data.orderStatus);

  // Prepare template parameters based on status
  const templateParams: Record<string, string> = {
    orderId: data.orderId
  };

  return template.format(templateParams);
}