/**
 * Demo script for the XmlForge package
 *
 * Usage:
 * npx tsx src/tests/infobip/xmlforge-demo.ts
 */

import { transformXmlToJson, transformOrderXml, generateOrderSms, processOrderAndSendSms } from '../../packages/xmlforge/index.js';
import { Order } from '../../packages/xmlforge/types.js';
import * as dotenv from 'dotenv';
import util from 'util';

// Load environment variables
dotenv.config();

// Sample XML order data for B&Q
const sampleBQXml = `
<order>
  <id>ORD123456</id>
  <orderNumber>BQ00123456</orderNumber>
  <orderDate>2023-03-15T14:30:00Z</orderDate>
  <status>PROCESSING</status>
  <customer>
    <id>CUST987654</id>
    <firstName>John</firstName>
    <lastName>Smith</lastName>
    <email>john.smith@example.com</email>
    <phoneNumber>${process.env.MY_NUMBER || '447123456789'}</phoneNumber>
  </customer>
  <shippingAddress>
    <street1>123 Main Street</street1>
    <city>London</city>
    <postalCode>SW1A 1AA</postalCode>
    <country>UK</country>
  </shippingAddress>
  <billingAddress>
    <street1>123 Main Street</street1>
    <city>London</city>
    <postalCode>SW1A 1AA</postalCode>
    <country>UK</country>
  </billingAddress>
  <items>
    <item>
      <id>PROD001</id>
      <sku>BQ12345</sku>
      <name>Premium Hammer</name>
      <quantity>1</quantity>
      <unitPrice>29.99</unitPrice>
      <totalPrice>29.99</totalPrice>
    </item>
    <item>
      <id>PROD002</id>
      <sku>BQ67890</sku>
      <name>Box of Nails</name>
      <quantity>2</quantity>
      <unitPrice>5.99</unitPrice>
      <totalPrice>11.98</totalPrice>
    </item>
  </items>
  <shippingMethod>STANDARD</shippingMethod>
  <subtotal>41.97</subtotal>
  <shippingCost>3.99</shippingCost>
  <tax>9.19</tax>
  <total>55.15</total>
  <estimatedDeliveryDate>2023-03-18</estimatedDeliveryDate>
  <brand>B&amp;Q</brand>
</order>
`;

// Sample XML order data for TradePoint
const sampleTradePointXml = `
<order>
  <id>ORD789012</id>
  <orderNumber>TP00789012</orderNumber>
  <orderDate>2023-03-15T09:45:00Z</orderDate>
  <status>PROCESSING</status>
  <customer>
    <id>CUST654321</id>
    <firstName>Jane</firstName>
    <lastName>Doe</lastName>
    <email>jane.doe@example.com</email>
    <phoneNumber>${process.env.MY_NUMBER || '447123456789'}</phoneNumber>
  </customer>
  <shippingAddress>
    <street1>456 Business Park</street1>
    <city>Manchester</city>
    <postalCode>M1 1AA</postalCode>
    <country>UK</country>
  </shippingAddress>
  <billingAddress>
    <street1>456 Business Park</street1>
    <city>Manchester</city>
    <postalCode>M1 1AA</postalCode>
    <country>UK</country>
  </billingAddress>
  <items>
    <item>
      <id>PROD003</id>
      <sku>TP54321</sku>
      <name>Professional Drill</name>
      <quantity>1</quantity>
      <unitPrice>89.99</unitPrice>
      <totalPrice>89.99</totalPrice>
    </item>
  </items>
  <shippingMethod>NEXT_DAY</shippingMethod>
  <subtotal>89.99</subtotal>
  <shippingCost>5.99</shippingCost>
  <tax>19.20</tax>
  <total>115.18</total>
  <estimatedDeliveryDate>2023-03-16</estimatedDeliveryDate>
  <brand>TradePoint</brand>
</order>
`;

