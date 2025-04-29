"use strict";
/**
 * @file index.ts
 * @description Loads and aggregates configuration components from the "components" folder,
 * and exports configuration values as both named and default exports.
 * @module config
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
/**
 * The aggregated configuration object.
 * @type {Record<string, any>}
 */
exports.config = {};
/**
 * The base directory containing configuration component files.
 */
const basePath = path_1.default.join(__dirname);
/**
 * Synchronously load and merge each configuration component into the config object.
 */
fs_1.default.readdirSync(basePath).forEach((file) => {
    var _a;
    if (file == 'index.ts')
        return;
    const componentConfig = require(path_1.default.join(basePath, file));
    // If there's a default export, use it; otherwise, use the module as-is.
    const configToMerge = (_a = componentConfig.default) !== null && _a !== void 0 ? _a : componentConfig;
    Object.assign(exports.config, configToMerge);
});
