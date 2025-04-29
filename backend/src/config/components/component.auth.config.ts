/**
 * @file component.auth.config.ts
 * @description Validates and exports the authentication configuration using environment variables.
 */

import joi from 'joi';

/**
 * Define the validation schema for the authentication environment variables using Joi.
 */
const envSchema = joi
  .object({
    SESSION_COOKIE_NAME: joi.string().default('sid'),
    SESSION_DURATION_DAYS: joi.number().default(30),
    TEMP_ACCOUNT_TTL_HOURS: joi.number().default(24),
    VERIFICATION_CODE_TTL_MINUTES: joi.number().default(30),
    MAGIC_LINK_TTL_MINUTES: joi.number().default(60),
    FRONTEND_URL: joi.string().default('http://localhost:3000')
  })
  .unknown(true)
  .required();

/**
 * Validate the environment variables against the schema.
 * If validation fails, an error is thrown and the application will not start.
 */
const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Auth config validation error: ${error.message}`);
}

/**
 * The authentication configuration object.
 */
const config = {
  auth: {
    sessionCookieName: envVars.SESSION_COOKIE_NAME,
    sessionDuration: envVars.SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000, // Convert days to milliseconds
    tempAccountTTL: envVars.TEMP_ACCOUNT_TTL_HOURS * 60 * 60 * 1000, // Convert hours to milliseconds
    verificationCodeTTL: envVars.VERIFICATION_CODE_TTL_MINUTES * 60 * 1000, // Convert minutes to milliseconds
    magicLinkTTL: envVars.MAGIC_LINK_TTL_MINUTES * 60 * 1000 // Convert minutes to milliseconds
  },
  frontend: {
    url: envVars.FRONTEND_URL
  }
};

export default config;
