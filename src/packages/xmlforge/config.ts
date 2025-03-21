/**
 * Configuration for XMLForge package
 */

/**
 * XML path constants for easy access to data
 */
export const XML_PATHS = {
  phone: {
    path: ['SOAP-ENV:Envelope', 'SOAP-ENV:Body', 0, 'ProcessCommunication', 0, 'DataArea', 0, 'Communication', 0, 'CommunicationHeader', 0, 'CustomerParty', 0, 'Contact', 0, 'SMSTelephoneCommunication', 0, 'oa:FormattedNumber', 0] as const,
    type: 'string'
  },
  message: {
    path: ['SOAP-ENV:Envelope', 'SOAP-ENV:Body', 0, 'ProcessCommunication', 0, 'DataArea', 0, 'Communication', 0, 'CommunicationItem', 0, 'oa:Message', 0, 'oa:Note', 0] as const,
    type: 'string'
  },
  brand: {
    path: ['SOAP-ENV:Envelope', 'SOAP-ENV:Body', 0, 'ProcessCommunication', 0, 'DataArea', 0, 'Communication', 0, 'CommunicationHeader', 0, 'BrandChannel', 0, 'Brand', 0, 'oa:Code', 0] as const,
    type: 'brand'
  },
  orderId: {
    path: ['SOAP-ENV:Envelope', 'SOAP-ENV:Body', 0, 'ProcessCommunication', 0, 'oa:ApplicationArea', 0, 'oa:BODID', 0] as const,
    type: 'string'
  }
} as const;

export type XmlPath = typeof XML_PATHS[keyof typeof XML_PATHS]['path'][number];