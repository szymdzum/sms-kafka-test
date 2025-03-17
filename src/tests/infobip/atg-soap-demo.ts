/**
 * Demo script for processing ATG SOAP XML formats
 *
 * Usage:
 * npx tsx src/tests/infobip/atg-soap-demo.ts
 */

import { transformAtgSoapXml, isAtgSoapXml, generateOrderSms, processOrderAndSendSms } from '../../packages/xmlforge/index.js';
import { Order } from '../../packages/xmlforge/types.js';
import * as dotenv from 'dotenv';
import util from 'util';

// Load environment variables
dotenv.config();

// Sample ATG SOAP XML for B&Q order notification
const sampleAtgSoapXml = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/">
<SOAP-ENV:Body>
<ProcessCommunication releaseID="1.0" languageCode="en" versionID="0.3" xsi:schemaLocation="http://www.kingfisher.com/oagis/9 ../../com_kingfisher_oagis/9_5_1/Developer/BODs/ProcessCommunication.xsd" xmlns="http://www.kingfisher.com/oagis/9" xmlns:oa="http://www.openapplications.org/oagis/9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<oa:ApplicationArea>
<oa:CreationDateTime>2023-06-15T14:30:00Z</oa:CreationDateTime>
<oa:BODID>BQ12345-789</oa:BODID>
</oa:ApplicationArea>
<DataArea>
<oa:Process>
<oa:ActionCriteria>
<oa:ActionExpression expressionLanguage="text" actionCode="Add ">
  ORDER_SMS
</oa:ActionExpression>
</oa:ActionCriteria>
</oa:Process>
<Communication>
<CommunicationHeader>
<CustomerParty>
<Contact>
<SMSTelephoneCommunication>
<oa:FormattedNumber>
  ${process.env.MY_NUMBER || '447123456789'}
</oa:FormattedNumber>
</SMSTelephoneCommunication>
</Contact>
</CustomerParty>
<BrandChannel>
<Brand>
<oa:Code name="B&amp;Q">
  BQ
</oa:Code>
</Brand>
<Channel>
<oa:Code name="Online">
  ONLINE
</oa:Code>
</Channel>
</BrandChannel>
</CommunicationHeader>
<CommunicationItem>
<oa:Message>
<oa:Note>Your B&amp;Q order BQ12345 has been confirmed. Track your order at diy.com/orders</oa:Note>
</oa:Message>
</CommunicationItem>
</Communication>
</DataArea>
</ProcessCommunication>
</SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

// Sample ATG SOAP XML for TradePoint order notification
const sampleTradePointSoapXml = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/">
<SOAP-ENV:Body>
<ProcessCommunication releaseID="1.0" languageCode="en" versionID="0.3" xsi:schemaLocation="http://www.kingfisher.com/oagis/9 ../../com_kingfisher_oagis/9_5_1/Developer/BODs/ProcessCommunication.xsd" xmlns="http://www.kingfisher.com/oagis/9" xmlns:oa="http://www.openapplications.org/oagis/9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<oa:ApplicationArea>
<oa:CreationDateTime>2023-06-15T14:30:00Z</oa:CreationDateTime>
<oa:BODID>TP12345-789</oa:BODID>
</oa:ApplicationArea>
<DataArea>
<oa:Process>
<oa:ActionCriteria>
<oa:ActionExpression expressionLanguage="text" actionCode="Add ">
  ORDER_SMS
</oa:ActionExpression>
</oa:ActionCriteria>
</oa:Process>
<Communication>
<CommunicationHeader>
<CustomerParty>
<Contact>
<SMSTelephoneCommunication>
<oa:FormattedNumber>
  ${process.env.MY_NUMBER || '447123456789'}
</oa:FormattedNumber>
</SMSTelephoneCommunication>
</Contact>
</CustomerParty>
<BrandChannel>
<Brand>
<oa:Code name="TradePoint">
  TP
</oa:Code>
</Brand>
<Channel>
<oa:Code name="Online">
  ONLINE
</oa:Code>
</Channel>
</BrandChannel>
</CommunicationHeader>
<CommunicationItem>
<oa:Message>
<oa:Note>Your TradePoint order TP67890 has been shipped. Estimated delivery: June 20, 2023</oa:Note>
</oa:Message>
</CommunicationItem>
</Communication>
</DataArea>
</ProcessCommunication>
</SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

