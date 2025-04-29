"use strict";
/**
 * @file component.auth.config.ts
 * @description Validates and exports the authentication configuration using environment variables.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
/**
 * Define the validation schema for the authentication environment variables using Joi.
 */
const envSchema = joi_1.default
    .object({
    SESSION_COOKIE_NAME: joi_1.default.string().default('sid'),
    SESSION_DURATION_DAYS: joi_1.default.number().default(30),
    TEMP_ACCOUNT_TTL_HOURS: joi_1.default.number().default(24),
    VERIFICATION_CODE_TTL_MINUTES: joi_1.default.number().default(30),
    MAGIC_LINK_TTL_MINUTES: joi_1.default.number().default(60),
    FRONTEND_URL: joi_1.default.string().default('http://localhost:3000')
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
exports.default = config;
