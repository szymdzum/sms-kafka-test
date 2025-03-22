/**
 * Tests for Infobip utility functions
 * Focuses on phone number formatting and validation
 */

import { formatPhoneNumber, isValidPhoneNumber } from '../utils.js';
import { retryWithBackoff } from '../../../retryUtils.js';

describe('Phone number formatting', () => {
  describe('formatPhoneNumber', () => {
    test('should handle UK numbers with country code', () => {
      // Test with + prefix
      expect(formatPhoneNumber('+447123456789')).toBe('447123456789');
      // Test without + prefix
      expect(formatPhoneNumber('447123456789')).toBe('447123456789');
      // Test with spaces and formatting
      expect(formatPhoneNumber('+44 7123 456 789')).toBe('447123456789');
      expect(formatPhoneNumber('+44 (0) 7123-456-789')).toBe('447123456789');
    });

    test('should handle UK numbers with leading zero', () => {
      expect(formatPhoneNumber('07123456789')).toBe('447123456789');
      expect(formatPhoneNumber('07123 456 789')).toBe('447123456789');
      expect(formatPhoneNumber('0 7123 456-789')).toBe('447123456789');
    });

    test('should handle Polish numbers with country code', () => {
      expect(formatPhoneNumber('+48123456789')).toBe('48123456789');
      expect(formatPhoneNumber('48123456789')).toBe('48123456789');
      expect(formatPhoneNumber('+48 123 456 789')).toBe('48123456789');
    });

    test('should handle Polish numbers with leading zero', () => {
      expect(formatPhoneNumber('0123456789')).toBe('48123456789');
      expect(formatPhoneNumber('0123 456 789')).toBe('48123456789');
    });

    test('should truncate numbers that exceed maximum length', () => {
      expect(formatPhoneNumber('123456789012345678')).toBe('123456789012345');
    });

    test('should handle malformed input gracefully', () => {
      expect(formatPhoneNumber('Not a number')).toBe('');
      expect(formatPhoneNumber('')).toBe('');
      expect(formatPhoneNumber('123')).toBe('123'); // Too short but still returns digits
    });

    test('should retain numbers when format is unknown', () => {
      expect(formatPhoneNumber('19876543210')).toBe('19876543210'); // Unknown format but valid digits
    });
  });

  describe('isValidPhoneNumber', () => {
    test('should validate by basic length requirements', () => {
      // Valid - enough digits
      expect(isValidPhoneNumber('+447123456789')).toBe(true);
      expect(isValidPhoneNumber('447123456789')).toBe(true);
      expect(isValidPhoneNumber('07123456789')).toBe(true);
      expect(isValidPhoneNumber('+48123456789')).toBe(true);
      expect(isValidPhoneNumber('48123456789')).toBe(true);
      expect(isValidPhoneNumber('0123456789')).toBe(true);

      // Even these are considered valid now - we're just checking basic length
      expect(isValidPhoneNumber('+44712345678')).toBe(true);
      expect(isValidPhoneNumber('+4812345678')).toBe(true);
    });

    test('should reject numbers that are too short or too long', () => {
      // Too short (less than 7 digits)
      expect(isValidPhoneNumber('123')).toBe(false);
      expect(isValidPhoneNumber('123456')).toBe(false);

      // Too long (more than 15 digits)
      expect(isValidPhoneNumber('1234567890123456')).toBe(false);
    });

    test('should reject empty or non-numeric input', () => {
      expect(isValidPhoneNumber('')).toBe(false);
      expect(isValidPhoneNumber('  ')).toBe(false);
      expect(isValidPhoneNumber(null)).toBe(false);
      expect(isValidPhoneNumber(undefined)).toBe(false);
    });
  });
});

describe('Phone number formatting with retry logic', () => {
  test('should retry formatting on simulated network failure', async () => {
    // Mock a function that might fail
    let attempts = 0;
    const mockFormatPhoneNumber = jest.fn().mockImplementation(() => {
      if (attempts++ < 1) {
        throw new Error('Network error');
      }
      return '447123456789';
    });

    // Use retry logic with mock function
    const formatWithRetry = async (phoneNumber: string) => {
      return await retryWithBackoff(() => Promise.resolve(mockFormatPhoneNumber(phoneNumber)));
    };

    // The function should succeed on the second attempt
    const result = await formatWithRetry('+447123456789');
    expect(result).toBe('447123456789');
    expect(mockFormatPhoneNumber).toHaveBeenCalledTimes(2);
  });

  test('should throw after max retries', async () => {
    // Mock a function that always fails
    const mockFormatPhoneNumber = jest.fn().mockImplementation(() => {
      throw new Error('Persistent error');
    });

    // Use retry logic with mock function
    const formatWithRetry = async (phoneNumber: string) => {
      return await retryWithBackoff(() => Promise.resolve(mockFormatPhoneNumber(phoneNumber)));
    };

    // The function should fail after max retries
    await expect(formatWithRetry('+447123456789')).rejects.toThrow('Persistent error');
    expect(mockFormatPhoneNumber).toHaveBeenCalledTimes(3); // Default is 3 retries
  });
});

describe('E.164 Compliance Tests', () => {
  test('should format numbers to comply with E.164 standard', () => {
    // E.164 requires:
    // - No plus prefix in the output
    // - Maximum 15 digits
    // - Country code followed by subscriber number
    // - No spaces or special characters

    // Test different number formats
    const testCases = [
      { input: '+447123456789', expected: '447123456789', description: 'UK with plus' },
      { input: '07123456789', expected: '447123456789', description: 'UK with leading zero' },
      { input: '+48 123-456-789', expected: '48123456789', description: 'Poland with formatting' },
      { input: '+1 (555) 123-4567', expected: '15551234567', description: 'US number' },
      { input: '123456789012345678', expected: '123456789012345', description: 'Number exceeding max length' }
    ];

    for (const { input, expected, description } of testCases) {
      const formatted = formatPhoneNumber(input);
      expect(formatted).toBe(expected);

      // Check Infobip E.164 format requirements
      expect(formatted).not.toMatch(/\+/); // No plus sign
      expect(formatted).not.toMatch(/\D/); // Only digits
      expect(formatted.length).toBeLessThanOrEqual(15); // Max 15 digits
    }
  });

  test('should validate common international number formats', () => {
    // Test various international formats to ensure they're considered valid
    const validNumbers = [
      '+447123456789', // UK
      '+48123456789',  // Poland
      '+15551234567',  // US
      '+61412345678',  // Australia
      '+33612345678',  // France
      '+491234567890', // Germany
      '+819012345678', // Japan
    ];

    for (const number of validNumbers) {
      expect(isValidPhoneNumber(number)).toBe(true);
    }
  });
});