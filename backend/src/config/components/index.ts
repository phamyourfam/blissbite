/**
 * @file index.ts
 * @description Loads and aggregates configuration components from the "components" folder,
 * and exports configuration values as both named and default exports.
 * @module config
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

/**
 * The aggregated configuration object.
 * @type {Record<string, any>}
 */
export const config: Record<string, any> = {};

/**
 * The base directory containing configuration component files.
 */
const basePath = path.join(__dirname);

/**
 * Synchronously load and merge each configuration component into the config object.
 */
fs.readdirSync(basePath).forEach((file: string) => {
	if (file == 'index.ts') return;

	const componentConfig = require(path.join(basePath, file));
	// If there's a default export, use it; otherwise, use the module as-is.
	const configToMerge = componentConfig.default ?? componentConfig;
	Object.assign(config, configToMerge);
});
