/**
 * SMS template generation utilities
 */
import logger from '../../logger.js';
import { Order, SmsTemplate } from './types.js';
import { SMS_TEMPLATES } from './config.js';
import { extractSmsFields } from './transformer.js';

/**
 * Fills in a template with values from an object
 *
 * @param template - Template string with {placeholders}
 * @param values - Object containing values to insert
 * @returns Filled template string
 */
export function fillTemplate(template: string, values: Record<string, any>): string {
  return template.replace(/{(\w+)}/g, (match, key) => {
    const value = values[key];
    return value !== undefined ? String(value) : match;
  });
}

/**
 * Checks if all required variables for a template are present in the data
 *
 * @param requiredVars - List of required variable names
 * @param data - Data object to check against
 * @returns True if all required variables are present
 */
export function validateTemplateData(
  requiredVars: string[],
  data: Record<string, any>
): boolean {
  return requiredVars.every(variable =>
    data[variable] !== undefined && data[variable] !== null && data[variable] !== ''
  );
}

/**
 * Gets the appropriate SMS template for an order
 *
 * @param order - Order object
 * @param templateType - Template type/scenario (e.g., 'order_confirmation')
 * @returns The template object or undefined if not found
 */
export function getOrderTemplate(
  order: Order,
  templateType: string = 'order_confirmation'
): SmsTemplate | undefined {
  const brand = order.brand;

  // Check if we have templates for this brand
  if (!(brand in SMS_TEMPLATES)) {
    logger.warn(`No SMS templates found for brand: ${brand}`);
    return undefined;
  }

  // Type assertion to help TypeScript understand the indexing
  const brandTemplates = SMS_TEMPLATES[brand as keyof typeof SMS_TEMPLATES];

  // Check if we have this template type for the brand
  if (!(templateType in brandTemplates)) {
    logger.warn(`No '${templateType}' template found for brand: ${brand}`);
    return undefined;
  }

  // Type assertion for the specific template
  return brandTemplates[templateType as keyof typeof brandTemplates];
}

/**
 * Generate SMS message from order data based on appropriate template
 *
 * @param order - Order data
 * @param templateType - Template type to use
 * @returns Generated SMS message or null if cannot generate
 */
export function generateOrderSms(
  order: Order,
  templateType: string = 'order_confirmation'
): string | null {
  try {
    // Get appropriate template
    const template = getOrderTemplate(order, templateType);
    if (!template) {
      return null;
    }

    // Extract fields for SMS
    const smsData = extractSmsFields(order);

    // Validate required fields are present
    if (!validateTemplateData(template.requiredVariables, smsData)) {
      logger.warn('Missing required variables for SMS template', {
        templateId: template.id,
        required: template.requiredVariables,
        available: Object.keys(smsData)
      });
      return null;
    }

    // Fill template with order data
    return fillTemplate(template.content, smsData);
  } catch (error) {
    logger.error('Failed to generate SMS from order', { error });
    return null;
  }
}