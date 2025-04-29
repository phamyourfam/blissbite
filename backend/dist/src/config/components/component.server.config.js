"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file server.config.ts
 * @description Validates and exports the server configuration using environment variables.
 */
const joi_1 = __importDefault(require("joi"));
/**
 * Define the validation schema for environment variables using Joi.
 * This schema ensures that the required variables are provided and are of the correct type.
 */
const envSchema = joi_1.default
    .object({
    NODE_ENV: joi_1.default
        .string()
        .valid('development', 'production', 'test')
        .required(),
    PORT: joi_1.default.number(),
    API_VERSION: joi_1.default.number()
})
    .unknown(true) // allow other unknown environment variables
    .required();
/**
 * Validate the environment variables against the schema.
 * If validation fails, an error is thrown and the application will not start.
 */
const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
/**
 * The server configuration object.
 * @typedef {Object} Config
 * @property {string} env - The current Node environment.
 * @property {boolean} isTest - True if the environment is "test".
 * @property {boolean} isDevelopment - True if the environment is "development".
 * @property {Object} server - Server-related configuration.
 * @property {number} server.port - The port number on which the server will run.
 * @property {string|number} server.apiVersion - The API version.
 */
const config = {
    env: envVars.NODE_ENV,
    isTest: envVars.NODE_ENV === 'test',
    isDevelopment: envVars.NODE_ENV === 'development',
    server: {
        port: envVars.PORT || 8080,
        apiVersion: envVars.API_VERSION || 'v1'
    }
};
exports.default = config;
