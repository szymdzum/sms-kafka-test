import { transformAtgSoapXml } from '../packages/xmlforge/atg-transformer.js';

/**
 * SMS Details for SOAP XML generation
 */
interface SmsDetails {
  phoneNumber: string;
  message: string;
  bodId: string;
  brandCode: string;
  brandName: string;
  channelCode: string;
  channelName: string;
  actionCode: string;
  creationDateTime: string;
}

/**
 * Helper function to parse SOAP XML to JSON
 */
async function soapXmlToJson(soapXml: string) {
  try {
    return await transformAtgSoapXml(soapXml);
  } catch (error) {
    console.error('Error parsing SOAP XML:', error);
    return null;
  }
}

/**
 * Test function to parse SOAP XML
 */
async function testSoapParsing(soapXml: string) {
  try {
    const result = await soapXmlToJson(soapXml);
    console.log('Parsed SOAP result:', result);
    return result;
  } catch (error) {
    console.error('Error testing SOAP parsing:', error);
    return null;
  }
}

/**
 * Generates a sample SOAP XML message for testing
 * @param customDetails Optional custom details to include in the generated message
 * @returns A SOAP XML string
 */
export function generateSoapXml(customDetails?: Partial<SmsDetails>): string {
  // Default values
  const details: SmsDetails = {
    phoneNumber: '+447771530911',
    message: 'Your order 00123731 has been placed, thank you for using TradePoint.co.uk',
    bodId: '00000016616867',
    brandCode: 'TP',
    brandName: 'TradePoint',
    channelCode: 'WEB',
    channelName: 'Web',
    actionCode: 'SMS',
    creationDateTime: new Date().toISOString(),
    ...customDetails
  };

  // Create the SOAP XML
  return `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/">
<SOAP-ENV:Body>
<ProcessCommunication releaseID="1.0" languageCode="en" versionID="0.3" xsi:schemaLocation="http://www.kingfisher.com/oagis/9 ../../com_kingfisher_oagis/9_5_1/Developer/BODs/ProcessCommunication.xsd" xmlns="http://www.kingfisher.com/oagis/9" xmlns:oa="http://www.openapplications.org/oagis/9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<oa:ApplicationArea>
<oa:CreationDateTime>${details.creationDateTime}</oa:CreationDateTime>
<oa:BODID>${details.bodId}</oa:BODID>
</oa:ApplicationArea>
<DataArea>
<oa:Process>
<oa:ActionCriteria>
<oa:ActionExpression expressionLanguage="text" actionCode="Add ">
  ${details.actionCode || 'SMS'}
</oa:ActionExpression>
</oa:ActionCriteria>
</oa:Process>
<Communication>
<CommunicationHeader>
<CustomerParty>
<Contact>
<SMSTelephoneCommunication>
<oa:FormattedNumber>
  ${details.phoneNumber}
</oa:FormattedNumber>
</SMSTelephoneCommunication>
</Contact>
</CustomerParty>
<BrandChannel>
<Brand>
<oa:Code name="${details.brandName || details.brandCode}">
  ${details.brandCode}
</oa:Code>
</Brand>
<Channel>
<oa:Code name="${details.channelName || details.channelCode}">
  ${details.channelCode}
</oa:Code>
</Channel>
</BrandChannel>
</CommunicationHeader>
<CommunicationItem>
<oa:Message>
<oa:Note>${details.message}</oa:Note>
</oa:Message>
</CommunicationItem>
</Communication>
</DataArea>
</ProcessCommunication>
</SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;
}

/**
 * Generates multiple sample SOAP messages with different details
 * @param count Number of samples to generate
 * @returns Array of SOAP XML strings
 */
export function generateSampleBatch(count: number = 5): string[] {
  const samples: string[] = [];

  // Generate samples with different phone numbers, messages, and IDs
  for (let i = 0; i < count; i++) {
    const orderNum = String(100000 + i).padStart(8, '0');
    const bodId = String(10000000 + i).padStart(14, '0');
    const channelOptions = ['WEB', 'MOB', 'STR'] as const;
    const channelNameOptions = ['Web', 'Mobile', 'Store'] as const;
    const channelIndex = i % channelOptions.length;

    // Ensure we have valid values
    const channelCode = channelOptions[channelIndex]!;
    const channelName = channelNameOptions[channelIndex]!;

    samples.push(generateSoapXml({
      phoneNumber: `+4477715309${i.toString().padStart(2, '0')}`,
      message: `Your order ${orderNum} has been placed, thank you for your purchase.`,
      bodId,
      brandCode: i % 2 === 0 ? 'TP' : 'BQ',
      brandName: i % 2 === 0 ? 'Trade Point' : 'B&Q',
      channelCode,
      channelName
    }));
  }

  return samples;
}

/**
 * Test function to demonstrate SOAP generation and parsing
 */
export async function testSoapGeneration(): Promise<void> {
  // Use the functions defined in this file
  console.log('Generating sample SOAP message...');
  const sampleXml = generateSoapXml({
    phoneNumber: '+447700900123',
    message: 'This is a test message from the SOAP generator',
    bodId: '00000099999999'
  });

  console.log('Sample SOAP XML:');
  console.log(sampleXml.substring(0, 200) + '...');

  console.log('\nParsing the generated SOAP message:');
  const parsedDetails = await soapXmlToJson(sampleXml);
  console.log('Parsed result:', parsedDetails);

  console.log('\nGenerating a batch');
  const batch = generateSampleBatch(3);
  console.log(`Generated ${batch.length} samples`);

  // Parse the first sample from the batch
  if (batch.length > 0) {
    console.log('\nParsing the first sample from batch:');
    const firstSample = batch[0];
    if (firstSample) {
      await testSoapParsing(firstSample);
    }
  }
}

testSoapGeneration();