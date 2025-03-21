
# Infobip Client Documentation

## Overview

The Infobip Client is a TypeScript-based client implementation for interacting with the Infobip API. It provides a clean, type-safe interface for sending SMS messages and managing different environments.

## Features

- Environment-aware configuration (Development, Test, Production)
- Type-safe API interactions
- Automatic phone number formatting and validation
- Comprehensive error handling and logging
- Support for single and bulk SMS sending

## Installation

```bash
npm install @infobip-api/sdk dotenv
```

## Environment Configuration

The client supports three environments: development, test, and production. Configuration is managed through environment variables.

### Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Development Environment
INFOBIP_DEV_BASE_URL=https://dev-api.infobip.com
INFOBIP_DEV_API_KEY=your-dev-key
INFOBIP_DEV_DEFAULT_SENDER=KingFisher-Dev

# Test Environment
INFOBIP_TEST_BASE_URL=https://test-api.infobip.com
INFOBIP_TEST_API_KEY=your-test-key
INFOBIP_TEST_DEFAULT_SENDER=KingFisher-Test

# Production Environment
INFOBIP_PROD_BASE_URL=https://api.infobip.com
INFOBIP_PROD_API_KEY=your-prod-key
INFOBIP_PROD_DEFAULT_SENDER=KingFisher
```

### Setting the Environment

The environment is determined by the `NODE_ENV` environment variable:

```bash
# Development
NODE_ENV=development npm start

# Test
NODE_ENV=test npm test

# Production
NODE_ENV=production npm start
```

If `NODE_ENV` is not set, it defaults to 'development'.

## Usage

### Basic Client Creation

```typescript
import { createInfobipClient } from './packages/infobip';

// Create a client instance
const infobip = createInfobipClient();
```

### Sending SMS Messages

```typescript
import { sendSms, sendBulkSms } from './packages/infobip';

// Send a single SMS
try {
  const result = await sendSms('447123456789', 'Hello from Infobip!');
  console.log('SMS sent successfully:', result);
} catch (error) {
  console.error('Failed to send SMS:', error);
}

// Send multiple SMS messages
const messages = [
  { phoneNumber: '447123456789', message: 'First message' },
  { phoneNumber: '447987654321', message: 'Second message' }
];

try {
  const result = await sendBulkSms(messages);
  console.log('Bulk SMS sent successfully:', result);
} catch (error) {
  console.error('Failed to send bulk SMS:', error);
}
```

### Advanced Usage

```typescript
import { createInfobipClient } from './packages/infobip';
import { InfobipSmsRequest } from './packages/infobip/types';

// Create a custom client
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
```

## Phone Number Formatting

The client automatically formats phone numbers to E.164 format:

- UK numbers: 447712345678 (from 07123456789)
- Polish numbers: 48123456789 (from 0123456789)

### Validation

Phone numbers are validated according to E.164 standards:
- Maximum 15 digits
- Must include country code
- No special characters or spaces
- No plus (+) prefix

## Error Handling

The client includes comprehensive error handling:

```typescript
try {
  await sendSms(phoneNumber, message);
} catch (error) {
  // Handle specific error types
  if (error instanceof InfobipApiError) {
    console.error('API Error:', error.message);
  } else if (error instanceof InvalidPhoneNumberError) {
    console.error('Invalid phone number:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Logging

The client includes built-in logging for important events:

- SMS sending attempts
- Successful message delivery
- Configuration validation
- Error conditions

## Type Definitions

The client includes TypeScript definitions for all API interactions:

```typescript
interface InfobipConfig {
  baseUrl: string;
  apiKey: string;
  defaultSender: string;
}

interface InfobipMessage {
  from: string;
  destinations: InfobipDestination[];
  text?: string;
  content?: InfobipTextContent;
}
```

## Best Practices

1. **Environment Management**
   - Always use environment-specific API keys
   - Keep production credentials secure
   - Use different sender IDs for testing

2. **Error Handling**
   - Always wrap API calls in try-catch blocks
   - Implement proper error logging
   - Handle specific error types appropriately

3. **Phone Numbers**
   - Use the built-in phone number formatting
   - Validate phone numbers before sending
   - Follow E.164 format guidelines

4. **Performance**
   - Use bulk sending for multiple messages
   - Implement rate limiting if needed
   - Monitor API usage and quotas

## Troubleshooting

Common issues and solutions:

1. **Missing Environment Variables**
   - Ensure all required variables are set
   - Check environment name is correct
   - Verify .env file is loaded

2. **Invalid Phone Numbers**
   - Use the formatPhoneNumber utility
   - Check country code format
   - Verify number length

3. **API Errors**
   - Check API key validity
   - Verify base URL is correct
   - Monitor rate limits

## Contributing

When contributing to the client:

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Include type definitions
5. Handle all error cases

## License

MIT License