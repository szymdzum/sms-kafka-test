import { generateSoapXml, generateSampleBatch } from './soap-batch-test.js';
import { soapXmlToJson } from '../packages/soap-convertion.js';
// Import commented out to avoid dependency issues in test
// import { sendSmsSDK } from './infobipSDK';

/**
 * Test function to demonstrate the full flow from SOAP to SMS
 */
async function testSoapToSms() {
  try {
    console.log('=== SOAP to SMS Test ===');

    // 1. Generate a sample SOAP message
    console.log('\n1. Generating sample SOAP message...');
    const sampleXml = generateSoapXml({
      phoneNumber: '+48889403808',
      message: 'This is a test message from the SOAP generator',
      bodId: '00000099999999'
    });

    console.log('Sample SOAP XML (first 200 chars):');
    console.log(sampleXml.substring(0, 200) + '...');

    // 2. Parse the SOAP message
    console.log('\n2. Parsing the SOAP message...');
    const smsDetails = await soapXmlToJson(sampleXml);

    if (!smsDetails) {
      throw new Error('Failed to parse SOAP message');
    }

    console.log('Extracted SMS details:');
    console.log({
      bodId: smsDetails.bodId,
      phoneNumber: smsDetails.phoneNumber,
      message: smsDetails.message,
      brand: smsDetails.brandCode,
      channel: smsDetails.channelCode
    });

    // 3. Send SMS (commented out to avoid actual sending)
    console.log('\n3. Would send SMS with these details (sending disabled for test)');
    // Uncomment to actually send SMS:
    // await sendSmsSDK(smsDetails.phoneNumber, smsDetails.message);

    // 4. Generate a batch of samples
    console.log('\n4. Generating a batch of sample messages...');
    const batch = generateSampleBatch(3);
    console.log(`Generated ${batch.length} sample messages`);

    // 5. Process the batch
    console.log('\n5. Processing the batch...');

    // Statistics for batch summary
    const stats = {
      total: batch.length,
      success: 0,
      failed: 0,
      brandDistribution: {} as Record<string, number>,
      channelDistribution: {} as Record<string, number>
    };

    for (let i = 0; i < batch.length; i++) {
      console.log(`\nProcessing sample ${i + 1}:`);
      const sampleXml = batch[i];
      if (sampleXml) {
        const details = await soapXmlToJson(sampleXml);
        if (details) {
          stats.success++;

          // Update brand distribution
          const brandKey = `${details.brandCode} (${details.brandName || 'Unknown'})`;
          stats.brandDistribution[brandKey] = (stats.brandDistribution[brandKey] || 0) + 1;

          // Update channel distribution
          const channelKey = `${details.channelCode} (${details.channelName || 'Unknown'})`;
          stats.channelDistribution[channelKey] = (stats.channelDistribution[channelKey] || 0) + 1;

          console.log(`- Phone: ${details.phoneNumber}`);
          console.log(`- Message: ${details.message}`);
          console.log(`- Brand: ${details.brandCode} (${details.brandName || 'Unknown'})`);
          console.log(`- Channel: ${details.channelCode} (${details.channelName || 'Unknown'})`);
        } else {
          console.error(`Failed to parse sample ${i + 1}`);
          stats.failed++;
        }
      }
    }

    // 6. Print batch summary
    console.log('\n6. Batch Processing Summary:');
    console.log('===========================');
    console.log(`Total messages processed: ${stats.total}`);
    console.log(`Successfully parsed: ${stats.success} (${Math.round(stats.success/stats.total*100)}%)`);
    if (stats.failed > 0) {
      console.log(`Failed to parse: ${stats.failed} (${Math.round(stats.failed/stats.total*100)}%)`);
    }

    console.log('\nBrand Distribution:');
    Object.entries(stats.brandDistribution).forEach(([brand, count]) => {
      console.log(`- ${brand}: ${count} (${Math.round(count/stats.success*100)}%)`);
    });

    console.log('\nChannel Distribution:');
    Object.entries(stats.channelDistribution).forEach(([channel, count]) => {
      console.log(`- ${channel}: ${count} (${Math.round(count/stats.success*100)}%)`);
    });

    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testSoapToSms();