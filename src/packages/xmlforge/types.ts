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
export interface AtgSoapXml {
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
}