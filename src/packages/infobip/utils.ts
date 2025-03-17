/**
 * Utility functions for the Infobip package
 */

/**
 * Country code mapping for common countries
 */
interface CountryCodeMap {
  [key: string]: {
    code: string;
    lengths: number[];
  };
}

/**
 * Mapping of country codes and their expected phone number lengths
 * Used for validating and formatting phone numbers
 */
const COUNTRY_CODES: CountryCodeMap = {
  'UK': { code: '44', lengths: [10] },     // UK (without leading 0)
  'PL': { code: '48', lengths: [9] },      // Poland (without leading 0)
  // Add more countries as needed
};

/**
 * Formats a phone number to E.164 international format as required by Infobip
 *
 * The E.164 standard specifies:
 * - Maximum 15 digits
 * - Country code followed by subscriber number
 * - No special characters or spaces
 * - No plus (+) prefix
 *
 * @param phoneNumber - The phone number to format
 * @returns Formatted phone number in E.164 format
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove any non-digit characters including the + prefix
  let cleaned = phoneNumber.replace(/\D/g, '');

  // Check if number already starts with a country code
  if (
    (cleaned.startsWith('44') && cleaned.length === 12) || // UK
    (cleaned.startsWith('48') && cleaned.length === 11) // Poland
  ) {
    // Number already appears to be in E.164 format
    return cleaned;
  }

  // UK number formatting (0 + 10 digits)
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return '44' + cleaned.substring(1);
  }

  // Poland number formatting (0 + 9 digits)
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return '48' + cleaned.substring(1);
  }

  // Ensure number doesn't exceed E.164 maximum length (15 digits)
  if (cleaned.length > 15) {
    cleaned = cleaned.substring(0, 15);
  }

  return cleaned;
}

/**
 * Validate if a phone number is properly formatted according to E.164
 *
 * @param phoneNumber - The phone number to validate
 * @returns Boolean indicating if the number is valid
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  const formatted = formatPhoneNumber(phoneNumber);

  // E.164 requires at least a country code + local number (minimum 7 digits total)
  // And maximum 15 digits
  if (formatted.length < 7 || formatted.length > 15) {
    return false;
  }

  // Check if number starts with a valid country code
  for (const country of Object.values(COUNTRY_CODES)) {
    if (formatted.startsWith(country.code)) {
      const localNumberLength = formatted.length - country.code.length;
      if (country.lengths.includes(localNumberLength)) {
        return true;
      }
    }
  }

  // If we can't definitively validate, assume it's valid if it has a reasonable length
  return formatted.length >= 10 && formatted.length <= 15;
}