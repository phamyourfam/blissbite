/**
 * @file component.email.config.ts
 * @description Validates email configuration and exports an instantiated email transporter
 */

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

/**
 * Define the validation schema for the email environment variables using Joi.
 */
import joi from 'joi';

/**
 * Validate the environment variables against the schema.
 * If validation fails, an error is thrown and the application will not start.
 */
const envSchema = joi
	.object({
		SMTP_HOST: joi.string().required(),
		SMTP_PORT: joi.number().required(),
		SMTP_USER: joi.string().required(),
		SMTP_PASS: joi.string().required(),
		EMAIL_FROM_ADDRESS: joi.string().email().required(),
		EMAIL_FROM_NAME: joi.string().default('BlissBite'),
		EMAIL_DEBUG: joi.boolean().default(false),
		EMAIL_TIMEOUT: joi.number().default(30000)
	})
	.unknown(true)
	.required();

const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
	throw new Error(`Email config validation error: ${error.message}`);
}

/**
 * The email configuration object.
 *
 * @typedef {Object} EmailConfig
 * @property {Object} sender - Default sender information
 * @property {string} sender.email - Default sender email address
 * @property {string} sender.name - Default sender name
 */
const config = {
	email: {
		sender: {
			email: envVars.EMAIL_FROM_ADDRESS,
			name: envVars.EMAIL_FROM_NAME
		}
	}
};

/**
 * Create and configure the email transporter
 */
export const emailTransporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export default config;
