# EmailForge

A flexible email templating system for handling order status notifications with parameter substitution.

## Features

- Email template-based message formatting
- Parameter validation and substitution
- Status-based email templates
- Type-safe template configuration
- Email subject line support
- InfoBip Email API integration

## Installation

```bash
npm install emailforge
```

## Usage

### Basic Template Usage

```typescript
import { EmailTemplate, MessageType } from 'emailforge';

const template = new EmailTemplate({
  type: MessageType.EMAIL,
  subject: 'Order Status Update',
  template: 'Dear {name},\n\nYour order {orderId} is ready.',
  requiredParams: ['name', 'orderId']
});

const message = template.format({
  name: 'John',
  orderId: '12345'
});
```

### InfoBip Integration

```typescript
import { EmailTemplate, MessageType } from 'emailforge';
import { InfobipEmailClient } from 'emailforge/infobip';

// Create InfoBip client
const client = new InfobipEmailClient({
  apiKey: 'your-api-key',
  from: 'noreply@yourdomain.com'
});

// Create template
const template = new EmailTemplate({
  type: MessageType.EMAIL,
  subject: 'Order Ready for Collection',
  template: 'Dear {firstName},\n\nYour order {orderId} is ready for collection at {storeName}.',
  requiredParams: ['firstName', 'orderId', 'storeName']
});

// Send email
try {
  const response = await client.sendEmail(
    template,
    ['customer@example.com'],
    {
      firstName: 'John',
      orderId: '12345',
      storeName: 'Main Store'
    },
    {
      cc: ['manager@example.com'],
      replyTo: 'support@example.com'
    }
  );

  console.log('Email sent:', response.messages[0].messageId);
} catch (error) {
  console.error('Failed to send email:', error);
}
```

### Predefined Order Status Templates

```typescript
import {
  fullAllocationTemplate,
  collectionConfirmationTemplate,
  collectionReminderTemplate
} from 'emailforge/templates';

// Full Allocation
const allocationMessage = fullAllocationTemplate.format({
  firstName: 'John',
  orderId: '12345',
  storeName: 'Main Store',
  collectionPoint: 'Customer Service',
  storeAddress: '123 Main St, City',
  collectionHours: '9 AM - 5 PM'
});

// Collection Confirmation
const confirmationMessage = collectionConfirmationTemplate.format({
  firstName: 'John',
  orderId: '12345',
  collectionDate: '2024-03-22'
});

// Collection Reminder
const reminderMessage = collectionReminderTemplate.format({
  firstName: 'John',
  orderId: '12345',
  expiryDate: '2024-03-25',
  storeName: 'Main Store'
});
```

## API Reference

### EmailTemplate

#### Constructor
```typescript
new EmailTemplate({
  type: MessageType,
  template: string,
  requiredParams: string[],
  status?: OrderStatus,
  subject?: string
})
```

#### Methods
- `format(params: TemplateParams): string` - Format the template with provided parameters
- `getType(): MessageType` - Get the message type
- `getStatus(): OrderStatus | undefined` - Get the order status
- `getSubject(): string | undefined` - Get the email subject
- `getTemplate(): string` - Get the template string
- `getRequiredParams(): string[]` - Get required parameters

### InfobipEmailClient

#### Constructor
```typescript
new InfobipEmailClient({
  apiKey: string,
  baseUrl?: string,
  from?: string
})
```

#### Methods
- `sendEmail(template: EmailTemplate, to: string[], params: Record<string, string>, options?: Partial<InfobipEmailRequest>): Promise<InfobipEmailResponse>` - Send email using a template

### Types

```typescript
enum MessageType {
  EMAIL = 'EMAIL'
}

enum OrderStatus {
  ALLOCATED = 'ALLOCATED',
  COLLECTED = 'COLLECTED',
  REMINDER = 'REMINDER'
}

interface TemplateParams {
  [key: string]: string;
}

interface InfobipEmailRequest {
  from: string;
  to: string[];
  subject: string;
  text?: string;
  html?: string;
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string;
    contentType: string;
  }>;
}
```

## Error Handling

The package throws two types of errors:

- `TemplateValidationError`: When template configuration is invalid
- `TemplateParameterError`: When required parameters are missing

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