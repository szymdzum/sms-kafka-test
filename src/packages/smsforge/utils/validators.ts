/**
 * Template utility functions
 */
import { TemplateConfig, TemplateParams, TemplateValidationError, TemplateParameterError } from '../types.js';

/**
 * Validate template configuration
 */
export function validateTemplateConfig(config: TemplateConfig): void {
  if (!config.template) {
    throw new TemplateValidationError('Template string is required');
  }
  if (!Array.isArray(config.requiredParams)) {
    throw new TemplateValidationError('Required parameters must be an array');
  }
}

/**
 * Validate provided parameters
 */
export function validateTemplateParams(params: TemplateParams, requiredParams: string[]): void {
  const missingParams = requiredParams.filter(param => !(param in params));
  if (missingParams.length > 0) {
    throw new TemplateParameterError(
      `Missing required parameters: ${missingParams.join(', ')}`
    );
  }
}

/**
 * Replace parameters in template string
 */
export function replaceTemplateParams(template: string, params: TemplateParams): string {
  return template.replace(/\{(\w+)\}/g, (match: string, key: string): string => {
    const value = params[key];
    return value !== undefined ? String(value) : match;
  });
}