/**
 * Example script for sending bulk SMS messages
 *
 * Usage:
 * npx tsx src/tests/infobip/send-bulk-sms.ts
 */

import { sendBulkSms, formatPhoneNumber, isValidPhoneNumber } from '../../packages/infobip/index.js';
import * as dotenv from 'dotenv';
import util from 'util';

// Load environment variables
dotenv.config();

// Get test phone number from environment variables or use a default
const testPhoneNumber = process.env.MY_NUMBER || '447123456789';

async function sendBulkTestSms() {
  // Validate the phone number first
  if (!isValidPhoneNumber(testPhoneNumber)) {
    console.warn(`Warning: The test phone number ${testPhoneNumber} may not be valid!`);
    console.log(`Formatted number: ${formatPhoneNumber(testPhoneNumber)}`);
  }

  // Create a sample batch of messages
  // In a real scenario, these might come from a database or file
  const messages = [
    {
      phoneNumber: testPhoneNumber,
      message: 'This is the first test message from the bulk sender!',
      senderId: 'Test1'
    },
    {
      phoneNumber: testPhoneNumber, // Sending to same number for testing
      message: 'This is the second test message from the bulk sender!',
      senderId: 'Test2'
    },
    {
      phoneNumber: testPhoneNumber, // Sending to same number for testing
      message: 'This is the third test message from the bulk sender!',
      // Using the default sender ID from config
    }
  ];

  console.log(`Sending ${messages.length} bulk SMS messages to ${testPhoneNumber}...`);

  try {
    const result = await sendBulkSms(messages);

    console.log('Bulk SMS sent successfully!');
    console.log(util.inspect(result, { depth: null, colors: true }));

    return result;
  } catch (error) {
    console.error('Failed to send bulk SMS:');
    console.error(error);
    throw error;
  }
}

// Execute if this script is run directly
if (process.argv[1]?.endsWith('send-bulk-sms.ts') ||
    process.argv[1]?.endsWith('send-bulk-sms.js')) {
  sendBulkTestSms()
    .then(() => console.log('Bulk SMS test completed successfully'))
    .catch(() => process.exit(1));
}

export default sendBulkTestSms;