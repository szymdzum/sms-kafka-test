import { extractSmsData } from '../parser.js';

describe('SMS Parser', () => {
  const validSoapXml = `
    <SOAP-ENV:Envelope>
      <SOAP-ENV:Body>
        <ProcessCommunication>
          <oa:ApplicationArea>
            <oa:BODID>ORDER123</oa:BODID>
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
                <BrandChannel>
                  <Brand>
                    <oa:Code name="MyStore">MyStore</oa:Code>
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

  it('should successfully parse valid SOAP XML', async () => {
    const result = await extractSmsData(validSoapXml);

    expect(result).toEqual({
      phoneNumber: '+1234567890',
      message: 'Your order has been shipped',
      brand: 'MyStore',
      orderId: 'ORDER123'
    });
  });

  it('should handle missing optional orderId', async () => {
    const xmlWithoutOrderId = validSoapXml.replace('<oa:BODID>ORDER123</oa:BODID>', '');
    const result = await extractSmsData(xmlWithoutOrderId);

    expect(result.orderId).toBeUndefined();
    expect(result.phoneNumber).toBeDefined();
    expect(result.message).toBeDefined();
    expect(result.brand).toBeDefined();
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

    await expect(extractSmsData(xmlWithoutPhone)).rejects.toThrow('Missing required fields');
  });

  it('should handle brand as string or object', async () => {
    // Test with brand as string
    const result1 = await extractSmsData(validSoapXml);
    expect(result1.brand).toBe('MyStore');

    // Test with brand as object
    const xmlWithBrandObject = validSoapXml.replace(
      '<oa:Code name="MyStore">MyStore</oa:Code>',
      '<oa:Code name="DifferentBrand">DifferentBrand</oa:Code>'
    );
    const result2 = await extractSmsData(xmlWithBrandObject);
    expect(result2.brand).toBe('DifferentBrand');
  });
});