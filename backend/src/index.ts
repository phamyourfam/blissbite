/**
 * @file index.ts
 * @description Bootstraps and starts the HTTP server.
 */

import http from 'http';
import process from 'process';

import { database, config, server } from './config';
import { findOrCreateDirectory, logger } from './utils';
import { runSeeder } from './config/seeder';
import { generateExampleSeeds } from './config/seed-generator';
import path from 'path';

/**
 * Bootstraps external services and starts the HTTP server.
 *
 * @async
 * @returns {Promise<http.Server>} A promise that resolves with the HTTP server instance.
 */
async function bootstrap(): Promise<http.Server> {
	// Initialize external services (e.g., database, Redis, etc.)
	// Example: await sequelize.authenticate();

	const { root, uploads, logs } = config.storage;

	findOrCreateDirectory(root);
	findOrCreateDirectory(uploads);
	findOrCreateDirectory(logs);

	// Initialize database
	await database.initialize();
	logger.info(`${config.database.type} data source has been initialized.`);

	// Seed database in development mode
	if (config.isDevelopment) {
		try {
			// Create seeds directory structure
			const seedsPath = path.join(process.cwd(), 'seeds');
			findOrCreateDirectory(seedsPath);
			findOrCreateDirectory(path.join(seedsPath, 'establishments'));
			findOrCreateDirectory(path.join(seedsPath, 'products'));
			findOrCreateDirectory(path.join(seedsPath, 'accounts'));

			// Generate example seed files
			// logger.info('Generating example seed files...');
			// await generateExampleSeeds(database);

			// // Run the seeder
			// logger.info('Running seeder...');
			// await runSeeder(database);
		} catch (error: unknown) {
			logger.error('Error during seeding:', error instanceof Error ? error.message : String(error));
		}
	}

	return http.createServer(server.callback()).listen(config.server.port);
}

bootstrap()
	.then((serverInstance) =>
		logger.info(
			`Server listening on port ${(serverInstance.address() as any).port}.`
		)
	)
	.catch((err) => {
		setImmediate(() => {
			logger.error(
				`Unable to run the server because of the following error: ${err.stack}`
			);
			process.exit();
		});
	});
