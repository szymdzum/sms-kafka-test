/**
 * XmlForge Shared Utilities
 *
 * This module contains shared utility functions used by various transformers.
 */

/**
 * Converts keys in an object from snake_case or kebab-case to camelCase
 *
 * @param obj - The object to transform
 * @returns A new object with camelCase keys
 */
export function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      // Convert key to camelCase
      const camelKey = key.replace(/[-_]([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

/**
 * Removes empty, null, or undefined values from an object
 *
 * @param obj - The object to clean
 * @returns A new object with empty values removed
 */
export function removeEmptyValues(obj: any): any {
  if (Array.isArray(obj)) {
    return obj
      .map(v => removeEmptyValues(v))
      .filter(v => v !== null && v !== undefined && v !== '');
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const value = removeEmptyValues(obj[key]);
      if (value !== null && value !== undefined && value !== '') {
        result[key] = value;
      }
      return result;
    }, {} as any);
  }
  return obj;
}

/**
 * Detects if XML is in ATG SOAP format
 *
 * @param xml - XML string to check
 * @returns True if it's an ATG SOAP message
 */
export function isAtgSoapXml(xml: string): boolean {
  return xml.includes('ProcessCommunication') &&
         xml.includes('SOAP-ENV:Envelope') &&
         xml.includes('SOAP-ENV:Body');
}

/**
 * Extracts text from XML nodes, handling different formats
 *
 * @param node - XML node from parsing
 * @returns Extracted text
 */
export function extractTextFromNode(node: any): string {
  if (!node) return '';

  // Handle different XML parser output formats
  if (typeof node === 'string') return node.trim();
  if (node._ && typeof node._ === 'string') return node._.trim();
  if (node[0] && typeof node[0] === 'string') return node[0].trim();

  return '';
}

/**
 * Extracts patterns from text using regex
 *
 * @param text - Text to extract from
 * @param pattern - Regex pattern with at least one capture group
 * @param defaultValue - Default value if no match
 * @returns Extracted text or default value
 */
export function extractPattern(text: string, pattern: RegExp, defaultValue: string = ''): string {
  if (!text) return defaultValue;

  const match = text.match(pattern);
  return (match && match[1]) ? match[1].trim() : defaultValue;
}

// Common regex patterns used across transformers
export const PATTERNS = {
  ORDER_NUMBER: /order\s+([A-Z0-9]+)/i,
  DELIVERY_DATE: /delivery:?\s+([^\.]+)/i,
  STORE_LOCATION: /from\s+([^\.]+)/i
};