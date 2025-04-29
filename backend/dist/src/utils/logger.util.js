"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const logger_1 = __importDefault(require("@ptkdev/logger"));
const config_1 = require("../config");
exports.logger = new logger_1.default(config_1.config.logger);
