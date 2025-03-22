# SMSForge

A flexible SMS templating system for handling order status notifications with parameter substitution.

## Features

- SMS template-based message formatting
- Parameter validation and substitution
- Status-based SMS templates
- Type-safe template configuration

## Installation

```bash
npm install smsforge
```

## Usage

### Basic Template Usage

```typescript
import { MessageTemplate, MessageType } from 'smsforge';

const template = new MessageTemplate({
  type: MessageType.SMS,
  template: 'Hello {name}! Your order {orderId} is ready.',
  requiredParams: ['name', 'orderId']
});

const message = template.format({
  name: 'John',
  orderId: '12345'
});
// Output: "Hello John! Your order 12345 is ready."
```

### Predefined Order Status Templates

```typescript
import {
  fullAllocationTemplate,
  collectionConfirmationTemplate,
  collectionReminderTemplate
} from 'smsforge/templates';

// Full Allocation
const allocationMessage = fullAllocationTemplate.format({
  orderId: '12345'
});

// Collection Confirmation
const confirmationMessage = collectionConfirmationTemplate.format({
  orderId: '12345'
});

// Collection Reminder
const reminderMessage = collectionReminderTemplate.format({
  orderId: '12345',
  expiryDate: '2024-03-25'
});
```

## Available Templates

### Full Allocation (ALLOCATED)
- **Purpose**: Notify customer that order is ready for collection
- **Required Parameters**: `orderId`
- **Message**: "All or part of your order {orderId} is now ready for collection, we've emailed you further details. See what ID is required at http://www.diy.com/collect"

### Collection Confirmation (COLLECTED)
- **Purpose**: Confirm order collection
- **Required Parameters**: `orderId`
- **Message**: "This is to confirm that item(s) from order {orderId} were collected today. Further details have been emailed to you. Thank you."

### Collection Reminder (REMINDER)
- **Purpose**: Remind customer about pending collection
- **Required Parameters**: `orderId`, `expiryDate`
- **Message**: "Just a gentle reminder that your B&Q order {orderId} is still waiting to be collected. It will be held until {expiryDate}. We've emailed you further details."

## API Reference

### MessageTemplate

#### Constructor
```typescript
new MessageTemplate({
  type: MessageType,
  template: string,
  requiredParams: string[],
  status?: OrderStatus
})
```

#### Methods
- `format(params: TemplateParams): string` - Format the template with provided parameters
- `getType(): MessageType` - Get the message type
- `getStatus(): OrderStatus | undefined` - Get the order status
- `getTemplate(): string` - Get the template string
- `getRequiredParams(): string[]` - Get required parameters

### Types

```typescript
enum MessageType {
  SMS = 'SMS'
}

enum OrderStatus {
  ALLOCATED = 'ALLOCATED',
  COLLECTED = 'COLLECTED',
  REMINDER = 'REMINDER'
}

interface TemplateParams {
  [key: string]: string;
}
```

## Error Handling

The package throws two types of errors:

- `TemplateValidationError`: When template configuration is invalid
- `TemplateParameterError`: When required parameters are missing

## Development

### Project Structure
```
smsforge/
├── __tests__/           # Test files
├── templates/          # Predefined templates
├── types.ts           # TypeScript type definitions
├── template.ts        # Template implementation
└── README.md          # This file
```

### Running Tests
```bash
npm test
```

## License

MIT