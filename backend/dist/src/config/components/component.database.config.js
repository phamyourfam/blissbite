"use strict";
/**
 * @file database.config.ts
 * @description Validates and exports the database configuration using environment variables.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
/**
 * Define the validation schema for the database environment variables using Joi.
 */
const envSchema = joi_1.default
    .object({
// DB_USER: joi.string().required(),
// DB_HOST: joi.string().required(),
// DB_PASSWORD: joi.string().optional().allow(''),
// DB_DATABASE: joi.string().required(),
// DB_PORT: joi.number().required()
})
    .unknown(true)
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
 * The database configuration object.
 *
 * @typedef {Object} DatabaseConfig
 * @property {string} user - The database user.
 * @property {string} host - The database host.
 * @property {string} password - The database password.
 * @property {string} database - The database name.
 * @property {number} port - The database port.
 */
const config = {
    database: {
        type: envVars.DB_TYPE,
        user: envVars.DB_USER,
        host: envVars.DB_HOST,
        password: envVars.DB_PASSWORD,
        database: envVars.DB_DATABASE,
        port: envVars.DB_PORT
    }
};
exports.default = config;
