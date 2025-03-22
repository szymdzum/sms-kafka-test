# XmlForge

A TypeScript package for extracting SMS data from ATG SOAP XML messages.

## Features

- Parses ATG SOAP XML messages
- Extracts SMS data (phone number, message, brand, channel, order ID, etc.)
- Validates XML structure and required fields
- Type-safe with TypeScript
- Comprehensive error handling
- Detailed logging

## Installation

```bash
npm install xmlforge
```

## Usage

```typescript
import { extractSmsData } from 'xmlforge';

// Example SOAP XML based on provider's specification
const soapXml = `
  <SOAP-ENV:Envelope>
    <SOAP-ENV:Body>
      <ProcessCommunication>
        <oa:ApplicationArea>
          <oa:CreationDateTime>2023-03-22T15:30:45.123Z</oa:CreationDateTime>
          <oa:BODID>ORDER123</oa:BODID>
        </oa:ApplicationArea>
        <DataArea>
          <oa:Process>
            <oa:ActionCriteria>
              <oa:ActionExpression>SMS</oa:ActionExpression>
            </oa:ActionCriteria>
          </oa:Process>
          <Communication>
            <CommunicationHeader>
              <CustomerParty>
                <Contact>
                  <SMSTelephoneCommunication>
                    <oa:FormattedNumber>+1234567890</oa:FormattedNumber>
                  </SMSTelephoneCommunication>
                </Contact>
              </CustomerParty>
              <BrandChannel>
                <Brand>
                  <oa:Code name="MyStore">MyStore</oa:Code>
                </Brand>
                <Channel>
                  <oa:Code name="Web">WEB</oa:Code>
                </Channel>
              </BrandChannel>
            </CommunicationHeader>
            <CommunicationItem>
              <oa:Message>
                <oa:Note>Your order has been shipped</oa:Note>
              </oa:Message>
            </CommunicationItem>
          </Communication>
        </DataArea>
      </ProcessCommunication>
    </SOAP-ENV:Body>
  </SOAP-ENV:Envelope>
`;

try {
  const smsData = await extractSmsData(soapXml);
  console.log(smsData);
  // Output:
  // {
  //   phoneNumber: '+1234567890',
  //   message: 'Your order has been shipped',
  //   brand: 'MyStore',
  //   brandName: 'MyStore',
  //   channel: 'WEB',
  //   channelName: 'Web',
  //   orderId: 'ORDER123',
  //   creationDateTime: '2023-03-22T15:30:45.123Z',
  //   actionExpression: 'SMS'
  // }
} catch (error) {
  console.error('Failed to extract SMS data:', error);
}
```

## XML Format

The package expects SOAP XML messages in the format provided by the SMS service provider. The XML structure follows the ATG SOAP specification with the following key elements:

- `SOAP-ENV:Envelope` and `SOAP-ENV:Body` for SOAP structure
- `ProcessCommunication` as the main message type
- `oa:ApplicationArea` containing the order ID and creation timestamp
- `DataArea` with communication details
- `oa:Process` and `oa:ActionCriteria` for action expressions
- `CommunicationHeader` for recipient, brand and channel information
- `CommunicationItem` for the message content

Please refer to the provider's documentation for the complete XML specification.

## API

### `extractSmsData(soapXml: string): Promise<SmsData>`

Extracts SMS data from ATG SOAP XML.

#### Parameters
- `soapXml` (string): The SOAP XML message to parse

#### Returns
- `Promise<SmsData>`: Object containing:
  - `phoneNumber` (string): Recipient's phone number
  - `message` (string): SMS message content
  - `brand` (string): Brand identifier
  - `brandName` (string, optional): Human-readable brand name
  - `channel` (string, optional): Channel code (WEB, MOB, CCC, STR)
  - `channelName` (string, optional): Human-readable channel name
  - `orderId` (string, optional): Associated order ID
  - `creationDateTime` (string, optional): Message creation timestamp
  - `actionExpression` (string, optional): SMS action type

#### Throws
- Error if XML is invalid
- Error if required fields are missing
- Error if parsing fails

## Types

### `SmsData`
```typescript
interface SmsData {
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
```

### `AtgSoapXml`
```typescript
interface AtgSoapXml {
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
```

## Error Handling

The package provides detailed error messages for common issues:

- Invalid XML structure
- Missing required fields
- Parsing errors

All errors are logged with context for debugging.

## Development

### Project Structure
```
xmlforge/
├── __tests__/           # Test files
├── utils/              # Utility functions
│   ├── xml.ts         # XML parsing utilities
│   └── extractor.ts   # Data extraction utilities
├── config.ts          # Configuration and constants
├── index.ts           # Main exports
├── parser.ts          # Main parser implementation
├── types.ts           # TypeScript type definitions
└── README.md          # This file
```

### Running Tests
```bash
npm test
```

### Building
```bash
npm run build
```
