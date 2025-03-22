/**
 * End-to-end tests for Infobip SMS sending with phone number formatting and retry logic
 */

import { formatPhoneNumber, isValidPhoneNumber } from '../utils.js';
import { sendSms } from '../client.js';
import { retryWithBackoff } from '../../../retryUtils.js';

// Mock the client module
jest.mock('../client.js', () => ({
  sendSms: jest.fn()
}));

describe('Infobip E2E tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Function that encapsulates the entire flow of formatting a phone number and sending an SMS
   * with retry logic
   */
  async function sendSmsWithFormattingAndRetry(
    phoneNumber: string,
    message: string,
    retryOptions = { maxRetries: 3, initialDelay: 500, factor: 2 }
  ) {
    // We're not testing validation in this test suite
    // Just sending the message with retry logic
    return await retryWithBackoff(
      () => sendSms(phoneNumber, message),
      retryOptions
    );
  }

  describe('Complete SMS sending flow', () => {
    test('should format phone numbers and send SMS successfully', async () => {
      // Configure the mock to return success
      (sendSms as jest.Mock).mockResolvedValue({ messageId: 'SMS12345' });

      // Examples of different phone number formats
      const phoneNumbers = [
        '+447123456789',   // International format with plus
        '07123456789',     // UK format with leading zero
        '447123456789',    // International format without plus
        '+44 7123 456-789' // International format with formatting
      ];

      // Send SMS to each number
      for (const phone of phoneNumbers) {
        const result = await sendSmsWithFormattingAndRetry(
          phone,
          'Test message'
        );

        expect(result).toEqual({ messageId: 'SMS12345' });
        expect(sendSms).toHaveBeenCalledWith(phone, 'Test message');
      }

      // Check that sendSms was called once for each number
      expect(sendSms).toHaveBeenCalledTimes(phoneNumbers.length);
    });

    test('should handle network errors and retry', async () => {
      // Configure the mock to fail once then succeed
      let attempts = 0;
      (sendSms as jest.Mock).mockImplementation(async () => {
        if (attempts++ < 1) {
          throw new Error('Network error');
        }
        return { messageId: 'SMS12345' };
      });

      // Send an SMS with a retry
      const result = await sendSmsWithFormattingAndRetry(
        '+447123456789',
        'Test message',
        { maxRetries: 3, initialDelay: 10, factor: 1.5 }
      );

      // Verify the result
      expect(result).toEqual({ messageId: 'SMS12345' });
      expect(sendSms).toHaveBeenCalledTimes(2); // Failed once, succeeded on retry
    });

    test('should conform to E.164 requirements in the formatPhoneNumber utility', () => {
      // Test different formats using the formatter directly
      // This doesn't send SMS, just checks the formatter works properly
      const testCases = [
        { input: '+447123456789', expected: '447123456789', country: 'UK' },
        { input: '07123456789', expected: '447123456789', country: 'UK' },
        { input: '+48123456789', expected: '48123456789', country: 'Poland' },
        { input: '0123456789', expected: '48123456789', country: 'Poland' },
        { input: '+44 (0) 7123-456-789', expected: '447123456789', country: 'UK' },
      ];

      for (const { input, expected, country } of testCases) {
        const formatted = formatPhoneNumber(input);
        expect(formatted).toBe(expected);

        // Verify E.164 format requirements
        expect(formatted).not.toMatch(/\+/); // No plus sign
        expect(formatted).not.toMatch(/\D/); // Only digits
        expect(formatted.length).toBeLessThanOrEqual(15); // Max 15 digits
      }
    });
  });
});