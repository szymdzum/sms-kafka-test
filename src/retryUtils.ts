import CircuitBreaker from 'opossum';
import logger from './logger.js';

export function createCircuitBreaker(fn: (...args: any[]) => Promise<any>, name: string) {
  const options = {
    timeout: 5000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000,
  };

  const breaker = new CircuitBreaker(fn, options);

  breaker.on('open', () => {
    logger.warn(`Circuit breaker ${name} opened - too many failures`);
  });

  breaker.on('close', () => {
    logger.info(`Circuit breaker ${name} closed - service is operating normally`);
  });

  return breaker;
}

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  factor?: number;
}

export async function retryWithBackoff(fn: () => Promise<any>, options: RetryOptions = {}) {
  const maxRetries = options.maxRetries || 3;
  const initialDelay = options.initialDelay || 1000;
  const factor = options.factor || 2;

  let attempts = 0;
  let delay = initialDelay;

  while (attempts < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempts++;
      if (attempts >= maxRetries) {
        throw error;
      }

      logger.warn(`Retrying after error (attempt ${attempts}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= factor;
    }
  }
}