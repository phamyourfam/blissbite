import Logger from '@ptkdev/logger';

import { config } from '../config';

export const logger = new Logger(config.logger);
