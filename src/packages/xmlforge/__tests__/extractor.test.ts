import {
  extractBrand,
  extractPhoneNumber,
  extractMessage,
  extractOrderId,
  extractBrandName,
  extractChannel,
  extractChannelName,
  extractCreationDateTime,
  extractActionExpression
} from '../utils/extractor.js';
import { AtgSoapXml } from '../types.js';

describe('XML Extractors', () => {
  describe('extractBrand', () => {
    it('should extract brand from string format', () => {
      const xml = {
        'SOAP-ENV:Envelope': {
          'SOAP-ENV:Body': [{
            ProcessCommunication: [{
              DataArea: [{
                Communication: [{
                  CommunicationHeader: [{
                    BrandChannel: [{
                      Brand: [{
                        'oa:Code': ['SimpleStore']
                      }]
                    }]
                  }]
                }]
              }]
            }]
          }]
        }
      } as unknown as AtgSoapXml;

      expect(extractBrand(xml)).toBe('SimpleStore');
    });

    it('should extract brand from object with name attribute', () => {
      const xml = {
        'SOAP-ENV:Envelope': {
          'SOAP-ENV:Body': [{
            ProcessCommunication: [{
              DataArea: [{
                Communication: [{
                  CommunicationHeader: [{
                    BrandChannel: [{
                      Brand: [{
                        'oa:Code': [{
                          $: { name: 'ComplexStore' },
                          _: 'SomeOtherValue'
                        }]
                      }]
                    }]
                  }]
                }]
              }]
            }]
          }]
        }
      } as unknown as AtgSoapXml;

      expect(extractBrand(xml)).toBe('ComplexStore');
    });

    it('should return "Unknown" for missing brand', () => {
      const xml = {
        'SOAP-ENV:Envelope': {
          'SOAP-ENV:Body': [{}]
        }
      } as unknown as AtgSoapXml;

      expect(extractBrand(xml)).toBe('Unknown');
    });
  });

  describe('extractBrandName', () => {
    it('should extract brand name attribute', () => {
      const xml = {
        'SOAP-ENV:Envelope': {
          'SOAP-ENV:Body': [{
            ProcessCommunication: [{
              DataArea: [{
                Communication: [{
                  CommunicationHeader: [{
                    BrandChannel: [{
                      Brand: [{
                        'oa:Code': [{
                          $: { name: 'B&Q' }
                        }]
                      }]
                    }]
                  }]
                }]
              }]
            }]
          }]
        }
      } as unknown as AtgSoapXml;

      expect(extractBrandName(xml)).toBe('B&Q');
    });

    it('should return undefined for missing brand name', () => {
      const xml = {
        'SOAP-ENV:Envelope': {
          'SOAP-ENV:Body': [{}]
        }
      } as unknown as AtgSoapXml;

      expect(extractBrandName(xml)).toBeUndefined();
    });
  });

  describe('extractChannel', () => {
    it('should extract channel code', () => {
      const xml = {
        'SOAP-ENV:Envelope': {
          'SOAP-ENV:Body': [{
            ProcessCommunication: [{
              DataArea: [{
                Communication: [{
                  CommunicationHeader: [{
                    BrandChannel: [{
                      Channel: [{
                        'oa:Code': ['WEB']
                      }]
                    }]
                  }]
                }]
              }]
            }]
          }]
        }
      } as unknown as AtgSoapXml;

      expect(extractChannel(xml)).toBe('WEB');
    });

    it('should extract channel from object with name attribute', () => {
      const xml = {
        'SOAP-ENV:Envelope': {
          'SOAP-ENV:Body': [{
            ProcessCommunication: [{
              DataArea: [{
                Communication: [{
                  CommunicationHeader: [{
                    BrandChannel: [{
                      Channel: [{
                        'oa:Code': [{
                          $: { name: 'Web' },
                          _: 'WEB'
                        }]
                      }]
                    }]
                  }]
                }]
              }]
            }]
          }]
        }
      } as unknown as AtgSoapXml;

      expect(extractChannel(xml)).toBe('WEB');
    });

    it('should return undefined for missing channel', () => {
      const xml = {
        'SOAP-ENV:Envelope': {
          'SOAP-ENV:Body': [{}]
        }
      } as unknown as AtgSoapXml;

      expect(extractChannel(xml)).toBeUndefined();
    });
  });

  describe('extractChannelName', () => {
    it('should extract channel name attribute', () => {
      const xml = {
        'SOAP-ENV:Envelope': {
          'SOAP-ENV:Body': [{
            ProcessCommunication: [{
              DataArea: [{
                Communication: [{
                  CommunicationHeader: [{
                    BrandChannel: [{
                      Channel: [{
                        'oa:Code': [{
                          $: { name: 'Web' }
                        }]
                      }]
                    }]
                  }]
                }]
              }]
            }]
          }]
        }
      } as unknown as AtgSoapXml;

      expect(extractChannelName(xml)).toBe('Web');
    });

    it('should return undefined for missing channel name', () => {
      const xml = {
        'SOAP-ENV:Envelope': {
          'SOAP-ENV:Body': [{}]
        }
      } as unknown as AtgSoapXml;

      expect(extractChannelName(xml)).toBeUndefined();
    });
  });

  describe('extractPhoneNumber', () => {
    it('should extract valid phone number', () => {
      const xml = {
        'SOAP-ENV:Envelope': {
          'SOAP-ENV:Body': [{
            ProcessCommunication: [{
              DataArea: [{
                Communication: [{
                  CommunicationHeader: [{
                    CustomerParty: [{
                      Contact: [{
                        SMSTelephoneCommunication: [{
                          'oa:FormattedNumber': ['+1234567890']
                        }]
                      }]
                    }]
                  }]
                }]
              }]
            }]
          }]
        }
      } as unknown as AtgSoapXml;

      expect(extractPhoneNumber(xml)).toBe('+1234567890');
    });

    it('should return empty string for missing phone', () => {
      const xml = {
        'SOAP-ENV:Envelope': {
          'SOAP-ENV:Body': [{}]
        }
      } as unknown as AtgSoapXml;

      expect(extractPhoneNumber(xml)).toBe('');
    });
  });

  describe('extractMessage', () => {
    it('should extract valid message', () => {
      const xml = {
        'SOAP-ENV:Envelope': {
          'SOAP-ENV:Body': [{
            ProcessCommunication: [{
              DataArea: [{
                Communication: [{
                  CommunicationItem: [{
                    'oa:Message': [{
                      'oa:Note': ['Test message']
                    }]
                  }]
                }]
              }]
            }]
          }]
        }
      } as unknown as AtgSoapXml;

      expect(extractMessage(xml)).toBe('Test message');
    });

    it('should return empty string for missing message', () => {
      const xml = {
        'SOAP-ENV:Envelope': {
          'SOAP-ENV:Body': [{}]
        }
      } as unknown as AtgSoapXml;

      expect(extractMessage(xml)).toBe('');
    });
  });

  describe('extractOrderId', () => {
    it('should extract valid order ID', () => {
      const xml = {
        'SOAP-ENV:Envelope': {
          'SOAP-ENV:Body': [{
            ProcessCommunication: [{
              'oa:ApplicationArea': [{
                'oa:BODID': ['ORDER123']
              }]
            }]
          }]
        }
      } as unknown as AtgSoapXml;

      expect(extractOrderId(xml)).toBe('ORDER123');
    });

    it('should return undefined for missing order ID', () => {
      const xml = {
        'SOAP-ENV:Envelope': {
          'SOAP-ENV:Body': [{}]
        }
      } as unknown as AtgSoapXml;

      expect(extractOrderId(xml)).toBeUndefined();
    });

    it('should return undefined for empty order ID', () => {
      const xml = {
        'SOAP-ENV:Envelope': {
          'SOAP-ENV:Body': [{
            ProcessCommunication: [{
              'oa:ApplicationArea': [{
                'oa:BODID': ['']
              }]
            }]
          }]
        }
      } as unknown as AtgSoapXml;

      expect(extractOrderId(xml)).toBeUndefined();
    });
  });

  describe('extractCreationDateTime', () => {
    it('should extract valid creation date time', () => {
      const xml = {
        'SOAP-ENV:Envelope': {
          'SOAP-ENV:Body': [{
            ProcessCommunication: [{
              'oa:ApplicationArea': [{
                'oa:CreationDateTime': ['2023-03-22T15:30:45.123Z']
              }]
            }]
          }]
        }
      } as unknown as AtgSoapXml;

      expect(extractCreationDateTime(xml)).toBe('2023-03-22T15:30:45.123Z');
    });

    it('should return undefined for missing creation date time', () => {
      const xml = {
        'SOAP-ENV:Envelope': {
          'SOAP-ENV:Body': [{}]
        }
      } as unknown as AtgSoapXml;

      expect(extractCreationDateTime(xml)).toBeUndefined();
    });
  });

  describe('extractActionExpression', () => {
    it('should extract valid action expression', () => {
      const xml = {
        'SOAP-ENV:Envelope': {
          'SOAP-ENV:Body': [{
            ProcessCommunication: [{
              DataArea: [{
                'oa:Process': [{
                  'oa:ActionCriteria': [{
                    'oa:ActionExpression': ['SMS']
                  }]
                }]
              }]
            }]
          }]
        }
      } as unknown as AtgSoapXml;

      expect(extractActionExpression(xml)).toBe('SMS');
    });

    it('should return undefined for missing action expression', () => {
      const xml = {
        'SOAP-ENV:Envelope': {
          'SOAP-ENV:Body': [{}]
        }
      } as unknown as AtgSoapXml;

      expect(extractActionExpression(xml)).toBeUndefined();
    });
  });
});