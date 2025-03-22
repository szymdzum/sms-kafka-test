import { extractSmsData, SmsDataValidationError } from '../parser.js';
import { getXmlValue, clearXmlCache, XML_PARSE_OPTIONS } from '../utils/xml.js';
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

describe('XML Path Memoization', () => {
  // Simplified XML structure for testing
  const mockXml = {
    'SOAP-ENV:Envelope': {
      'SOAP-ENV:Body': [{
        ProcessCommunication: [{
          DataArea: [{
            Communication: [{
              CommunicationHeader: [{
                CustomerParty: [{
                  Contact: [{
                    testValue: 'test-value'
                  }]
                }],
                BrandChannel: [{
                  items: [1, 2, 3]
                }]
              }]
            }]
          }]
        }]
      }]
    }
  };

  beforeEach(() => {
    // Clear the cache before each test
    clearXmlCache();
  });

  it('should correctly memoize XML path resolution', () => {
    // Access the same path multiple times
    const path = ['SOAP-ENV:Envelope', 'SOAP-ENV:Body', 0, 'ProcessCommunication', 0, 'DataArea', 0, 'Communication', 0, 'CommunicationHeader', 0, 'CustomerParty', 0, 'Contact', 0, 'testValue'];

    // First access should cache the result
    const result1 = getXmlValue(mockXml, path);
    expect(result1).toBe('test-value');

    // Second access should use the cached result
    const result2 = getXmlValue(mockXml, path);
    expect(result2).toBe('test-value');

    // Verify the results are identical (reference equality if objects)
    expect(result1).toBe(result2);
  });

  it('should handle multiple different paths correctly', () => {
    const path1 = ['SOAP-ENV:Envelope', 'SOAP-ENV:Body', 0, 'ProcessCommunication', 0, 'DataArea', 0, 'Communication', 0, 'CommunicationHeader', 0, 'CustomerParty', 0, 'Contact', 0, 'testValue'];
    const path2 = ['SOAP-ENV:Envelope', 'SOAP-ENV:Body', 0, 'ProcessCommunication', 0, 'DataArea', 0, 'Communication', 0, 'CommunicationHeader', 0, 'BrandChannel', 0, 'items'];

    // Access different paths
    const result1 = getXmlValue(mockXml, path1);
    const result2 = getXmlValue(mockXml, path2);

    expect(result1).toBe('test-value');
    expect(Array.isArray(result2)).toBe(true);

    // Access the same paths again
    const result1b = getXmlValue(mockXml, path1);
    const result2b = getXmlValue(mockXml, path2);

    expect(result1b).toBe('test-value');
    expect(Array.isArray(result2b)).toBe(true);
  });

  it('should clear the cache when requested', () => {
    const path = ['SOAP-ENV:Envelope', 'SOAP-ENV:Body', 0, 'ProcessCommunication', 0, 'DataArea', 0, 'Communication', 0, 'CommunicationHeader', 0, 'CustomerParty', 0, 'Contact', 0, 'testValue'];

    // First access
    const result1 = getXmlValue(mockXml, path);

    // Clear cache
    clearXmlCache();

    // Access again after clearing cache
    const result2 = getXmlValue(mockXml, path);

    // Results should still be equal in value
    expect(result1).toBe(result2);
  });

  it('should handle invalid paths gracefully', () => {
    const invalidPath = ['SOAP-ENV:Envelope', 'SOAP-ENV:Body', 0, 'NonExistent', 'Path'];
    const defaultValue = 'default';

    // Access invalid path
    const result = getXmlValue(mockXml, invalidPath, defaultValue);

    // Should return the default value
    expect(result).toBe(defaultValue);

    // Access again
    const result2 = getXmlValue(mockXml, invalidPath, defaultValue);

    // Should still return the default value
    expect(result2).toBe(defaultValue);
  });

  it('should work with real SOAP XML data', async () => {
    const testXml = `
      <SOAP-ENV:Envelope>
        <SOAP-ENV:Body>
          <ProcessCommunication>
            <oa:ApplicationArea>
              <oa:CreationDateTime>2023-03-22T15:30:45.123Z</oa:CreationDateTime>
              <oa:BODID>TEST123</oa:BODID>
            </oa:ApplicationArea>
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
                </CommunicationHeader>
              </Communication>
            </DataArea>
          </ProcessCommunication>
        </SOAP-ENV:Body>
      </SOAP-ENV:Envelope>
    `;

    const parsedXml = await parseStringPromise(testXml, XML_PARSE_OPTIONS);

    // Clear cache before test
    clearXmlCache();

    // Define a test path
    const path = ['SOAP-ENV:Envelope', 'SOAP-ENV:Body', 0, 'ProcessCommunication', 0, 'DataArea', 0, 'Communication', 0, 'CommunicationHeader', 0, 'CustomerParty', 0, 'Contact', 0, 'SMSTelephoneCommunication', 0, 'oa:FormattedNumber', 0];

    // Track performance
    const start1 = performance.now();
    const result1 = getXmlValue(parsedXml, path);
    const duration1 = performance.now() - start1;

    const start2 = performance.now();
    const result2 = getXmlValue(parsedXml, path);
    const duration2 = performance.now() - start2;

    // Results should be correct
    expect(result1).toBe('+1234567890');
    expect(result1).toBe(result2);

    // Ensure memoization is working (cache hit should be faster)
    expect(duration2).toBeLessThanOrEqual(duration1);
  });
});