/**
 * Configuration for the XmlForge package
 */
import * as dotenv from 'dotenv';
import logger from '../../logger.js';
import { XmlForgeConfig } from './types.js';

// Load environment variables from .env file
dotenv.config();

// Default XML parsing options
const DEFAULT_CONFIG: XmlForgeConfig = {
  removeEmpty: true,
  useCamelCase: true,
  smsFields: ['orderNumber', 'orderDate', 'status', 'total', 'estimatedDeliveryDate']
};

/**
 * Creates and returns a configuration object for the XmlForge package
 *
 * @param overrides - Optional configuration overrides
 * @returns Configuration object
 */
export function getXmlForgeConfig(overrides?: Partial<XmlForgeConfig>): XmlForgeConfig {
  try {
    // Environment variables can be used to override defaults
    const envConfig: Partial<XmlForgeConfig> = {
      removeEmpty: process.env.XML_FORGE_REMOVE_EMPTY === 'true',
      useCamelCase: process.env.XML_FORGE_USE_CAMEL_CASE !== 'false',
      smsFields: process.env.XML_FORGE_SMS_FIELDS ?
        process.env.XML_FORGE_SMS_FIELDS.split(',') :
        DEFAULT_CONFIG.smsFields
    };

    // Filter out undefined values
    const filteredEnvConfig = Object.fromEntries(
      Object.entries(envConfig).filter(([_, value]) => value !== undefined)
    );

    // Merge defaults with environment overrides and function overrides
    return {
      ...DEFAULT_CONFIG,
      ...filteredEnvConfig,
      ...overrides
    };
  } catch (error) {
    logger.error('Error initializing XmlForge configuration', { error });
    return DEFAULT_CONFIG;
  }
}

/**
 * SMS templates for different brands and scenarios
 */
export const SMS_TEMPLATES = {
  'B&Q': {
    'order_confirmation': {
      id: 'bq_order_confirmation',
      content: 'Your B&Q order {orderNumber} has been confirmed. Track your order at diy.com/orders',
      requiredVariables: ['orderNumber']
    },
    'order_shipped': {
      id: 'bq_order_shipped',
      content: 'Your B&Q order {orderNumber} has been shipped. Estimated delivery: {estimatedDeliveryDate}',
      requiredVariables: ['orderNumber', 'estimatedDeliveryDate']
    },
    'order_ready': {
      id: 'bq_order_ready',
      content: 'Your B&Q order {orderNumber} is ready for collection from {collectionStore}.',
      requiredVariables: ['orderNumber', 'collectionStore']
    }
  },
  'TradePoint': {
    'order_confirmation': {
      id: 'tp_order_confirmation',
      content: 'Your TradePoint order {orderNumber} has been placed, thank you for using TradePoint.co.uk',
      requiredVariables: ['orderNumber']
    },
    'order_shipped': {
      id: 'tp_order_shipped',
      content: 'Your TradePoint order {orderNumber} has been shipped. Estimated delivery: {estimatedDeliveryDate}',
      requiredVariables: ['orderNumber', 'estimatedDeliveryDate']
    }
  },
  'Screwfix': {
    'order_confirmation': {
      id: 'sf_order_confirmation',
      content: 'Your Screwfix order {orderNumber} has been confirmed. Collection available from {collectionStore}.',
      requiredVariables: ['orderNumber', 'collectionStore']
    }
  }
};

export default getXmlForgeConfig;