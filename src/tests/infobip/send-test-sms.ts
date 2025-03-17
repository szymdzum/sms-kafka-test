/**
 * Simple script to send a test SMS using the Infobip package
 *
 * Usage:
 * npx tsx src/tests/infobip/send-test-sms.ts
 */

import { sendSms } from '../../packages/infobip/index.js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get test phone number from environment variables or use a default
const testPhoneNumber = process.env.MY_NUMBER || '447123456789';

async function sendTestSms() {
  console.log('Sending test SMS message...');
  console.log(`Target number: ${testPhoneNumber}`);

  try {
    const result = await sendSms(
      testPhoneNumber,
      'This is a test message from the Infobip client package!',
      // Optional: custom sender ID - if not provided, uses default from config
      // 'TestSender'
    );

    console.log('SMS sent successfully!');
    console.log(JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error('Failed to send SMS:');
    console.error(error);
    throw error;
  }
}

// Execute if this script is run directly
if (process.argv[1]?.endsWith('send-test-sms.ts') ||
    process.argv[1]?.endsWith('send-test-sms.js')) {
  sendTestSms()
    .then(() => console.log('Test completed successfully'))
    .catch(() => process.exit(1));
}

export default sendTestSms;