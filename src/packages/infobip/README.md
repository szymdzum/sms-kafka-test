# Infobip SMS Client Package

A modular, well-structured client for sending SMS messages via the Infobip API.

## Features

- Send single and bulk SMS messages
- E.164 phone number formatting and validation
- Configuration management
- TypeScript type definitions
- Detailed logging

## Setup

1. Install dependencies:
   ```bash
   npm install @infobip-api/sdk dotenv
   ```

2. Configure your environment variables in `.env`:
   ```
   INFOBIP_BASE_URL=https://your-infobip-api-url.com
   INFOBIP_API_KEY=your-api-key
   INFOBIP_DEFAULT_SENDER=YourSender  # Optional
   ```

## Usage Examples

### Basic Usage

```typescript
import { sendSms } from './packages/infobip/index.js';

// Send a single SMS
try {
  const result = await sendSms('447123456789', 'Hello from Infobip!');
  console.log('SMS sent successfully:', result);
} catch (error) {
  console.error('Failed to send SMS:', error);
}
```

### Sending Multiple Messages (Bulk)

```typescript
import { sendBulkSms } from './packages/infobip/index.js';

// Prepare multiple messages
const messages = [
  { phoneNumber: '447123456789', message: 'First message', senderId: 'Sender1' },
  { phoneNumber: '447987654321', message: 'Second message' } // Uses default sender
];

// Send bulk SMS
try {
  const result = await sendBulkSms(messages);
  console.log('Bulk SMS sent successfully:', result);
} catch (error) {
  console.error('Failed to send bulk SMS:', error);
}
```

### Phone Number Formatting and Validation

```typescript
import { formatPhoneNumber, isValidPhoneNumber } from './packages/infobip/index.js';

// Format a phone number to E.164 format
const formattedNumber = formatPhoneNumber('07123456789'); // Returns: '447123456789'

// Validate a phone number
if (isValidPhoneNumber('+447123456789')) {
  console.log('Phone number is valid');
} else {
  console.log('Phone number is invalid');
}
```

### Advanced Usage: Creating a Custom Client

```typescript
import { createInfobipClient } from './packages/infobip/index.js';
import { InfobipSmsRequest } from './packages/infobip/types.js';

// Create custom client
const infobip = createInfobipClient();

// Create a custom message payload
const messagePayload: InfobipSmsRequest = {
  type: 'text',
  messages: [{
    from: 'CustomSender',
    destinations: [{
      to: '447123456789',
      messageId: 'custom-msg-id-123'
    }],
    text: 'Custom message text',
  }],
};

// Send using the SMS channel
const smsChannel = infobip.channels.sms;
const response = await smsChannel.send(messagePayload);
console.log(response.data);
```

### Custom Configuration

```typescript
import { getInfobipConfig } from './packages/infobip/index.js';

// Get the current configuration
const config = getInfobipConfig();
console.log(`Base URL: ${config.baseUrl}`);
console.log(`Default Sender: ${config.defaultSender}`);
```

## Package Structure

- `index.ts` - Main entry point, exports all components
- `types.ts` - TypeScript definitions for Infobip API
- `config.ts` - Configuration management
- `client.ts` - Core client implementation
- `utils.ts` - Utility functions for phone number handling

## Running Tests

```bash
# Run the demo script
npm run infobip-demo

# Send a test SMS
npm run send-sms

# Send multiple test SMS messages
npm run send-bulk-sms
```

## Notes on Phone Number Formatting

When using Infobip for SMS, it is strongly recommended to use the E.164 number format, which is internationally standardized to a maximum length of 15 digits. Phone numbers should start with a country code, followed by a network code, and then the subscriber number. Plus prefixes (+) are not required.

Examples:
- UK number: 447712345678
- Poland number: 48123456789

The package's `formatPhoneNumber` function handles this automatically.