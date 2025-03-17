/**
 * Types for the XmlForge package
 * These types represent order data structures for XML to JSON conversion
 */

/**
 * Represents a customer in an order
 */
export interface Customer {
  /** Customer ID */
  id: string;
  /** Customer first name */
  firstName: string;
  /** Customer last name */
  lastName: string;
  /** Customer email address */
  email: string;
  /** Customer phone number */
  phoneNumber: string;
}

/**
 * Represents an address in an order
 */
export interface Address {
  /** Street address line 1 */
  street1: string;
  /** Street address line 2 (optional) */
  street2?: string;
  /** City name */
  city: string;
  /** State or region */
  state?: string;
  /** Postal or ZIP code */
  postalCode: string;
  /** Country code */
  country: string;
}

/**
 * Represents an individual order item
 */
export interface OrderItem {
  /** Product/item ID */
  id: string;
  /** Item SKU code */
  sku: string;
  /** Product name */
  name: string;
  /** Product description */
  description?: string;
  /** Quantity ordered */
  quantity: number;
  /** Item unit price */
  unitPrice: number;
  /** Total price for this item (quantity * unitPrice) */
  totalPrice: number;
  /** Item price */
  price: number;
}

/**
 * Represents an order status
 */
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

/**
 * Represents a shipping method
 */
export enum ShippingMethod {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  NEXT_DAY = 'NEXT_DAY',
  CLICK_AND_COLLECT = 'CLICK_AND_COLLECT'
}

/**
 * Represents an order from the ATG system
 */
export interface Order {
  /** Order ID */
  id: string;
  /** Order reference/number shown to customer */
  orderNumber: string;
  /** Date when order was placed */
  orderDate: string;
  /** Current order status */
  status: OrderStatus;
  /** Information about the customer */
  customer: Customer;
  /** Shipping address */
  shippingAddress: Address;
  /** Billing address */
  billingAddress: Address;
  /** Items in the order */
  items: OrderItem[];
  /** Shipping method selected */
  shippingMethod: ShippingMethod;
  /** Subtotal for items only */
  subtotal: number;
  /** Shipping cost */
  shippingCost: number;
  /** Tax amount */
  tax: number;
  /** Discount amount (if applicable) */
  discount?: number;
  /** Order total amount */
  total: number;
  /** Expected delivery date (if available) */
  estimatedDeliveryDate?: string;
  /** Store code for click & collect orders */
  collectionStore?: string;
  /** Brand associated with the order (e.g., B&Q, TradePoint) */
  brand: string;
}

/**
 * Configuration for XML to JSON conversion
 */
export interface XmlForgeConfig {
  /** Whether to remove empty or null values from the output */
  removeEmpty: boolean;
  /** Whether to use camelCase for property names in the output */
  useCamelCase: boolean;
  /** Which fields to include in the SMS notification */
  smsFields: string[];
}

/**
 * Template for SMS messages
 */
export interface SmsTemplate {
  /** Template name/identifier */
  id: string;
  /** Template content with placeholders */
  content: string;
  /** Variables needed for this template */
  requiredVariables: string[];
}