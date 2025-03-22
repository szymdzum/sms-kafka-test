import { extractSmsData, SmsDataValidationError } from '../parser.js';
import { parseStringPromise } from 'xml2js';

describe('SMS Parser', () => {
  const validSoapXml = `
    <SOAP-ENV:Envelope>
      <SOAP-ENV:Body>
        <ProcessCommunication>
          <oa:ApplicationArea>
            <oa:CreationDateTime>2023-03-22T15:30:45.123Z</oa:CreationDateTime>
            <oa:BODID>TEST456</oa:BODID>
          </oa:ApplicationArea>
          <DataArea>
            <oa:Process>
              <oa:ActionCriteria>
                <oa:ActionExpression>SMS</oa:ActionExpression>
              </oa:ActionCriteria>
            </oa:Process>
            <Communication>
              <CommunicationHeader>
                <CustomerParty>
                  <Contact>
                    <SMSTelephoneCommunication>
                      <oa:FormattedNumber>+1234567890</oa:FormattedNumber>
                    </SMSTelephoneCommunication>
                  </Contact>
                </CustomerParty>
                <BrandChannel>
                  <Brand>
                    <oa:Code name="MyStore">MyStore</oa:Code>
                  </Brand>
                  <Channel>
                    <oa:Code name="Web">WEB</oa:Code>
                  </Channel>
                </BrandChannel>
              </CommunicationHeader>
              <CommunicationItem>
                <oa:Message>
                  <oa:Note>Your order has been shipped</oa:Note>
                </oa:Message>
              </CommunicationItem>
            </Communication>
          </DataArea>
        </ProcessCommunication>
      </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>
  `;

  it('should successfully parse valid SOAP XML with all fields', async () => {
    const result = await extractSmsData(validSoapXml);

    expect(result).toEqual({
      phoneNumber: '+1234567890',
      message: 'Your order has been shipped',
      brand: 'MyStore',
      brandName: 'MyStore',
      channel: 'WEB',
      channelName: 'Web',
      orderId: 'TEST456',
      creationDateTime: '2023-03-22T15:30:45.123Z',
      actionExpression: 'SMS'
    });
  });

  it('should handle missing optional fields', async () => {
    const xmlWithoutOptionalFields = `
      <SOAP-ENV:Envelope>
        <SOAP-ENV:Body>
          <ProcessCommunication>
            <DataArea>
              <Communication>
                <CommunicationHeader>
                  <CustomerParty>
                    <Contact>
                      <SMSTelephoneCommunication>
                        <oa:FormattedNumber>+1234567890</oa:FormattedNumber>
                      </SMSTelephoneCommunication>
                    </Contact>
                  </CustomerParty>
                  <BrandChannel>
                    <Brand>
                      <oa:Code>MyStore</oa:Code>
                    </Brand>
                  </BrandChannel>
                </CommunicationHeader>
                <CommunicationItem>
                  <oa:Message>
                    <oa:Note>Your order has been shipped</oa:Note>
                  </oa:Message>
                </CommunicationItem>
              </Communication>
            </DataArea>
          </ProcessCommunication>
        </SOAP-ENV:Body>
      </SOAP-ENV:Envelope>
    `;

    const result = await extractSmsData(xmlWithoutOptionalFields);

    expect(result.phoneNumber).toBe('+1234567890');
    expect(result.message).toBe('Your order has been shipped');
    expect(result.brand).toBe('MyStore');
    expect(result.orderId).toBeUndefined();
    expect(result.brandName).toBeUndefined();
    expect(result.channel).toBeUndefined();
    expect(result.channelName).toBeUndefined();
    expect(result.creationDateTime).toBeUndefined();
    expect(result.actionExpression).toBeUndefined();
  });

  it('should throw error for invalid XML', async () => {
    const invalidXml = 'invalid xml';
    await expect(extractSmsData(invalidXml)).rejects.toThrow();
  });

  it('should throw error for missing required fields', async () => {
    const xmlWithoutPhone = validSoapXml.replace(
      '<oa:FormattedNumber>+1234567890</oa:FormattedNumber>',
      ''
    );

    await expect(extractSmsData(xmlWithoutPhone)).rejects.toThrow(SmsDataValidationError);
    await expect(extractSmsData(xmlWithoutPhone)).rejects.toThrow('Missing required SMS data fields');
  });

  it('should handle channel variations', async () => {
    // Test with different channel format
    const xmlWithChannelVariation = validSoapXml.replace(
      '<oa:Code name="Web">WEB</oa:Code>',
      '<oa:Code name="Mobile App">MOB</oa:Code>'
    );

    const resultChannel = await extractSmsData(xmlWithChannelVariation);
    expect(resultChannel.channel).toBe('MOB');
    expect(resultChannel.channelName).toBe('Mobile App');
  });
});