/**
 * @fileoverview
 * Core interfaces and abstract classes for the Email Provider SDK.
 * This module defines the contracts that all email providers must implement.
 */

import {
	EmailClientConfig,
	EmailOptions,
	EmailResponse,
	EmailStatsOptions,
	EmailStatsResponse
} from '.';

/**
 * Interface for email providers implementing the Strategy pattern.
 * All email service providers must implement this interface.
 */
export interface EmailProvider {
	/**
	 * Sends an email using the provider
	 * @param options - Email sending options
	 * @returns Promise resolving to the send response
	 */
	sendEmail(options: EmailOptions): Promise<EmailResponse>;

	/**
	 * Retrieves email statistics for a date range
	 * @param options - Statistics retrieval options
	 * @returns Promise resolving to email statistics
	 */
	getEmailStats(options: EmailStatsOptions): Promise<EmailStatsResponse>;

	/**
	 * Validates if an email address is properly formatted and potentially deliverable
	 * @param email - Email address to validate
	 * @returns Promise resolving to boolean indicating validity
	 */
	validateEmailAddress(email: string): Promise<boolean>;
}

/**
 * Abstract factory for creating email providers
 * Implementing the Abstract Factory pattern
 */
export abstract class EmailClientFactory {
	/** Configuration for the email provider */
	protected config: EmailClientConfig;

	/**
	 * Creates a new email client factory
	 * @param config - Configuration for the email provider
	 */
	constructor(config: EmailClientConfig) {
		this.config = config;
	}

	/**
	 * Creates an instance of an email provider
	 * @returns An implementation of EmailProvider
	 */
	abstract createEmailProvider(): EmailProvider;
}
