# XmlForge

A TypeScript package for extracting SMS data from ATG SOAP XML messages.

## Features

- Parses ATG SOAP XML messages
- Extracts SMS data (phone number, message, brand, channel, order ID, etc.)
- Validates XML structure and required fields
- Type-safe with TypeScript
- Comprehensive error handling
- Detailed logging
- Performance optimization with memoization

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

#### `getXmlValue<T>(xml, path, defaultValue, emptyAsUndefined, validator): T`

Type-safe function to extract values from XML using a path.

**Parameters**
- `xml` (GenericXml): The XML object to extract from
- `path` (readonly (string | number)[]): Array of path segments to traverse
- `defaultValue` (T, optional): Default value to return if path not found
- `emptyAsUndefined` (boolean, optional): Whether to return undefined for empty strings
- `validator` (ValueValidator<T>, optional): Function to validate the extracted value

#### `getXmlTextValue(xml, path, textProperty): string | undefined`

Extracts text content from XML, handling complex elements with attributes.

**Parameters**
- `xml` (GenericXml): The XML object to extract from
- `path` (readonly (string | number)[]): Array of path segments to traverse
- `textProperty` (string, optional): The property to extract if result is an object (defaults to '_')

#### `clearXmlCache(): void`

Clears the internal memoization cache for XML path resolution. Useful when processing multiple XML documents or when memory usage is a concern.

## Performance Optimization

XmlForge includes built-in performance optimizations:

- **Memoization** of XML path resolution for faster repeated access to the same paths
- **Efficient traversal** of XML structure with early termination
- **Smart caching** of intermediate results

For large XML documents or high-throughput applications, consider these additional tips:

- Call `clearXmlCache()` after processing each document to prevent memory leaks
- Batch process related XML documents to take advantage of the memoization cache
- Use specific paths rather than broad searches for better performance

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

### `XmlElement`
```typescript
interface XmlElement<T = string> {
  _?: T;
  $?: {
    name?: string;
    [key: string]: unknown;
  };
}
```

### `GenericXml`
```typescript
type GenericXml = {
  [key: string]: GenericXmlValue;
};

type GenericXmlValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | GenericXmlArray
  | GenericXmlObject
  | XmlAttributes;

type GenericXmlArray = Array<GenericXmlValue>;

type GenericXmlObject = {
  [key: string]: GenericXmlValue;
  $?: XmlAttributes;
  _?: string;
};

interface XmlAttributes {
  name?: string;
  [attr: string]: unknown;
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
│   └── xml.ts         # XML parsing utilities
├── config.ts          # Configuration constants
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