// Sample XML order data for Screwfix with Click & Collect
const sampleScrewfixXml = `
<order>
  <id>ORD345678</id>
  <orderNumber>SF00345678</orderNumber>
  <orderDate>2023-03-15T11:15:00Z</orderDate>
  <status>PROCESSING</status>
  <customer>
    <id>CUST123456</id>
    <firstName>Robert</firstName>
    <lastName>Johnson</lastName>
    <email>robert.johnson@example.com</email>
    <phoneNumber>${process.env.MY_NUMBER || '447123456789'}</phoneNumber>
  </customer>
  <shippingAddress>
    <street1>789 Residential Road</street1>
    <city>Birmingham</city>
    <postalCode>B1 1AA</postalCode>
    <country>UK</country>
  </shippingAddress>
  <billingAddress>
    <street1>789 Residential Road</street1>
    <city>Birmingham</city>
    <postalCode>B1 1AA</postalCode>
    <country>UK</country>
  </billingAddress>
  <items>
    <item>
      <id>PROD004</id>
      <sku>SF98765</sku>
      <name>Power Screwdriver</name>
      <quantity>1</quantity>
      <unitPrice>49.99</unitPrice>
      <totalPrice>49.99</totalPrice>
    </item>
  </items>
  <shippingMethod>CLICK_AND_COLLECT</shippingMethod>
  <subtotal>49.99</subtotal>
  <shippingCost>0.00</shippingCost>
  <tax>10.00</tax>
  <total>59.99</total>
  <collectionStore>Birmingham Central</collectionStore>
  <brand>Screwfix</brand>
</order>
`;

/**
 * Demonstrate the XmlForge features
 */
async function runXmlForgeDemo() {
  console.log('XmlForge Demo');
  console.log('-------------');

  // DEMO 1: Basic XML to JSON transformation
  console.log('\n1. Basic XML to JSON transformation:');
  try {
    const jsonData = await transformXmlToJson(sampleBQXml);
    console.log(util.inspect(jsonData, { depth: 2, colors: true }));
  } catch (error) {
    console.error('Error transforming XML to JSON', error);
  }

  // DEMO 2: Transform to structured Order object
  console.log('\n2. Transform to structured Order object:');
  try {
    const order: Order = await transformOrderXml(sampleBQXml);
    console.log('Order Number:', order.orderNumber);
    console.log('Customer:', `${order.customer.firstName} ${order.customer.lastName}`);
    console.log('Total:', `£${order.total}`);
    console.log('Status:', order.status);
    console.log('Number of items:', order.items.length);
  } catch (error) {
    console.error('Error transforming to Order object', error);
  }

  // DEMO 3: Generate SMS from order data
  console.log('\n3. Generate SMS messages for different brands:');

  try {
    console.log('\nB&Q Order:');
    const bqOrder = await transformOrderXml(sampleBQXml);
    const bqSms = generateOrderSms(bqOrder, 'order_confirmation');
    console.log('SMS Message:', bqSms);

    console.log('\nTradePoint Order:');
    const tpOrder = await transformOrderXml(sampleTradePointXml);
    const tpSms = generateOrderSms(tpOrder, 'order_confirmation');
    console.log('SMS Message:', tpSms);

    console.log('\nScrewfix Order:');
    const sfOrder = await transformOrderXml(sampleScrewfixXml);
    const sfSms = generateOrderSms(sfOrder, 'order_confirmation');
    console.log('SMS Message:', sfSms);
  } catch (error) {
    console.error('Error generating SMS', error);
  }

  // DEMO 4: Process order and send SMS (uncomment to test actual sending)
  console.log('\n4. Process order and send SMS:');
  const shouldSendSms = false; // Set to true to actually send SMS

  if (shouldSendSms) {
    try {
      console.log('Processing B&Q order and sending SMS...');
      const result = await processOrderAndSendSms(sampleBQXml);
      console.log(`Order processed, SMS sent: ${result.smsSent}`);

      if (result.smsError) {
        console.error('SMS Error:', result.smsError.message);
      }
    } catch (error) {
      console.error('Error processing order', error);
    }
  } else {
    console.log('SMS sending disabled. Set shouldSendSms = true to test actual SMS sending.');
  }

  console.log('\nDemo completed!');
}

// Run the demo if this script is executed directly
if (process.argv[1]?.endsWith('xmlforge-demo.ts') ||
    process.argv[1]?.endsWith('xmlforge-demo.js')) {
  runXmlForgeDemo()
    .then(() => console.log('XmlForge demo completed successfully.'))
    .catch(error => {
      console.error('Demo failed:', error);
      process.exit(1);
    });
}

export default runXmlForgeDemo;