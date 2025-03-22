/**
 * Configuration for XMLForge package
 */

/**
 * Base path components that are common to all XML paths
 */
const BASE_PATH = [
  'SOAP-ENV:Envelope',
  'SOAP-ENV:Body',
  0,
  'ProcessCommunication',
  0
] as const;

/**
 * Common DataArea Communication path components
 */
const COMMUNICATION_PATH = [
  'DataArea', 0, 'Communication', 0
] as const;

/**
 * XML path constants for easy access to data
 */
export const XML_PATHS = {
  // Message Metadata
  orderId: {
    path: [...BASE_PATH, 'oa:ApplicationArea', 0, 'oa:BODID', 0] as const,
    type: 'string'
  },
  creationDateTime: {
    path: [...BASE_PATH, 'oa:ApplicationArea', 0, 'oa:CreationDateTime', 0] as const,
    type: 'string'
  },

  // SMS Destination
  phoneNumber: {
    path: [...BASE_PATH, ...COMMUNICATION_PATH, 'CommunicationHeader', 0, 'CustomerParty', 0, 'Contact', 0, 'SMSTelephoneCommunication', 0, 'oa:FormattedNumber', 0] as const,
    type: 'string'
  },

  // Brand & Channel
  brand: {
    path: [...BASE_PATH, ...COMMUNICATION_PATH, 'CommunicationHeader', 0, 'BrandChannel', 0, 'Brand', 0, 'oa:Code', 0] as const,
    type: 'brand'
  },
  brandName: {
    path: [...BASE_PATH, ...COMMUNICATION_PATH, 'CommunicationHeader', 0, 'BrandChannel', 0, 'Brand', 0, 'oa:Code', 0, '$', 'name'] as const,
    type: 'string'
  },
  channel: {
    path: [...BASE_PATH, ...COMMUNICATION_PATH, 'CommunicationHeader', 0, 'BrandChannel', 0, 'Channel', 0, 'oa:Code', 0] as const,
    type: 'string'
  },
  channelName: {
    path: [...BASE_PATH, ...COMMUNICATION_PATH, 'CommunicationHeader', 0, 'BrandChannel', 0, 'Channel', 0, 'oa:Code', 0, '$', 'name'] as const,
    type: 'string'
  },

  // Message Content
  message: {
    path: [...BASE_PATH, ...COMMUNICATION_PATH, 'CommunicationItem', 0, 'oa:Message', 0, 'oa:Note', 0] as const,
    type: 'string'
  },

  // Action Expression (for determining message type)
  actionExpression: {
    path: [...BASE_PATH, 'DataArea', 0, 'oa:Process', 0, 'oa:ActionCriteria', 0, 'oa:ActionExpression', 0] as const,
    type: 'string'
  }
} as const;

/**
 * Required fields for SMS data validation
 */
export const REQUIRED_FIELDS = ['phoneNumber', 'message', 'brandCode'] as const;

// Allow any string or number for path segments for more flexible usage
export type XmlPath = string | number;