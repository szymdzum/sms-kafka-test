// test-sms.js
import { sendSms } from './infobipClient.js';
import logger from './logger.js';


async function testSms() {
  try {
    // Replace with a test phone number
    const testPhone = process.env.TEST_PHONE_NUMBER || '48889403808';
    const result = await sendSms(
      testPhone,
      'This is a test SMS from the notification service',
      'TestSMS'
    );

    logger.info('Test SMS sent successfully', { result });
  } catch (error) {
    logger.error('Test SMS failed', { error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

testSms();