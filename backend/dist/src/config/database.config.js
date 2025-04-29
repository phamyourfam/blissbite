"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const typeorm_1 = require("typeorm");
const components_1 = require("./components");
const utils_1 = require("../utils");
const { databaseFile } = components_1.config.storage;
// Ensure SQLite database file exists.
if (!fs_1.default.existsSync(databaseFile)) {
    fs_1.default.writeFileSync(databaseFile, '');
    utils_1.logger.warning(`SQLite file doesn't exist. Creating database file: ${databaseFile}.`);
}
const { type, host, port, username, password } = components_1.config.database;
const commonConfig = {
    entities: [path_1.default.join(__dirname, '..', 'entities', '**', '*.entity.{ts,js}')],
    logging: process.env.NODE_ENV !== 'production' ? ['error'] : []
};
exports.database = new typeorm_1.DataSource(host
    ? Object.assign({ type, host: host, port: port, username: username, password: password }, commonConfig) : Object.assign({ type, database: databaseFile, synchronize: process.env.NODE_ENV !== 'production' }, commonConfig));
