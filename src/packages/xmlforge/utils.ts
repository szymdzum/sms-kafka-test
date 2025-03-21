/**
 * Generic XML utilities for the XmlForge package
 */

import { AtgSoapXml } from './types.js';
import { XmlPath } from './config.js';

/**
 * Safely get value from XML using path
 */
export function getXmlValue<T>(xml: AtgSoapXml, path: readonly XmlPath[], defaultValue: T = '' as T): T {
  try {
    const value = path.reduce((acc, key) => acc?.[key], xml as any);
    return value || defaultValue;
  } catch (error) {
    return defaultValue;
  }
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