/**
 * @file component.storage.config.ts
 * @description Validates and exports the storage configuration using environment variables.
 */

import joi from 'joi';
import path from 'path';
import { packageDirectorySync } from 'pkg-dir';

/**
 * Define the validation schema for the storage environment variables using Joi.
 */
const envSchema = joi
	.object({
		STORAGE_ROOT: joi.string(),
		STORAGE_UPLOADS: joi.string(),
		STORAGE_LOGS: joi.string()
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
const projectRoot = packageDirectorySync() || process.cwd();

/**
 * The storage configuration object.
 */
const config = {
	storage: {
		root: path.join(projectRoot, process.env.STORAGE_ROOT || 'data'), // Dynamic root folder
		uploads: path.join(projectRoot, process.env.UPLOADS_DIR || 'data/uploads'),
		logs: path.join(projectRoot, process.env.LOGS_DIR || 'data/logs'),
		databaseFile: path.join(
			projectRoot,
			process.env.DB_FILE || 'data/database.sqlite'
		)
	}
};

export default config;
