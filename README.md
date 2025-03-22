# SMS Notification Service

This project contains a Node.js application that processes order status notifications and sends SMS messages via the Infobip API.

## Overview

The system processes order status updates and generates appropriate SMS notifications based on the order status. It supports various notification types including order acknowledgements, allocation updates, collection confirmations, and reminders.

### Key Components

- **SMSForge Package**: Templating system for generating SMS content based on order status
- **Infobip Integration**: Client for sending SMS messages through the Infobip API
- **Retry & Circuit Breaker Patterns**: Ensures reliable message delivery

## SMS Templates

The system supports the following order status notifications:

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

## Prerequisites

This project requires:
- Node.js LTS (18.x or 20.x) or latest versions (21.x+)
- Infobip API credentials for SMS sending

## Installation

Install the dependencies:

```shell
npm install
```

Create a `.env` file with your configuration:

```
# Infobip
INFOBIP_API_KEY=your-api-key
INFOBIP_BASE_URL=https://api.infobip.com
INFOBIP_SENDER=YOUR_SENDER_ID
```

## Template Configuration

Each SMS template is configured with:
- SMS type (order, shipping, delivery, etc.)
- Order status (ORDER_SUBMITTED, ALLOCATED, REMINDER, etc.)
- Template string with parameter placeholders
- Required parameters list

When a parameter is missing during message generation, a `TemplateParameterError` is thrown.

## Usage

Generate an SMS message for an order:

```typescript
import { generateSmsForOrder, OrderStatus } from 'smsforge';

const message = await generateSmsForOrder({
  orderId: 'ORDER123456',
  storeName: 'B&Q Farnborough',
  collectionDate: '14/07/2023',
  orderStatus: OrderStatus.ALLOCATED
});

// Result: "All items in your B&Q order ORDER123456 are now ready for collection from B&Q Farnborough. Please collect by 14/07/2023."
```

Start the service:

```shell
npm start
```

Run the test suite:

```shell
npm test
```

## Learn more

- For Infobip SMS API, see the [Infobip API documentation](https://www.infobip.com/docs/api)
- For SMSForge package documentation, see the [SMSForge README](./src/packages/smsforge/README.md)
