# XmlForge

A TypeScript package for extracting SMS data from ATG SOAP XML messages.

## Features

- Parses ATG SOAP XML messages with simplified approach
- Extracts SMS data (phone number, message, brand, channel, order ID, etc.)
- Validates XML structure and required fields
- Type-safe with TypeScript
- Comprehensive error handling
- Clean, maintainable code with minimal complexity

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

### Main Functions

#### `extractSmsData(soapXml: string): Promise<SmsData>`

Extracts SMS data from ATG SOAP XML.

**Parameters**
- `soapXml` (string): The SOAP XML message to parse

**Returns**
- `Promise<SmsData>`: Object containing extracted SMS data

**Throws**
- Error if XML is invalid
- Error if required fields are missing
- Error if parsing fails

### Utility Functions

#### `safeGet<T>(obj, path, defaultValue): T | undefined`

Type-safe function to access nested properties in an object.

**Parameters**
- `obj` (Record<string, unknown>): The object to access
- `path` (string[]): Array of path segments to traverse
- `defaultValue` (T, optional): Default value to return if path not found

**Returns**
- The value at the specified path, or the default value if the path doesn't exist

### Simplified XML Parsing

XmlForge uses the `xml2js` library with simplified options for parsing XML:

```typescript
const parsed = await parseStringPromise(soapXml, {
  explicitArray: false,
  normalize: true,
  trim: true
});
```

This configuration provides a more intuitive object structure that's easier to work with:
- `explicitArray: false` prevents single child nodes from being placed in arrays
- `normalize: true` normalizes whitespace in text nodes
- `trim: true` removes leading and trailing whitespace

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

## Error Handling

The package provides detailed error messages for common issues:

- Invalid XML structure (with specific sections identified)
- Missing required fields
- Parsing errors

All errors include context for easier debugging.

## Development

### Project Structure
```
xmlforge/
├── __tests__/           # Test files
├── utils/              # Utility functions
│   └── xml.ts         # XML validation utilities
├── parser.ts          # Main parser implementation
├── types.ts           # TypeScript type definitions
├── index.ts           # Main exports
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
