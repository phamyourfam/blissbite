/**
 * @fileoverview
 * Base provider implementation with shared functionality.
 * This module provides common functionality that can be reused across providers.
 *
 * @author Your Name
 * @version 1.0.0
 */

import { EmailClientConfig } from '..';

/**
 * Base provider class with shared functionality
 */
export abstract class BaseProvider {
	/** API key for authentication */
	protected apiKey: string;
	/** Request timeout in milliseconds */
	protected timeout: number;
	/** Debug mode flag */
	protected debug: boolean;

	/**
	 * Creates a new base provider
	 * @param config - Email client configuration
	 */
	constructor(config: EmailClientConfig) {
		this.apiKey = config.apiKey;
		this.timeout = config.timeout || 30000;
		this.debug = config.debug || false;
	}

	/**
	 * Sends a request to the API endpoint
	 * @param url - Full URL to the API endpoint
	 * @param data - Request body data
	 * @param method - HTTP method (default: POST)
	 * @returns Promise resolving to the response data
	 * @throws Error if the request fails
	 */
	protected async sendRequest<T>(
		url: string,
		data: any,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST'
	): Promise<T> {
		this.logDebug('Request:', method, url, data);

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		try {
			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data),
				signal: controller.signal
			});

			if (!response.ok) {
				throw new Error(`API Error: ${response.status} ${response.statusText}`);
			}

			const result = await response.json();
			this.logDebug('Response:', result);
			return result as T;
		} catch (error) {
			if (error instanceof Error && error.name === 'AbortError') {
				throw new Error(`Request timeout after ${this.timeout}ms`);
			}
			throw error;
		} finally {
			clearTimeout(timeoutId);
		}
	}

	/**
	 * Logs debug information if debug mode is enabled
	 * @param args - Arguments to log
	 */
	protected logDebug(...args: any[]): void {
		if (this.debug) {
			console.log('[EmailSDK]', ...args);
		}
	}
}
