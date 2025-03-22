# SMSForge

A TypeScript package for generating SMS messages from templates with support for different order statuses.

## Features

- Type-safe SMS template configuration
- Order status-based template selection
- Parameter validation and error handling
- Template parameter interpolation
- Utility functions for template operations

## Installation

```bash
npm install smsforge
```

## Usage

### Basic Example

```typescript
import { generateSmsForOrder, OrderStatus } from 'smsforge';

// Generate an SMS message for an order
const message = await generateSmsForOrder({
  orderId: 'ORDER123456',
  orderStatus: OrderStatus.ALLOCATED
});

// Result: "All or part of your order ORDER123456 is now ready for collection..."
```

### Creating a Template

```typescript
import { MessageTemplate, SmsType, OrderStatus } from 'smsforge';

const template = new MessageTemplate({
  type: SmsType.ORDER,
  status: OrderStatus.ALLOCATED,
  template: 'Your order {orderId} is ready for collection',
  requiredParams: ['orderId']
});

const message = template.format({ orderId: 'ORDER123' });
```

## Project Structure

```
smsforge/
├── __tests__/           # Test files
├── templates/          # Predefined templates
│   ├── collection.js
│   ├── collection-confirmation.js
│   ├── collection-reminder.js
│   └── index.ts
├── utils/             # Utility functions
│   ├── template.ts
│   ├── template-utils.ts
│   └── index.ts
├── config.ts         # Configuration and constants
├── template.ts       # Core template implementation
├── types.ts         # TypeScript type definitions
└── README.md        # This file
```

## Types

### Message Types
```typescript
enum SmsType {
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
  ALLOCATED = 'allocated',
  COLLECTED = 'collected',
  REMINDER = 'reminder'
}
```

### Template Configuration
```typescript
interface TemplateConfig {
  type: SmsType;
  template: string;
  requiredParams: string[];
  status?: OrderStatus;
}
```

## Error Handling

The package includes two types of errors:

1. `TemplateValidationError`: Thrown when template configuration is invalid
   - Missing template string
   - Invalid required parameters array

2. `TemplateParameterError`: Thrown when required parameters are missing during formatting

## Development

### Running Tests
```bash
npm test
```

## License

MIT