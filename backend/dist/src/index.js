"use strict";
/**
 * @file index.ts
 * @description Bootstraps and starts the HTTP server.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const process_1 = __importDefault(require("process"));
const config_1 = require("./config");
const utils_1 = require("./utils");
const path_1 = __importDefault(require("path"));
/**
 * Bootstraps external services and starts the HTTP server.
 *
 * @async
 * @returns {Promise<http.Server>} A promise that resolves with the HTTP server instance.
 */
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        // Initialize external services (e.g., database, Redis, etc.)
        // Example: await sequelize.authenticate();
        const { root, uploads, logs } = config_1.config.storage;
        (0, utils_1.findOrCreateDirectory)(root);
        (0, utils_1.findOrCreateDirectory)(uploads);
        (0, utils_1.findOrCreateDirectory)(logs);
        // Initialize database
        yield config_1.database.initialize();
        utils_1.logger.info(`${config_1.config.database.type} data source has been initialized.`);
        // Seed database in development mode
        if (config_1.config.isDevelopment) {
            try {
                // Create seeds directory structure
                const seedsPath = path_1.default.join(process_1.default.cwd(), 'seeds');
                (0, utils_1.findOrCreateDirectory)(seedsPath);
                (0, utils_1.findOrCreateDirectory)(path_1.default.join(seedsPath, 'establishments'));
                (0, utils_1.findOrCreateDirectory)(path_1.default.join(seedsPath, 'products'));
                (0, utils_1.findOrCreateDirectory)(path_1.default.join(seedsPath, 'accounts'));
                // Generate example seed files
                // logger.info('Generating example seed files...');
                // await generateExampleSeeds(database);
                // // Run the seeder
                // logger.info('Running seeder...');
                // await runSeeder(database);
            }
            catch (error) {
                utils_1.logger.error('Error during seeding:', error instanceof Error ? error.message : String(error));
            }
        }
        return http_1.default.createServer(config_1.server.callback()).listen(config_1.config.server.port);
    });
}
bootstrap()
    .then((serverInstance) => utils_1.logger.info(`Server listening on port ${serverInstance.address().port}.`))
    .catch((err) => {
    setImmediate(() => {
        utils_1.logger.error(`Unable to run the server because of the following error: ${err.stack}`);
        process_1.default.exit();
    });
});
