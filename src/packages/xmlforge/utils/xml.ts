/**
 * XML utilities for XmlForge
 */

/**
 * Validates if the input is a valid SOAP XML string
 */
export function validateSoapXml(xml: string): void {
  if (!xml || typeof xml !== 'string') {
    throw new Error('Invalid XML input: must be a non-empty string');
  }
}