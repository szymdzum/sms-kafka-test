# XMLForge

XMLForge is a TypeScript package designed to extract SMS data from ATG SOAP XML messages. It provides a robust and type-safe way to parse and validate SMS-related information from XML structures.

## Features

- Type-safe XML parsing
- Structured SMS data extraction
- Built-in validation
- Comprehensive error handling
- Detailed logging

## Usage

```typescript
// Example SOAP XML
const soapXml = `
  <SOAP-ENV:Envelope>
    <SOAP-ENV:Body>
      <ProcessCommunication>
        <!-- ... XML content ... -->
      </ProcessCommunication>
    </SOAP-ENV:Body>
  </SOAP-ENV:Envelope>
`;

try {
  const smsData = await extractSmsData(soapXml);
  console.log(smsData);
  // Output:
  // {
  //   phoneNumber: "+1234567890",
  //   message: "Your order has been shipped",
  //   brand: "MyStore",
  //   orderId: "ORDER123"
  // }
} catch (error) {
  console.error('Failed to parse SMS data:', error);
}
```

## API

### `extractSmsData(soapXml: string): Promise<SmsData>`

Extracts SMS data from ATG SOAP XML.

#### Parameters
- `soapXml`: string - The SOAP XML string to parse

#### Returns
- `Promise<SmsData>` - A promise that resolves to the extracted SMS data

#### SmsData Interface
```typescript
interface SmsData {
  phoneNumber: string;  // Customer phone number
  message: string;      // Message to be sent
  brand: string;        // Brand/sender of the message
  orderId?: string;     // Optional order ID for tracking
}
```

## Error Handling

The package includes comprehensive error handling:
- Validates XML input
- Checks for required fields
- Provides detailed error messages
- Logs errors and warnings

## Development

### Project Structure
```
xmlforge/
├── config.ts      # XML path configurations
├── extractor.ts   # SMS data extraction functions
├── sms-parser.ts  # Main parser implementation
├── types.ts       # TypeScript type definitions
├── utils.ts       # Utility functions
└── index.ts       # Package entry point
```

## License

MIT