/**
 * XML to JSON transformer for order data
 */
import { parseStringPromise } from 'xml2js';
import logger from '../../logger.js';
import { Order, OrderStatus, ShippingMethod, OrderItem } from './types.js';
import { toCamelCase, removeEmptyValues } from './utils.js';

/**
 * Transform XML to JSON with options for handling arrays and attributes
 *
 * @param xml - XML string to transform
 * @returns Promise resolving to a JSON object
 */
export async function transformXmlToJson(xml: string): Promise<any> {
  try {
    // Parse XML to JS object
    const options = {
      explicitArray: false,
      mergeAttrs: true,
      normalize: true,
      trim: true
    };

    const result = await parseStringPromise(xml, options);

    // Transform keys to camelCase and remove empty values
    const transformedResult = removeEmptyValues(toCamelCase(result));

    return transformedResult;
  } catch (error) {
    logger.error('Failed to transform XML to JSON', { error });
    throw new Error(`XML to JSON transformation failed: ${(error as Error).message}`);
  }
}

/**
 * Transforms a raw XML order to a structured Order object
 *
 * @param xml - XML order string
 * @returns Promise resolving to an Order object
 */
export async function transformOrderXml(xml: string): Promise<Order> {
  try {
    // First, transform XML to JSON
    const jsonData = await transformXmlToJson(xml);

    // Check if order data exists
    if (!jsonData.order) {
      throw new Error('Invalid order XML: missing order element');
    }

    const orderData = jsonData.order;

    // Process order items
    const items: OrderItem[] = [];
    if (orderData.items && orderData.items.item) {
      // Handle case when there's only one item (not in an array)
      const itemsArray = Array.isArray(orderData.items.item)
        ? orderData.items.item
        : [orderData.items.item];

      for (const item of itemsArray) {
        items.push({
          id: item.id || `item-${items.length + 1}`,
          name: item.name || '',
          price: parseFloat(item.price) || 0,
          unitPrice: parseFloat(item.unitPrice || item.price) || 0,
          quantity: parseInt(item.quantity, 10) || 1,
          sku: item.sku || '',
          totalPrice: parseFloat(item.totalPrice) || 0
        });
      }
    }

    // Build the order object
    const order: Order = {
      id: orderData.id || '',
      orderNumber: orderData.orderNumber || orderData.id || '',
      orderDate: orderData.orderDate || new Date().toISOString(),
      status: (orderData.status as OrderStatus) || OrderStatus.PROCESSING,

      // Add customer information if available
      customer: {
        id: orderData.customer?.id || '',
        firstName: orderData.customer?.firstName || '',
        lastName: orderData.customer?.lastName || '',
        email: orderData.customer?.email || '',
        phoneNumber: orderData.customer?.phoneNumber || ''
      },

      // Add shipping address if available
      shippingAddress: {
        street1: orderData.shippingAddress?.street1 || '',
        street2: orderData.shippingAddress?.street2 || '',
        city: orderData.shippingAddress?.city || '',
        state: orderData.shippingAddress?.state || '',
        postalCode: orderData.shippingAddress?.postalCode || '',
        country: orderData.shippingAddress?.country || 'UK'
      },

      // Add billing address if available
      billingAddress: {
        street1: orderData.billingAddress?.street1 || '',
        street2: orderData.billingAddress?.street2 || '',
        city: orderData.billingAddress?.city || '',
        state: orderData.billingAddress?.state || '',
        postalCode: orderData.billingAddress?.postalCode || '',
        country: orderData.billingAddress?.country || 'UK'
      },

      // Add items and costs
      items,
      shippingMethod: (orderData.shippingMethod as ShippingMethod) || ShippingMethod.STANDARD,
      subtotal: parseFloat(orderData.subtotal) || 0,
      shippingCost: parseFloat(orderData.shippingCost) || 0,
      tax: parseFloat(orderData.tax) || 0,
      total: parseFloat(orderData.total) || 0,

      // Add brand information
      brand: orderData.brand || 'Unknown'
    };

    // Add optional fields
    if (orderData.estimatedDeliveryDate) {
      order.estimatedDeliveryDate = orderData.estimatedDeliveryDate;
    }

    if (orderData.collectionStore) {
      order.collectionStore = orderData.collectionStore;
    }

    logger.info('Transformed XML to Order object', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      itemCount: order.items.length
    });

    return order;
  } catch (error) {
    logger.error('Failed to transform order XML', { error });
    throw new Error(`Order XML transformation failed: ${(error as Error).message}`);
  }
}

/**
 * Extract SMS notification fields from an order
 *
 * @param order - Order object to extract fields from
 * @returns Object with fields for SMS notification
 */
export function extractSmsFields(order: Order): Record<string, string | number> {
  return {
    orderNumber: order.orderNumber,
    customerName: `${order.customer.firstName} ${order.customer.lastName}`.trim(),
    totalAmount: order.total.toFixed(2),
    currency: '£',
    itemCount: order.items.length,
    estimatedDeliveryDate: order.estimatedDeliveryDate || 'Unknown',
    collectionStore: order.collectionStore || '',
    storeName: order.collectionStore || '',
    shippingMethod: order.shippingMethod,
    brand: order.brand
  };
}