// Sample ATG SOAP XML for Screwfix order notification
const sampleScrewfixSoapXml = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/">
<SOAP-ENV:Body>
<ProcessCommunication releaseID="1.0" languageCode="en" versionID="0.3" xsi:schemaLocation="http://www.kingfisher.com/oagis/9 ../../com_kingfisher_oagis/9_5_1/Developer/BODs/ProcessCommunication.xsd" xmlns="http://www.kingfisher.com/oagis/9" xmlns:oa="http://www.openapplications.org/oagis/9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<oa:ApplicationArea>
<oa:CreationDateTime>2023-06-15T14:30:00Z</oa:CreationDateTime>
<oa:BODID>SF34567-123</oa:BODID>
</oa:ApplicationArea>
<DataArea>
<oa:Process>
<oa:ActionCriteria>
<oa:ActionExpression expressionLanguage="text" actionCode="Add ">
  ORDER_SMS
</oa:ActionExpression>
</oa:ActionCriteria>
</oa:Process>
<Communication>
<CommunicationHeader>
<CustomerParty>
<Contact>
<SMSTelephoneCommunication>
<oa:FormattedNumber>
  ${process.env.MY_NUMBER || '447123456789'}
</oa:FormattedNumber>
</SMSTelephoneCommunication>
</Contact>
</CustomerParty>
<BrandChannel>
<Brand>
<oa:Code name="Screwfix">
  SF
</oa:Code>
</Brand>
<Channel>
<oa:Code name="Click and Collect">
  COLLECT
</oa:Code>
</Channel>
</BrandChannel>
</CommunicationHeader>
<CommunicationItem>
<oa:Message>
<oa:Note>Your Screwfix order SF34567 is ready for collection from Birmingham Central store.</oa:Note>
</oa:Message>
</CommunicationItem>
</Communication>
</DataArea>
</ProcessCommunication>
</SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

/**
 * Demonstrate the XmlForge processing of ATG SOAP XML
 */
async function runAtgSoapDemo() {
  console.log('ATG SOAP XML Processing Demo');
  console.log('----------------------------');

  // DEMO 1: Detect ATG SOAP XML format
  console.log('\n1. Detect ATG SOAP XML format:');
  console.log('Is ATG SOAP XML format:', isAtgSoapXml(sampleAtgSoapXml));
  console.log('Is a regular XML order ATG SOAP format:', isAtgSoapXml('<order><id>123</id></order>'));

  // DEMO 2: Transform ATG SOAP XML to Order object
  console.log('\n2. Transform ATG SOAP XML to Order object:');
  try {
    const order: Order = await transformAtgSoapXml(sampleAtgSoapXml);
    console.log('Order Number:', order.orderNumber);
    console.log('Brand:', order.brand);
    console.log('Customer Phone:', order.customer.phoneNumber);
    console.log('Order Date:', order.orderDate);
  } catch (error) {
    console.error('Error transforming ATG SOAP XML to Order object', error);
  }

  // DEMO 3: Process different brand orders from ATG SOAP
  console.log('\n3. Process different brand orders from ATG SOAP:');

  try {
    console.log('\nB&Q Order:');
    const bqOrder = await transformAtgSoapXml(sampleAtgSoapXml);
    const bqSms = generateOrderSms(bqOrder, 'order_confirmation');
    console.log('SMS Message:', bqSms);

    console.log('\nTradePoint Order:');
    const tpOrder = await transformAtgSoapXml(sampleTradePointSoapXml);
    const tpSms = generateOrderSms(tpOrder, 'order_shipped');
    console.log('SMS Message:', tpSms);

    console.log('\nScrewfix Order:');
    const sfOrder = await transformAtgSoapXml(sampleScrewfixSoapXml);
    const sfSms = generateOrderSms(sfOrder, 'order_ready');
    console.log('SMS Message:', sfSms);
  } catch (error) {
    console.error('Error processing multiple SOAP orders', error);
  }

  // DEMO 4: Process order and send SMS (uncomment to test actual sending)
  console.log('\n4. Process order and send SMS:');
  const shouldSendSms = false; // Set to true to actually send SMS

  if (shouldSendSms) {
    try {
      console.log('Processing B&Q order and sending SMS...');
      const result = await processOrderAndSendSms(sampleAtgSoapXml);
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
if (process.argv[1]?.endsWith('atg-soap-demo.ts') ||
    process.argv[1]?.endsWith('atg-soap-demo.js')) {
  runAtgSoapDemo()
    .then(() => console.log('ATG SOAP demo completed successfully.'))
    .catch(error => {
      console.error('Demo failed:', error);
      process.exit(1);
    });
}

export default runAtgSoapDemo;