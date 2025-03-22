/**
 * Configuration for XMLForge package
 */

/**
 * Required fields for SMS data validation
 */
export const REQUIRED_FIELDS = ['phoneNumber', 'message', 'brandCode'] as const;

/**
 * Default processing options
 */
export const DEFAULT_OPTIONS = {
  removeEmptyValues: true,
  useCamelCase: true
} as const;