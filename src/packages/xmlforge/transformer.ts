/**
 * XML to JSON transformer for order data
 */
import { parseStringPromise } from 'xml2js';
import logger from '../../logger.js';
import { Order, XmlForgeConfig } from './types.js';
import getXmlForgeConfig from './config.js';

/**
 * Converts keys in an object from snake_case or kebab-case to camelCase
 *
 * @param obj - The object to transform
 * @returns A new object with camelCase keys
 */
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      // Convert key to camelCase
      const camelKey = key.replace(/[-_]([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

/**
 * Removes empty values (null, undefined, empty strings, empty arrays, empty objects) from an object
 *
 * @param obj - The object to clean
 * @returns A new object without empty values
 */
function removeEmptyValues(obj: any): any {
  if (Array.isArray(obj)) {
    const filtered = obj
      .map(v => removeEmptyValues(v))
      .filter(v => v !== null && v !== undefined);
    return filtered.length > 0 ? filtered : undefined;
  } else if (obj !== null && typeof obj === 'object') {
    const result: any = {};
    let isEmpty = true;

    for (const key in obj) {
      const value = removeEmptyValues(obj[key]);
      if (value !== null && value !== undefined && value !== '') {
        result[key] = value;
        isEmpty = false;
      }
    }

    return isEmpty ? undefined : result;
  }

  // Return undefined for empty strings
  if (obj === '') return undefined;

  return obj;
}

/**
 * Normalizes XML to JS object conversion oddities
 *
 * @param obj - The object to normalize
 * @returns A normalized object
 */
function normalizeXmlObject(obj: any): any {
  if (Array.isArray(obj)) {
    // If array has only one element, unwrap it
    if (obj.length === 1) {
      return normalizeXmlObject(obj[0]);
    }
    return obj.map(v => normalizeXmlObject(v));
  } else if (obj !== null && typeof obj === 'object') {
    const result: any = {};

    for (const key in obj) {
      // Handle XML attributes (typically prefixed with $)
      if (key === '$') {
        Object.assign(result, normalizeXmlObject(obj[key]));
      }
      // Handle XML text content (typically under _)
      else if (key === '_') {
        if (Object.keys(obj).length === 1) {
          return obj[key];
        }
        result.text = obj[key];
      }
      // Handle normal properties
      else {
        result[key] = normalizeXmlObject(obj[key]);
      }
    }

    return result;
  }

  return obj;
}

/**
 * Transforms XML string to JSON object based on configuration
 *
 * @param xml - XML string to transform
 * @param config - Configuration options
 * @returns Transformed JSON object
 */
export async function transformXmlToJson(
  xml: string,
  config: XmlForgeConfig = getXmlForgeConfig()
): Promise<any> {
  try {
    // Parse XML to JS object
    const options = {
      explicitArray: false,
      mergeAttrs: true,
      normalizeTags: true,
      trim: true
    };

    const parsedXml = await parseStringPromise(xml, options);

    // Apply transformations based on config
    let result = normalizeXmlObject(parsedXml);

    if (config.useCamelCase) {
      result = toCamelCase(result);
    }

    if (config.removeEmpty) {
      result = removeEmptyValues(result);
    }

    return result;
  } catch (error) {
    logger.error('Failed to transform XML to JSON', { error });
    throw new Error(`XML transformation failed: ${(error as Error).message}`);
  }
}

/**
 * Transforms XML order data to an Order object
 *
 * @param xml - XML string containing order data
 * @param config - Configuration options
 * @returns Order object
 */
export async function transformOrderXml(
  xml: string,
  config: XmlForgeConfig = getXmlForgeConfig()
): Promise<Order> {
  try {
    const jsonData = await transformXmlToJson(xml, config);

    // Extract order from the transformed JSON
    // This assumes a specific structure; adapt as needed for your XML
    const orderData = jsonData.order || jsonData.orderData || jsonData;

    // Map the data to the Order interface
    const order: Order = {
      id: orderData.id,
      orderNumber: orderData.orderNumber,
      orderDate: orderData.orderDate,
      status: orderData.status,
      customer: {
        id: orderData.customer?.id,
        firstName: orderData.customer?.firstName,
        lastName: orderData.customer?.lastName,
        email: orderData.customer?.email,
        phoneNumber: orderData.customer?.phoneNumber
      },
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      items: Array.isArray(orderData.items?.item)
        ? orderData.items.item
        : orderData.items?.item
          ? [orderData.items.item]
          : [],
      shippingMethod: orderData.shippingMethod,
      subtotal: parseFloat(orderData.subtotal),
      shippingCost: parseFloat(orderData.shippingCost),
      tax: parseFloat(orderData.tax),
      discount: orderData.discount ? parseFloat(orderData.discount) : undefined,
      total: parseFloat(orderData.total),
      estimatedDeliveryDate: orderData.estimatedDeliveryDate,
      collectionStore: orderData.collectionStore,
      brand: orderData.brand
    };

    return order;
  } catch (error) {
    logger.error('Failed to transform order XML', { error });
    throw new Error(`Order XML transformation failed: ${(error as Error).message}`);
  }
}

/**
 * Extract fields from an order needed for SMS notifications
 *
 * @param order - Complete order object
 * @param fields - Fields to extract
 * @returns Object containing only the specified fields
 */
export function extractSmsFields(
  order: Order,
  fields: string[] = getXmlForgeConfig().smsFields
): Record<string, any> {
  const result: Record<string, any> = {};

  fields.forEach(field => {
    // Handle nested fields with dot notation
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (order[parent as keyof Order]) {
        // @ts-ignore - Dynamic access
        result[field] = order[parent as keyof Order][child];
      }
    } else {
      // @ts-ignore - Dynamic access
      result[field] = order[field as keyof Order];
    }
  });

  return result;
}