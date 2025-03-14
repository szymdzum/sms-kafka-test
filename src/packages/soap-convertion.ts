import { parseStringPromise } from 'xml2js';

export interface SmsDetails {
  phoneNumber: string;
  message: string;
  bodId: string;
  brandCode: string;
  brandName?: string | undefined;
  channelCode: string;
  channelName?: string | undefined;
  actionCode?: string | undefined;
  creationDateTime?: string | undefined;
}

// Type for XML parsing options
interface XmlParseOptions {
  explicitArray?: boolean;
  ignoreAttrs?: boolean;
  mergeAttrs?: boolean;
  normalizeTags?: boolean;
}

/**
 * Directly parses a SOAP XML message to extract SMS details
 * @param xmlString The SOAP XML string to parse
 * @returns SmsDetails object or null if parsing fails
 */
export async function soapXmlToJson(xmlString: string): Promise<SmsDetails | null> {
  try {
    // Configure XML parsing options
    const options: XmlParseOptions = {
      explicitArray: false,
      ignoreAttrs: false,
      mergeAttrs: true
    };

    // Parse XML to JS object
    const result = await parseStringPromise(xmlString, options);

    // Navigate through SOAP structure
    const envelope = result['SOAP-ENV:Envelope'] || result['soap:Envelope'] || result.Envelope;
    if (!envelope) throw new Error('SOAP Envelope not found');

    const body = envelope['SOAP-ENV:Body'] || envelope['soap:Body'] || envelope.Body;
    if (!body) throw new Error('SOAP Body not found');

    const processCommunication = body.ProcessCommunication;
    if (!processCommunication) throw new Error('ProcessCommunication not found');

    // Extract application area details
    const appArea = processCommunication['oa:ApplicationArea'];
    const bodId = appArea?.['oa:BODID'];
    const creationDateTime = appArea?.['oa:CreationDateTime'];

    // Extract data area details
    const dataArea = processCommunication.DataArea;
    if (!dataArea) throw new Error('DataArea not found');

    // Extract process details
    const process = dataArea['oa:Process'];
    const actionCriteria = process?.['oa:ActionCriteria'];
    const actionExpression = actionCriteria?.['oa:ActionExpression'];
    const actionCode = typeof actionExpression === 'string'
      ? actionExpression
      : actionExpression?._ || actionExpression?.text;

    // Extract communication details
    const communication = dataArea.Communication;
    if (!communication) throw new Error('Communication not found');

    // Extract header details
    const header = communication.CommunicationHeader;
    if (!header) throw new Error('CommunicationHeader not found');

    // Extract customer details
    const customerParty = header.CustomerParty;
    const contact = customerParty?.Contact;
    const smsTelephone = contact?.SMSTelephoneCommunication;
    const phoneNumber = smsTelephone?.['oa:FormattedNumber'];

    // Extract brand and channel
    const brandChannel = header.BrandChannel;
    const brand = brandChannel?.Brand;
    const brandCode = typeof brand?.['oa:Code'] === 'string'
      ? brand['oa:Code']
      : brand?.['oa:Code']?._;
    const brandName = brand?.['oa:Code']?.name;

    const channel = brandChannel?.Channel;
    const channelCode = typeof channel?.['oa:Code'] === 'string'
      ? channel['oa:Code']
      : channel?.['oa:Code']?._;
    const channelName = channel?.['oa:Code']?.name;

    // Extract message
    const communicationItem = communication.CommunicationItem;
    const messageObj = communicationItem?.['oa:Message'];
    const message = messageObj?.['oa:Note'];

    // Validate required fields
    if (!phoneNumber || !message || !bodId) {
      console.error('Missing required SMS fields', {
        hasPhoneNumber: !!phoneNumber,
        hasMessage: !!message,
        hasBodId: !!bodId
      });
      return null;
    }

    // Return structured SMS details
    return {
      phoneNumber,
      message,
      bodId,
      brandCode: brandCode || '',
      brandName: brandName || undefined,
      channelCode: channelCode || '',
      channelName: channelName || undefined,
      actionCode: actionCode || undefined,
      creationDateTime: creationDateTime || undefined
    };
  } catch (error) {
    console.error('Failed to parse SOAP XML to SMS details:', error);
    return null;
  }
}

/**
 * Test function to validate XML parsing with a sample XML string
 */
export async function testSoapParsing(xmlString: string): Promise<void> {
  try {
    const smsDetails = await soapXmlToJson(xmlString);
    console.log('Parsed SMS Details:', smsDetails);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Example usage
export async function processSoapMessage(soapXml: string) {
  try {
    // First, convert SOAP to JSON
    const payload = await soapXmlToJson(soapXml);

    // Then extract the SMS details
    const smsDetails = await soapXmlToJson(soapXml);

    if (!smsDetails) {
      throw new Error("Failed to extract required SMS details from payload");
    }

    console.log("Extracted SMS Details:", {
      bodId: smsDetails.bodId,
      phoneNumber: smsDetails.phoneNumber,
      message: smsDetails.message,
      brand: smsDetails.brandCode,
      channel: smsDetails.channelCode,
      action: smsDetails.actionCode
    });

    // Here you would call your SMS sending function
    // Example: await sendSmsSDK(smsDetails.phoneNumber, smsDetails.message);

    return smsDetails;
  } catch (error) {
    console.error("Failed to process SOAP message:", error);
    throw error;
  }
}

// Test function with the example XML
export async function testWithExampleXml(xmlString: string) {
  try {
    const result = await processSoapMessage(xmlString);
    console.log("Successfully processed SOAP message");
    return result;
  } catch (error) {
    console.error("Test failed:", error);
    throw error;
  }
}
