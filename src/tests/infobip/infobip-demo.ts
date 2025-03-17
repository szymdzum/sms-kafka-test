/**
 * Demo script showing how to use the Infobip package
 *
 * Usage:
 * npx tsx src/tests/infobip/infobip-demo.ts
 */

// Method 1: Import specific functions
import { sendSms, sendBulkSms, formatPhoneNumber, isValidPhoneNumber } from '../../packages/infobip/index.js';

// Method 2: Import default function (sendSms)
import infobipSend from '../../packages/infobip/index.js';

// Method 3: Import types directly
import { InfobipMessage, InfobipSmsRequest } from '../../packages/infobip/types.js';

// Method 4: Import configuration
import { getInfobipConfig } from '../../packages/infobip/config.js';

// Method 5: Create a custom client
import { createInfobipClient } from '../../packages/infobip/client.js';

async function runDemo() {
  console.log('Infobip Client Demo');
  console.log('-------------------');

  // Example 1: Format and validate phone numbers
  console.log('\nPhone Number Formatting Examples:');

  const phoneNumbers = [
    '07123456789',            // UK format with leading 0
    '+447123456789',          // UK format with country code and +
    '(555) 123-4567',         // US format with parentheses and dash
    '0048123456789',          // Poland with 00 prefix
    '12345',                  // Too short
    '123456789012345678901'   // Too long
  ];

  phoneNumbers.forEach(number => {
    const formatted = formatPhoneNumber(number);
    const isValid = isValidPhoneNumber(number);
    console.log(`Original: ${number}`);
    console.log(`Formatted: ${formatted}`);
    console.log(`Valid: ${isValid ? 'Yes' : 'No'}`);
    console.log('---');
  });

  // Example 2: Get configuration
  console.log('\nConfiguration:');
  const config = getInfobipConfig();
  console.log(`- Base URL: ${config.baseUrl}`);
  console.log(`- Default Sender: ${config.defaultSender}`);

  // Example 3: Send a single SMS (uncommented for testing)
  // To disable actual sending, comment this block again
  try {
    console.log('\nSending a test SMS message...');
    const testNumber = process.env.MY_NUMBER || '447123456789';
    const result = await sendSms(testNumber, 'Hello from the Infobip demo script!');
    console.log('\nSMS sent successfully:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Failed to send SMS:', error);
  }

  // Example 4: Send bulk SMS (left commented - uncomment to test)
  /*
  try {
    console.log('\nSending bulk test messages...');
    const testNumber = process.env.MY_NUMBER || '447123456789';
    const messages = [
      { phoneNumber: testNumber, message: 'First bulk message' },
      { phoneNumber: testNumber, message: 'Second bulk message' }
    ];
    const result = await sendBulkSms(messages);
    console.log('\nBulk SMS sent successfully:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Failed to send bulk SMS:', error);
  }
  */

  console.log('\nDemo completed!');
}

runDemo().catch(error => {
  console.error('Demo failed:', error);
});