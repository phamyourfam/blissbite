"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrCreateDirectory = findOrCreateDirectory;
/**
 * @file findOrCreateDirectory.ts
 * @description Utility function to ensure that a directory exists. If it doesn't, the function creates it recursively.
 * @module utils
 */
const fs_1 = __importDefault(require("fs"));
/**
 * Ensures that a directory exists. If it doesn't, creates it recursively.
 *
 * @param {string} dirPath - The absolute path of the directory to check/create.
 * @returns {void} - No return value; modifies the filesystem.
 */
function findOrCreateDirectory(dirPath) {
    if (!fs_1.default.existsSync(dirPath)) {
        fs_1.default.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Created directory: ${dirPath}`);
    }
}
