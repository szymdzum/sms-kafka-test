/**
 * Infobip SMS API Types
 * These types represent the structure expected by the Infobip SMS API.
 */

/**
 * Represents a destination for an SMS message.
 */
export interface InfobipDestination {
  /** Phone number to send the message to (required, 0-64 characters) */
  to: string;
  /** Optional message ID for tracking (0-200 characters) */
  messageId?: string;
  /** Optional network ID (int32, available in US and Canada) */
  networkId?: number;
}

/**
 * Text content for an SMS message.
 */
export interface InfobipTextContent {
  /** The text content of the message */
  text: string;
}

/**
 * Represents a single SMS message to be sent.
 */
export interface InfobipMessage {
  /** Sender ID, can be alphanumeric or numeric */
  from: string;
  /** Required array of destinations */
  destinations: InfobipDestination[];
  /** For simple text messages */
  text?: string;
  /** For more complex content */
  content?: InfobipTextContent;
}

/**
 * The complete SMS request payload for the Infobip API.
 */
export interface InfobipSmsRequest {
  /** Message type */
  type: 'text';
  /** Array of messages to send */
  messages: InfobipMessage[];
}