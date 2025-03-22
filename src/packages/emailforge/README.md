# EmailForge

A package for handling email message templating with support for both plain text and HTML formats.

## Features

- Type-safe email template configuration
- Support for plain text and HTML templates
- Parameter validation and error handling
- Customizable email headers (from, reply-to)
- Order status tracking
- Template parameter interpolation

## Installation

```bash
npm install emailforge
```

## Usage

### Basic Example

```typescript
import { EmailTemplate, EmailType } from './template';
import { EmailTemplateConfig } from './types';

const config: EmailTemplateConfig = {
  type: EmailType.ORDER,
  template: 'Your order {orderId} has been confirmed.',
  htmlTemplate: '<p>Your order <strong>{orderId}</strong> has been confirmed.</p>',
  subject: 'Order Confirmation',
  requiredParams: ['orderId'],
  from: 'orders@example.com',
  replyTo: 'support@example.com'
};

const template = new EmailTemplate(config);

const email = template.format({
  orderId: '12345'
});

// Result:
// {
//   subject: 'Order Confirmation',
//   text: 'Your order 12345 has been confirmed.',
//   html: '<p>Your order <strong>12345</strong> has been confirmed.</p>',
//   from: 'orders@example.com',
//   replyTo: 'support@example.com'
// }
```

### Available Email Types

```typescript
enum EmailType {
  ORDER = 'order',
  SHIPPING = 'shipping',
  DELIVERY = 'delivery',
  CANCELLATION = 'cancellation',
  REFUND = 'refund',
  CUSTOMER_SERVICE = 'customer_service'
}
```

### Order Status Types

```typescript
enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}
```

### Template Configuration

The `EmailTemplateConfig` interface defines the structure for email templates:

```typescript
interface EmailTemplateConfig {
  type: EmailType;              // Type of email message
  template: string;             // Plain text template
  requiredParams: string[];     // Required parameters for the template
  status?: OrderStatus;         // Optional order status
  htmlTemplate?: string;        // Optional HTML template
  subject: string;              // Email subject
  from?: string;               // Optional sender email
  replyTo?: string;            // Optional reply-to email
}
```

### Error Handling

The package includes two types of errors:

1. `TemplateValidationError`: Thrown when template configuration is invalid
   - Missing template string
   - Missing subject
   - Invalid required parameters array

2. `TemplateParameterError`: Thrown when required parameters are missing during formatting

## API Reference

### EmailTemplate Class

#### Constructor
```typescript
constructor(config: EmailTemplateConfig)
```

#### Methods

- `format(params: EmailTemplateParams): FormattedEmail`
  - Formats the template with provided parameters
  - Returns a `FormattedEmail` object containing subject, text, and optional HTML content

#### Getters

- `getType(): EmailType`
- `getStatus(): OrderStatus | undefined`
- `getTemplate(): string`
- `getHtmlTemplate(): string | undefined`
- `getSubject(): string`
- `getFrom(): string | undefined`
- `getReplyTo(): string | undefined`
- `getRequiredParams(): string[]`

## Best Practices

1. Always specify required parameters in the configuration
2. Use HTML templates for rich email content
3. Set appropriate email headers (from, reply-to) for better deliverability
4. Handle both validation and parameter errors in your application
5. Use type-safe enums for email types and order statuses

## Error Examples

### Missing Required Parameters
```typescript
const template = new EmailTemplate({
  type: EmailType.ORDER,
  template: 'Order {orderId} status: {status}',
  subject: 'Order Status',
  requiredParams: ['orderId', 'status']
});

// This will throw TemplateParameterError
template.format({
  orderId: '12345'
  // Missing 'status' parameter
});
```

### Invalid Configuration
```typescript
// This will throw TemplateValidationError
new EmailTemplate({
  type: EmailType.ORDER,
  template: '', // Empty template
  subject: 'Order Status',
  requiredParams: ['orderId']
});
```

## Development

### Project Structure
```
emailforge/
├── __tests__/           # Test files
├── templates/          # Predefined templates
├── types.ts           # TypeScript type definitions
├── template.ts        # Template implementation
├── infobip.ts         # InfoBip API integration
└── README.md          # This file
```

### Running Tests
```bash
npm test
```

## License

MIT