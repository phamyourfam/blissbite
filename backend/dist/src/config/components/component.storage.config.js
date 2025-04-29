"use strict";
/**
 * @file component.storage.config.ts
 * @description Validates and exports the storage configuration using environment variables.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const path_1 = __importDefault(require("path"));
const pkg_dir_1 = require("pkg-dir");
/**
 * Define the validation schema for the storage environment variables using Joi.
 */
const envSchema = joi_1.default
    .object({
    STORAGE_ROOT: joi_1.default.string(),
    STORAGE_UPLOADS: joi_1.default.string(),
    STORAGE_LOGS: joi_1.default.string()
})
    .unknown(true)
    .required();
/**
 * Validate the environment variables against the schema.
 * If validation fails, an error is thrown and the application will not start.
 */
const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
    throw new Error(`Storage config validation error: ${error.message}`);
}
// Find the project root dynamically.
const projectRoot = (0, pkg_dir_1.packageDirectorySync)() || process.cwd();
/**
 * The storage configuration object.
 */
const config = {
    storage: {
        root: path_1.default.join(projectRoot, process.env.STORAGE_ROOT || 'data'), // Dynamic root folder
        uploads: path_1.default.join(projectRoot, process.env.UPLOADS_DIR || 'data/uploads'),
        logs: path_1.default.join(projectRoot, process.env.LOGS_DIR || 'data/logs'),
        databaseFile: path_1.default.join(projectRoot, process.env.DB_FILE || 'data/database.sqlite')
    }
};
exports.default = config;
