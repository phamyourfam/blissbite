/**
 * @file findOrCreateDirectory.ts
 * @description Utility function to ensure that a directory exists. If it doesn't, the function creates it recursively.
 * @module utils
 */
import fs from 'fs';

/**
 * Ensures that a directory exists. If it doesn't, creates it recursively.
 *
 * @param {string} dirPath - The absolute path of the directory to check/create.
 * @returns {void} - No return value; modifies the filesystem.
 */
export function findOrCreateDirectory(dirPath: string): void {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
		console.log(`✅ Created directory: ${dirPath}`);
	}
}
