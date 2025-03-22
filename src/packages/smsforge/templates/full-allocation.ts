/**
 * Full allocation message template
 */
import { MessageTemplate, SmsType, OrderStatus } from '../template.js';
import { TemplateConfig } from '../types.js';

const config: TemplateConfig = {
  type: SmsType.ORDER,
  template: "All or part of your order {orderId} is now ready for collection, we've emailed you further details. See what ID is required at http://www.diy.com/collect",
  requiredParams: ['orderId'],
  status: OrderStatus.ALLOCATED
};

export const fullAllocationTemplate = new MessageTemplate(config);