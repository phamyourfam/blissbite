"use strict";
/**
 * @file component.email.config.ts
 * @description Validates email configuration and exports an instantiated email transporter
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTransporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
/**
 * Define the validation schema for the email environment variables using Joi.
 */
const joi_1 = __importDefault(require("joi"));
/**
 * Validate the environment variables against the schema.
 * If validation fails, an error is thrown and the application will not start.
 */
const envSchema = joi_1.default
    .object({
    SMTP_HOST: joi_1.default.string().required(),
    SMTP_PORT: joi_1.default.number().required(),
    SMTP_USER: joi_1.default.string().required(),
    SMTP_PASS: joi_1.default.string().required(),
    EMAIL_FROM_ADDRESS: joi_1.default.string().email().required(),
    EMAIL_FROM_NAME: joi_1.default.string().default('BlissBite'),
    EMAIL_DEBUG: joi_1.default.boolean().default(false),
    EMAIL_TIMEOUT: joi_1.default.number().default(30000)
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
exports.emailTransporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
exports.default = config;
