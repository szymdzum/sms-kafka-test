import { parseStringPromise } from 'xml2js';

/**
 * Converts a SOAP XML string to a JSON object.
 * Strips the SOAP envelope and extracts the body content.
 */
export async function soapXmlToJson(soapXml: string): Promise<any> {
  try {
    // Parse the XML string to a JavaScript object
    const fullJson = await parseStringPromise(soapXml, { explicitArray: false });
    console.log("Raw SOAP parsed JSON:", JSON.stringify(fullJson));

    // Navigate to the SOAP Body (adjust keys based on namespace prefixes)
    const envelope = fullJson['SOAP-ENV:Envelope'] || fullJson['soap:Envelope'] || fullJson['Envelope'];
    const body = envelope?.['SOAP-ENV:Body'] || envelope?.['soap:Body'] || envelope?.['Body'];
    if (!body) {
      throw new Error("SOAP Body not found in message");
    }

    // Extract the first element inside the Body as the actual payload
    const keys = Object.keys(body);
    if (keys.length === 0) {
      throw new Error("Empty SOAP Body");
    }
    const firstKey = keys[0] as string;
    const payload = body[firstKey];
    console.log("Extracted SOAP payload:", JSON.stringify(payload));
    return payload;  // return the relevant payload as JSON
  } catch (err) {
    console.error("SOAP to JSON conversion failed:", err);
    throw err;  // let the caller handle the error (e.g., trigger DLQ if unrecoverable)
  }
}

// Example of extracting SMS details from the SOAP payload
export interface SmsDetails {
  phoneNumber: string;
  message: string;
  bodId: string;
  brandCode: string;
  channelCode: string;
  actionCode?: string;
}

export function extractSmsDetails(payload: any): SmsDetails | null {
  try {
    // Get the application area for BODID
    const appArea = payload['oa:ApplicationArea'];
    const bodId = appArea?.['oa:BODID'];

    // Get the data area
    const dataArea = payload.DataArea;

    // Get action code (SMS)
    const actionCode = dataArea?.['oa:Process']?.['oa:ActionCriteria']?.['oa:ActionExpression']?._;

    // Get communication details
    const communication = dataArea?.Communication;

    // Extract phone number
    const phoneNumber = communication?.CommunicationHeader?.CustomerParty?.Contact?.SMSTelephoneCommunication?.['oa:FormattedNumber'];

    // Extract brand and channel
    const brandCode = communication?.CommunicationHeader?.BrandChannel?.Brand?.['oa:Code']?._;
    const channelCode = communication?.CommunicationHeader?.BrandChannel?.Channel?.['oa:Code']?._;

    // Extract message text
    const message = communication?.CommunicationItem?.['oa:Message']?.['oa:Note'];

    if (!phoneNumber || !message || !bodId) {
      console.error("Required SMS fields not found in payload", {
        hasPhoneNumber: !!phoneNumber,
        hasMessage: !!message,
        hasBodId: !!bodId
      });
      return null;
    }

    return {
      phoneNumber,
      message,
      bodId,
      brandCode: brandCode || '',
      channelCode: channelCode || '',
      actionCode: actionCode || ''
    };
  } catch (error) {
    console.error("Error extracting SMS details:", error);
    return null;
  }
}

// Example usage
export async function processSoapMessage(soapXml: string) {
  try {
    // First, convert SOAP to JSON
    const payload = await soapXmlToJson(soapXml);

    // Then extract the SMS details
    const smsDetails = extractSmsDetails(payload);

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
