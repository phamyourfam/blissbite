import fs from 'fs';
import path from 'path';
import { DataSource, DataSourceOptions, LogLevel } from 'typeorm';

import { config } from './components';
import { logger } from '../utils';

const { databaseFile } = config.storage;

// Ensure SQLite database file exists.
if (!fs.existsSync(databaseFile)) {
	fs.writeFileSync(databaseFile, '');
	logger.warning(
		`SQLite file doesn't exist. Creating database file: ${databaseFile}.`
	);
}

const { type, host, port, username, password } = config.database;

const commonConfig: Partial<DataSourceOptions> = {
	entities: [path.join(__dirname, '..', 'entities', '**', '*.entity.{ts,js}')],
	logging: process.env.NODE_ENV !== 'production' ? ['error'] : []
};

export const database = new DataSource(
	host
		? {
				type,
				host: host,
				port: port,
				username: username,
				password: password,
				...commonConfig
		  }
		: {
				type,
				database: databaseFile,
				synchronize: process.env.NODE_ENV !== 'production',
				...commonConfig
		  }
);
