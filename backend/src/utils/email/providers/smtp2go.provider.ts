/**
 * @fileoverview
 * SMTP2GO provider implementation adapter.
 * This module implements the adapter pattern to map between generic email interfaces
 * and SMTP2GO-specific API requests and responses.
 */

import {
	EmailClientConfig,
	EmailOptions,
	EmailResponse,
	EmailStatsOptions,
	EmailStatsResponse
} from '..';
import { EmailProvider } from '..';
import { BaseProvider } from '.';

/**
 * SMTP2GO specific request types
 * @internal
 */
interface SMTP2GOSendEmailPayload {
	api_key: string;
	to: string[];
	sender: string;
	subject: string;
	text_body?: string;
	html_body?: string;
	cc?: string[];
	bcc?: string[];
	custom_headers?: Record<string, string>;
	attachments?: Array<{
		filename: string;
		fileblob: string;
		mimetype: string;
	}>;
	template_id?: string;
	template_data?: Record<string, any>;
	tag?: string;
}

/**
 * SMTP2GO specific response types
 * @internal
 */
interface SMTP2GOEmailResponse {
	data: {
		succeeded: number;
		failed: number;
		email_id?: string;
	};
	request_id: string;
	error_code?: string;
	error_message?: string;
}

/**
 * SMTP2GO statistics response
 * @internal
 */
interface SMTP2GOStatsResponse {
	data: {
		emails: {
			accepted: number;
			delivered: number;
			failed: number;
			pending: number;
			opened: number;
			clicked: number;
			unsubscribed: number;
			complained: number;
		};
	};
	request_id: string;
}

/**
 * SMTP2GO email validation response
 * @internal
 */
interface SMTP2GOValidationResponse {
	data: {
		result: 'valid' | 'invalid';
		email: string;
	};
	request_id: string;
}

/**
 * SMTP2GO email credits response
 * @internal
 */
interface SMTP2GOCreditsResponse {
	data: {
		credits_available: number;
		credits_used: number;
	};
	request_id: string;
}

/**
 * SMTP2GO provider implementation
 * Implements the adapter pattern to convert between generic interfaces and SMTP2GO API
 */
export class SMTP2GOProvider extends BaseProvider implements EmailProvider {
	/** Base URL for SMTP2GO API */
	private baseUrl = 'https://api.smtp2go.com/v3';

	/**
	 * Creates a new SMTP2GO provider
	 * @param config - Email client configuration
	 */
	constructor(config: EmailClientConfig) {
		super(config);
	}

	/**
	 * Sends an email using SMTP2GO
	 * @param options - Email options
	 * @returns Promise resolving to the send response
	 */
	async sendEmail(options: EmailOptions): Promise<EmailResponse> {
		// Adapter pattern: Convert from generic EmailOptions to SMTP2GO specific format
		const payload: SMTP2GOSendEmailPayload = {
			api_key: this.apiKey,
			to: options.recipients.map((r) =>
				r.name ? `${r.name} <${r.email}>` : r.email
			),
			sender: options.sender.name
				? `${options.sender.name} <${options.sender.email}>`
				: options.sender.email,
			subject: options.subject,
			text_body: options.textBody,
			html_body: options.htmlBody
		};

		if (options.cc && options.cc.length > 0) {
			payload.cc = options.cc.map((r) =>
				r.name ? `${r.name} <${r.email}>` : r.email
			);
		}

		if (options.bcc && options.bcc.length > 0) {
			payload.bcc = options.bcc.map((r) =>
				r.name ? `${r.name} <${r.email}>` : r.email
			);
		}

		if (options.customHeaders) {
			payload.custom_headers = options.customHeaders;
		}

		if (options.attachments && options.attachments.length > 0) {
			payload.attachments = options.attachments.map((att) => ({
				filename: att.filename,
				fileblob: att.content,
				mimetype: att.mimetype
			}));
		}

		if (options.templateId) {
			payload.template_id = options.templateId;
		}

		if (options.templateData) {
			payload.template_data = options.templateData;
		}

		if (options.tags && options.tags.length > 0) {
			payload.tag = options.tags[0]; // SMTP2GO only supports one tag
		}

		try {
			const smtp2goResponse = await this.request<SMTP2GOEmailResponse>(
				'/email/send',
				payload
			);

			// Adapter pattern: Convert SMTP2GO specific response to generic EmailResponse
			return {
				success: smtp2goResponse.data.succeeded > 0,
				messageId: smtp2goResponse.data.email_id,
				errors: smtp2goResponse.error_message
					? [smtp2goResponse.error_message]
					: undefined,
				rawResponse: smtp2goResponse
			};
		} catch (error) {
			return {
				success: false,
				errors: [error instanceof Error ? error.message : String(error)]
			};
		}
	}

	/**
	 * Gets email statistics from SMTP2GO
	 * @param options - Statistics options
	 * @returns Promise resolving to email statistics
	 */
	async getEmailStats(options: EmailStatsOptions): Promise<EmailStatsResponse> {
		const payload = {
			api_key: this.apiKey,
			start_date: options.startDate,
			end_date: options.endDate,
			per_page: options.pageSize,
			page: options.page
		};

		try {
			const smtp2goResponse = await this.request<SMTP2GOStatsResponse>(
				'/stats/email_summary',
				payload
			);

			// Adapter pattern: Convert SMTP2GO specific stats to generic EmailStatsResponse
			return {
				delivered: smtp2goResponse.data.emails.delivered,
				opened: smtp2goResponse.data.emails.opened,
				clicked: smtp2goResponse.data.emails.clicked,
				bounced: smtp2goResponse.data.emails.failed,
				rejected: 0, // SMTP2GO doesn't have this specific category
				complained: smtp2goResponse.data.emails.complained,
				unsubscribed: smtp2goResponse.data.emails.unsubscribed,
				rawResponse: smtp2goResponse
			};
		} catch (error) {
			throw new Error(
				`Failed to get email stats: ${
					error instanceof Error ? error.message : String(error)
				}`
			);
		}
	}

	/**
	 * Validates an email address using SMTP2GO
	 * @param email - Email address to validate
	 * @returns Promise resolving to boolean indicating validity
	 */
	async validateEmailAddress(email: string): Promise<boolean> {
		const payload = {
			api_key: this.apiKey,
			email: email
		};

		try {
			const response = await this.request<SMTP2GOValidationResponse>(
				'/email/address/validate',
				payload
			);
			return response.data.result === 'valid';
		} catch (error) {
			this.logDebug('Email validation error:', error);
			return false;
		}
	}

	/**
	 * Gets remaining email credits (SMTP2GO specific)
	 * @returns Promise resolving to number of available credits
	 */
	async getEmailCredits(): Promise<number> {
		const payload = {
			api_key: this.apiKey
		};

		try {
			const response = await this.request<SMTP2GOCreditsResponse>(
				'/stats/email_credits',
				payload
			);
			return response.data.credits_available;
		} catch (error) {
			this.logDebug('Get credits error:', error);
			throw new Error(
				`Failed to get email credits: ${
					error instanceof Error ? error.message : String(error)
				}`
			);
		}
	}

	/**
	 * Sends a request to the SMTP2GO API
	 * @param endpoint - API endpoint path
	 * @param data - Request data
	 * @returns Promise resolving to the response
	 * @private
	 */
	private async request<T>(endpoint: string, data: any): Promise<T> {
		return this.sendRequest<T>(`${this.baseUrl}${endpoint}`, data);
	}
}
