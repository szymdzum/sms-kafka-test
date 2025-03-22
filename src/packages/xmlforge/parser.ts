/**
 * SMS data parser for ATG SOAP XML messages
 */

import { parseStringPromise } from 'xml2js';
import { validateSoapXml } from './utils/xml.js';
import type { SmsData } from './types.js';

/**
 * Error class for SMS data validation failures
 */
export class SmsDataValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SmsDataValidationError';
  }
}

/**
 * Safely access nested properties in an object with proper typing
 */
function safeGet<T>(obj: Record<string, unknown>, path: string[], defaultValue?: T): T | undefined {
  let current: unknown = obj;

  for (const key of path) {
    if (current == null || typeof current !== 'object') {
      return defaultValue;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current as T | undefined;
}

/**
 * Extracts SMS data from ATG SOAP XML.
 * @param {string} soapXml - The SOAP XML message to parse
 * @returns {Promise<SmsData>} - Object containing extracted SMS data
 * @throws {Error} - If XML is invalid or required fields are missing
 */
export async function extractSmsData(soapXml: string): Promise<SmsData> {
  try {
    // Validate input
    validateSoapXml(soapXml);

    // Parse XML to JS object with simplified options
    const parsed = await parseStringPromise(soapXml, {
      explicitArray: false,
      normalize: true,
      trim: true
    });

    // Access the main sections with safeGet
    const body = safeGet<Record<string, unknown>>(parsed, ['SOAP-ENV:Envelope', 'SOAP-ENV:Body']);
    if (!body) {
      throw new Error('Invalid XML structure: Body section not found');
    }

    const procComm = safeGet<Record<string, unknown>>(body, ['ProcessCommunication']);
    if (!procComm) {
      throw new Error('Invalid XML structure: ProcessCommunication section not found');
    }

    const applicationArea = safeGet<Record<string, unknown>>(procComm, ['oa:ApplicationArea']);
    const dataArea = safeGet<Record<string, unknown>>(procComm, ['DataArea']);
    if (!dataArea) {
      throw new Error('Invalid XML structure: DataArea section not found');
    }

    const communication = safeGet<Record<string, unknown>>(dataArea, ['Communication']);
    if (!communication) {
      throw new Error('Invalid XML structure: Communication section not found');
    }

    const communicationHeader = safeGet<Record<string, unknown>>(communication, ['CommunicationHeader']);
    if (!communicationHeader) {
      throw new Error('Invalid XML structure: CommunicationHeader not found');
    }

    const communicationItem = safeGet<Record<string, unknown>>(communication, ['CommunicationItem']);
    if (!communicationItem) {
      throw new Error('Invalid XML structure: CommunicationItem not found');
    }

    // Extract all required data using safeGet
    const phoneNumber = safeGet<string>(communicationHeader, [
      'CustomerParty',
      'Contact',
      'SMSTelephoneCommunication',
      'oa:FormattedNumber'
    ]);

    const message = safeGet<string>(communicationItem, ['oa:Message', 'oa:Note']);

    const brandCodeObj = safeGet<Record<string, unknown>>(communicationHeader, ['BrandChannel', 'Brand', 'oa:Code']);
    const brandCode = brandCodeObj ? safeGet<string>(brandCodeObj, ['_']) || brandCodeObj as unknown as string : undefined;
    const brandName = brandCodeObj ? safeGet<string>(brandCodeObj, ['$', 'name']) : undefined;

    const channelCodeObj = safeGet<Record<string, unknown>>(communicationHeader, ['BrandChannel', 'Channel', 'oa:Code']);
    const channelCode = channelCodeObj ? safeGet<string>(channelCodeObj, ['_']) || channelCodeObj as unknown as string : undefined;
    const channelName = channelCodeObj ? safeGet<string>(channelCodeObj, ['$', 'name']) : undefined;

    const orderId = applicationArea ? safeGet<string>(applicationArea, ['oa:BODID']) : undefined;
    const creationDateTime = applicationArea ? safeGet<string>(applicationArea, ['oa:CreationDateTime']) : undefined;
    const actionExpression = safeGet<string>(dataArea, ['oa:Process', 'oa:ActionCriteria', 'oa:ActionExpression']);

    // Validate required fields
    if (!phoneNumber || !message || !brandCode) {
      throw new SmsDataValidationError('Missing required SMS data fields');
    }

    // Create SMS data object with proper optional field handling
    const smsData: SmsData = {
      phoneNumber,
      message,
      brand: brandName || brandCode,
      ...(brandName && { brandName }),
      ...(channelCode && { channel: channelCode }),
      ...(channelName && { channelName }),
      ...(orderId && { orderId }),
      ...(creationDateTime && { creationDateTime }),
      ...(actionExpression && { actionExpression })
    };

    return smsData;
  } catch (error) {
    if (error instanceof SmsDataValidationError) {
      throw error;
    }
    // Handle unknown error type safely
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error('Failed to extract SMS data from XML: ' + errorMessage);
  }
}
