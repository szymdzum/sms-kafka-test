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
  storeName: 'B&Q Farnborough',
  collectionDate: '14/07/2023',
  orderStatus: OrderStatus.ALLOCATED
});

// Result: "All items in your B&Q order ORDER123456 are now ready for collection from B&Q Farnborough. Please collect by 14/07/2023."
```

### Creating a Template

```typescript
import { MessageTemplate, SmsType, OrderStatus } from 'smsforge';

const template = new MessageTemplate({
  type: SmsType.ORDER,
  status: OrderStatus.ALLOCATED,
  template: 'All items in your B&Q order {orderId} are now ready for collection from {storeName}. Please collect by {collectionDate}.',
  requiredParams: ['orderId', 'storeName', 'collectionDate']
});

const message = template.format({
  orderId: 'ORDER123',
  storeName: 'B&Q Farnborough',
  collectionDate: '14/07/2023'
});
```

## Supported Order Statuses

The package supports the following order statuses:

| Order Status | Description | Required Parameters | Example Message |
|--------------|-------------|---------------------|----------------|
| ORDER_SUBMITTED | Order from WEB | orderId, storeName | Thanks for your B&Q order {orderId}. We'll text you when it's ready to collect from {storeName}. |
| NEW_ORDER | Order from .com+ | orderId, storeName | Your B&Q order {orderId} is being processed. We'll text you when it's ready to collect from {storeName}. |
| CANCELLED | Zero Allocation | orderId, storeName | We're very sorry we've had to cancel your B&Q order {orderId} as the item(s) are no longer available at {storeName}. |
| PARTIAL | Partial allocation | orderId, storeName, collectionDate | Your B&Q order {orderId} is ready to collect from {storeName}. Please collect by {collectionDate}. |
| ALLOCATED | Full allocation | orderId, storeName, collectionDate | All items in your B&Q order {orderId} are now ready for collection from {storeName}. Please collect by {collectionDate}. |
| COLLECTED | Collection confirmation | orderId | This is to confirm that item(s) from order {orderId} have been collected. Thank you for shopping with B&Q. |
| REMINDER | Collection reminder | orderId, storeName, collectionDate | Just a gentle reminder that your B&Q order {orderId} is ready for collection from {storeName}. Please collect by {collectionDate}. |
| FINAL_REMINDER | Final reminder | orderId, storeName, collectionDate | FINAL REMINDER: Your B&Q order {orderId} is ready for collection from {storeName}. Please collect by {collectionDate} to avoid cancellation. |
| EXPIRY_ALERT | Collection expiry | orderId, expiryDate, brand | Just to let you know your B&Q order {orderId} will expire on {expiryDate}. Please contact {brand} customer services if you need assistance. |

## Project Structure

```
smsforge/
├── __tests__/           # Test files
├── templates/          # Predefined templates
│   ├── collection.js
│   ├── collection-confirmation.js
│   ├── collection-reminder.js
│   ├── final-reminder.js
│   ├── expiry-alert.js
│   ├── order-submitted.js
│   ├── new-order.js
│   ├── cancelled-order.js
│   ├── partial-allocation.js
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
  ORDER_SUBMITTED = 'order_submitted',
  NEW_ORDER = 'new_order',
  CANCELLED = 'cancelled',
  PARTIAL = 'partial',
  ALLOCATED = 'allocated',
  COLLECTED = 'collected',
  REMINDER = 'reminder',
  FINAL_REMINDER = 'final_reminder',
  EXPIRY_ALERT = 'expiry_alert'
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

Example:
```typescript
try {
  const message = template.format({ orderId: 'ORDER123' });
  // This will throw a TemplateParameterError if storeName or collectionDate is missing
} catch (error) {
  if (error instanceof TemplateParameterError) {
    console.error('Missing required parameters:', error.message);
  }
}
```

## Development

### Running Tests
```bash
npm test
```

## License

MIT