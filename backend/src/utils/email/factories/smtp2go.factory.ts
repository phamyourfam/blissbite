/**
 * @file smtp2go.factory.ts
 * @fileoverview
 * SMTP2GO Factory implementation.
 * This module implements the abstract factory pattern for creating SMTP2GO providers.
 */

import { EmailClientFactory, EmailProvider } from '..';
import { SMTP2GOProvider } from '../providers';

/**
 * Factory for creating SMTP2GO providers
 * Implements the Abstract Factory pattern
 */
export class SMTP2GOClientFactory extends EmailClientFactory {
	/**
	 * Creates a new SMTP2GO provider
	 * @returns SMTP2GO provider instance
	 */
	createEmailProvider(): EmailProvider {
		return new SMTP2GOProvider(this.config);
	}
}
