/**
 * Types for the XmlForge package
 * These types represent the essential data needed for SMS sending
 */

/**
 * Represents the extracted data from XML for SMS sending
 */
export interface SmsData {
  /** Customer phone number */
  phoneNumber: string;
  /** Message to be sent */
  message: string;
  /** Brand/sender of the message */
  brand: string;
  /** Human readable brand name */
  brandName?: string;
  /** Channel code (WEB, MOB, CCC, STR) */
  channel?: string;
  /** Human readable channel name */
  channelName?: string;
  /** Order ID for tracking */
  orderId?: string;
  /** Creation date and time of the message */
  creationDateTime?: string;
  /** Action expression for determining message type */
  actionExpression?: string;
}

/**
 * Configuration for XML to JSON conversion
 */
export interface XmlForgeConfig {
  /** Whether to remove empty or null values from the output */
  removeEmpty: boolean;
  /** Whether to use camelCase for property names in the output */
  useCamelCase: boolean;
}

/**
 * Type definitions for ATG SOAP XML structure
 */
export interface AtgSoapXml extends GenericXml {
  'SOAP-ENV:Envelope': {
    'SOAP-ENV:Body': [{
      ProcessCommunication: [{
        'oa:ApplicationArea': [{
          'oa:CreationDateTime': [string];
          'oa:BODID': [string];
        }];
        DataArea: [{
          'oa:Process': [{
            'oa:ActionCriteria': [{
              'oa:ActionExpression': [string];
            }];
          }];
          Communication: [{
            CommunicationHeader: [{
              CustomerParty: [{
                Contact: [{
                  SMSTelephoneCommunication: [{
                    'oa:FormattedNumber': [string];
                  }];
                }];
              }];
              BrandChannel: [{
                Brand: [{
                  'oa:Code': [{ $: { name: string } } | string];
                }];
                Channel: [{
                  'oa:Code': [{ $: { name: string } } | string];
                }];
              }];
            }];
            CommunicationItem: [{
              'oa:Message': [{
                'oa:Note': [string];
              }];
            }];
          }];
        }];
      }];
    }];
  };
  [key: string]: GenericXmlValue; // Required by GenericXml
}

/**
 * Type for XML element with potential attributes
 */
export interface XmlElement<T = string> {
  _?: T;
  $?: {
    name?: string;
    [key: string]: unknown;
  };
}

/**
 * Generic XML type that can be used for any XML structure
 */
export type GenericXml = {
  [key: string]: GenericXmlValue;
};

/**
 * Special XML attributes
 */
export interface XmlAttributes {
  name?: string;
  [attr: string]: unknown;
}

/**
 * Possible values in an XML structure
 */
export type GenericXmlValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | GenericXmlArray
  | GenericXmlObject
  | XmlAttributes;

/**
 * Array of XML values
 */
export type GenericXmlArray = Array<GenericXmlValue>;

/**
 * Object containing XML values
 */
export type GenericXmlObject = {
  [key: string]: GenericXmlValue;
  $?: XmlAttributes;
  _?: string;
};

/**
 * Type for value validators
 */
export type ValueValidator<T> = (value: unknown) => value is T;