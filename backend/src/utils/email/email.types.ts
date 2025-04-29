/**
 * @file email.types.ts
 * @fileoverview Core type definitions for the Email Provider SDK.
 */

/**
 * Represents an email recipient with optional display name
 */
export interface EmailRecipient {
	/** Optional display name for the recipient */
	name?: string;
	/** Email address of the recipient */
	email: string;
}

/**
 * Represents an email attachment
 */
export interface EmailAttachment {
	/** Filename of the attachment */
	filename: string;
	/** Base64 encoded content of the file */
	content: string;
	/** MIME type of the file */
	mimetype: string;
}

/**
 * Options for sending an email
 */
export interface EmailOptions {
	/** Sender information */
	sender: EmailRecipient;
	/** List of primary recipients */
	recipients: EmailRecipient[];
	/** List of CC recipients */
	cc?: EmailRecipient[];
	/** List of BCC recipients */
	bcc?: EmailRecipient[];
	/** Email subject line */
	subject: string;
	/** Plain text version of the email body */
	textBody?: string;
	/** HTML version of the email body */
	htmlBody?: string;
	/** Additional email headers */
	customHeaders?: Record<string, string>;
	/** File attachments */
	attachments?: EmailAttachment[];
	/** ID of a template to use (if supported by provider) */
	templateId?: string;
	/** Data to populate template variables */
	templateData?: Record<string, any>;
	/** Tags for categorizing emails */
	tags?: string[];
}

/**
 * Response from sending an email
 */
export interface EmailResponse {
	/** Whether the email was successfully sent */
	success: boolean;
	/** Provider-specific message identifier */
	messageId?: string;
	/** List of error messages if any */
	errors?: string[];
	/** Raw provider response for debugging */
	rawResponse?: any;
}

/**
 * Options for retrieving email statistics
 */
export interface EmailStatsOptions {
	/** Start date in YYYY-MM-DD format */
	startDate: string;
	/** End date in YYYY-MM-DD format */
	endDate: string;
	/** Page number for paginated results */
	page?: number;
	/** Number of results per page */
	pageSize?: number;
}

/**
 * Response containing email statistics
 */
export interface EmailStatsResponse {
	/** Number of emails successfully delivered */
	delivered: number;
	/** Number of emails opened */
	opened: number;
	/** Number of links clicked in emails */
	clicked: number;
	/** Number of emails that bounced */
	bounced: number;
	/** Number of emails rejected by the provider */
	rejected: number;
	/** Number of emails marked as spam */
	complained: number;
	/** Number of recipients who unsubscribed */
	unsubscribed: number;
	/** Raw provider response for debugging */
	rawResponse?: any;
}

/**
 * Configuration options for email clients
 */
export interface EmailClientConfig {
	/** API key for authentication */
	apiKey: string;
	/** Optional region for providers with regional endpoints */
	region?: string;
	/** Timeout in milliseconds for API requests */
	timeout?: number;
	/** Enable debug logging */
	debug?: boolean;
}
