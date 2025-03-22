/**
 * XML utilities for XmlForge
 */

import type {
  XmlElement,
  ValueValidator,
  GenericXml
} from '../types.js';

export type { GenericXml };

/**
 * Generic string validator
 */
export const isString = (value: unknown): value is string =>
  typeof value === 'string';

/**
 * Memoization cache for XML path resolution
 */
const memoCache = new Map<string, unknown>();

/**
 * Creates a cache key from xml reference and path
 */
function createCacheKey(xml: GenericXml, path: readonly (string | number)[]): string {
  // Create a unique key based on object reference and path
  return `${Object.prototype.toString.call(xml)}_${path.join('.')}`;
}

/**
 * Resolves a path in the XML, with memoization
 */
function resolveXmlPath(xml: GenericXml, path: readonly (string | number)[]): unknown {
  const cacheKey = createCacheKey(xml, path);

  // Check if we have a cached result
  if (memoCache.has(cacheKey)) {
    return memoCache.get(cacheKey);
  }

  // No cached result, traverse the path
  let result: unknown = xml;

  for (const segment of path) {
    if (result === null || result === undefined) {
      return undefined;
    }
    result = (result as Record<string | number | symbol, unknown>)[segment];
  }

  // Cache the result
  memoCache.set(cacheKey, result);
  return result;
}

/**
 * Clears the memoization cache
 */
export function clearXmlCache(): void {
  memoCache.clear();
}

/**
 * Safely get value from XML using path
 * @param xml The XML object to extract from
 * @param path Array of path segments to traverse
 * @param defaultValue Default value to return if path not found
 * @param emptyAsUndefined Whether to return undefined for empty strings
 * @param validator Optional validator function to ensure type safety
 */
export function getXmlValue<T>(
  xml: GenericXml,
  path: readonly (string | number)[],
  defaultValue: T = '' as unknown as T,
  emptyAsUndefined = false,
  validator?: ValueValidator<T>
): T {
  try {
    // Use memoized path resolution
    const result = resolveXmlPath(xml, path);

    // Handle empty values
    if (emptyAsUndefined && (result === '' || result === undefined)) {
      return undefined as unknown as T;
    }

    // Use validator if provided
    if (validator && result !== undefined && result !== null) {
      if (validator(result)) {
        return result;
      }
      return defaultValue;
    }

    return (result !== undefined && result !== null) ? result as T : defaultValue;
  } catch (error) {
    return defaultValue;
  }
}

/**
 * Safely extracts a string value from XML
 * Handles both direct string values and complex objects with attributes
 * @param xml The XML object to extract from
 * @param path Array of path segments to traverse
 * @param textProperty The property to extract if result is an object (defaults to '_')
 */
export function getXmlTextValue(
  xml: GenericXml,
  path: readonly (string | number)[],
  textProperty: 'name' | string = '_'
): string | undefined {
  const value = getXmlValue<unknown>(xml, path, undefined, true);

  if (value === undefined || value === null) {
    return undefined;
  }

  // If it's a string, return it
  if (typeof value === 'string') {
    return value === '' ? undefined : value;
  }

  // If it's an object with the text property
  if (typeof value === 'object' && value !== null) {
    const xmlElement = value as XmlElement;

    // If it has a name attribute and we want to use that
    if (textProperty === 'name' && xmlElement.$ && typeof xmlElement.$.name === 'string') {
      return xmlElement.$.name === '' ? undefined : xmlElement.$.name;
    }

    // Otherwise get the text content
    if (textProperty === '_' && typeof xmlElement._ === 'string') {
      return xmlElement._ === '' ? undefined : xmlElement._;
    } else {
      const textValue = (xmlElement as Record<string, unknown>)[textProperty];
      if (typeof textValue === 'string') {
        return textValue === '' ? undefined : textValue;
      }
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