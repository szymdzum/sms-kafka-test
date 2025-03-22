/**
 * XML utilities for XmlForge
 */

import { AtgSoapXml } from '../types.js';
import { XmlPath } from '../config.js';

/**
 * Safely get value from XML using path
 * @param xml The XML object to extract from
 * @param path Array of path segments to traverse
 * @param defaultValue Default value to return if path not found
 * @param emptyAsUndefined Whether to return undefined for empty strings
 */
export function getXmlValue<T>(
  xml: AtgSoapXml,
  path: readonly XmlPath[],
  defaultValue: T = '' as T,
  emptyAsUndefined = false
): T {
  try {
    const value = path.reduce((acc, key) => acc?.[key], xml as any);

    // Handle empty values
    if (emptyAsUndefined && (value === '' || value === undefined)) {
      return undefined as unknown as T;
    }

    return value || defaultValue;
  } catch (error) {
    return defaultValue;
  }
}

/**
 * Safely extracts a string or object property from XML
 * Handles both direct string values and complex objects with $ and _
 * @param xml The XML object to extract from
 * @param path Array of path segments to traverse
 * @param textProperty The property to extract if result is an object (defaults to '_')
 */
export function getXmlTextValue(
  xml: AtgSoapXml,
  path: readonly XmlPath[],
  textProperty = '_'
): string | undefined {
  const value = getXmlValue<any>(xml, path, undefined, true);

  if (value === undefined) {
    return undefined;
  }

  // If it's a string, return it
  if (typeof value === 'string') {
    return value === '' ? undefined : value;
  }

  // If it's an object with the text property
  if (typeof value === 'object' && value !== null) {
    // If it has a name attribute and we want to use that
    if (value.$ && value.$.name && textProperty === 'name') {
      return value.$.name;
    }

    // Otherwise get the text content
    if (value[textProperty]) {
      return value[textProperty];
    }
  }

  return undefined;
}

/**
 * XML parsing options for xml2js
 */
export const XML_PARSE_OPTIONS = {
  explicitArray: true,
  mergeAttrs: false,
  tagNameProcessors: [],
  normalize: true,
  trim: true
};

/**
 * Validates if the input is a valid SOAP XML string
 */
export function validateSoapXml(xml: string): void {
  if (!xml || typeof xml !== 'string') {
    throw new Error('Invalid XML input: must be a non-empty string');
  }
}