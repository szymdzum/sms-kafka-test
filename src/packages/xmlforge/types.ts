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
  /** Order ID for tracking */
  orderId?: string;
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
          'oa:BODID': [string];
        }];
        DataArea: [{
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