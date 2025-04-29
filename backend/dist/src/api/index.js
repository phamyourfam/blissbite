"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.default = applyApiMiddleware;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router_1 = __importDefault(require("@koa/router"));
const utils_1 = require("../utils");
/**
 * @file index.ts
 * @description Dynamically loads and aggregates API resource routers based on API version subdirectories.
 *
 * This module scans for version subdirectories (e.g., "v1", "v2") within the api directory and
 * dynamically imports API resource router files directly. The convention is to look for files with
 * ".router.ts", ".routes.ts", ".router.js", or ".routes.js" extensions within each resource directory.
 * This eliminates the need for redundant index.ts files in each resource directory.
 *
 * @module API
 */
/**
 * Recursively scans a directory for router files and returns their paths
 * @param {string} dirPath - The directory to scan
 * @param {string} basePath - The base path for route construction
 * @returns {Array<{filePath: string, routePath: string}>} Array of router file paths and their corresponding route paths
 */
function findRouterFiles(dirPath, basePath = '') {
    const routerFiles = [];
    const entries = fs_1.default.readdirSync(dirPath);
    for (const entry of entries) {
        const entryPath = path_1.default.join(dirPath, entry);
        const stat = fs_1.default.statSync(entryPath);
        if (stat.isDirectory()) {
            // Handle dynamic route parameters in directory names
            let routeSegment = entry;
            if (entry.startsWith('[') && entry.endsWith(']')) {
                routeSegment = `:${entry.slice(1, -1)}`;
            }
            // Recursively scan subdirectories
            const newBasePath = basePath ? `${basePath}/${routeSegment}` : routeSegment;
            routerFiles.push(...findRouterFiles(entryPath, newBasePath));
        }
        else if (entry.endsWith('.router.ts') ||
            entry.endsWith('.routes.ts') ||
            entry.endsWith('.router.js') ||
            entry.endsWith('.routes.js') ||
            entry === 'index.ts' ||
            entry === 'index.js') {
            // Use only the directory path for routing
            routerFiles.push({
                filePath: entryPath.replace(/\.(ts|js)$/, ''),
                routePath: basePath
            });
            // Commented out: File name-based routing logic
            /*
            // Handle dynamic route parameters in file names
            let routeSegment = basePath;
            if (entry === 'index.ts' || entry === 'index.js') {
                // For index files, use the parent directory path
                routeSegment = basePath;
            } else {
                // For other router files, include their name in the path
                const fileName = entry.replace(/\.(router|routes)\.(ts|js)$/, '');
                if (fileName.startsWith('[') && fileName.endsWith(']')) {
                    routeSegment = `${basePath}/:${fileName.slice(1, -1)}`;
                } else {
                    routeSegment = `${basePath}/${fileName}`;
                }
            }

            // Found a router file
            routerFiles.push({
                filePath: entryPath.replace(/\.(ts|js)$/, ''),
                routePath: routeSegment
            });
            */
        }
    }
    return routerFiles;
}
/**
 * Dynamically applies API middleware to the Koa app by directly importing router modules
 * for each API version and its resources.
 *
 * @param {import('koa').Default} app - The Koa application instance.
 * @returns {Promise<void>} A promise that resolves once all API middleware has been applied.
 */
function applyApiMiddleware(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiDirectory = __dirname;
        const entries = fs_1.default.readdirSync(apiDirectory);
        // Filter for directories that represent API versions (e.g., "v1", "v2")
        const versionDirectories = entries.filter((entry) => {
            const entryPath = path_1.default.join(apiDirectory, entry);
            return fs_1.default.statSync(entryPath).isDirectory() && entry.match(/^v\d+$/);
        });
        // Process each version directory
        for (const version of versionDirectories) {
            const versionRouter = new router_1.default({
                prefix: `/api/${version}`
            });
            const versionPath = path_1.default.join(apiDirectory, version);
            // Find all router files recursively
            const routerFiles = findRouterFiles(versionPath);
            // Process each router file
            for (const { filePath, routePath } of routerFiles) {
                try {
                    // Dynamically import the router module
                    const routerModule = yield Promise.resolve(`${filePath}`).then(s => __importStar(require(s)));
                    // The module should export a function that takes Router constructor
                    const createRouter = routerModule.default || routerModule.createRouter;
                    if (typeof createRouter === 'function') {
                        const resourceRouter = createRouter(router_1.default);
                        if (!resourceRouter) {
                            utils_1.logger.error(`Router module ${filePath} returned nothing for route path "${routePath}" in version "${version}".`);
                            continue;
                        }
                        // Mount the resource router under `/api/{version}/{routePath}`
                        // Ensure the route path starts with a slash and doesn't end with one
                        const normalizedRoutePath = `/${routePath.replace(/^\/+|\/+$/g, '')}`;
                        versionRouter.use(normalizedRoutePath, resourceRouter.routes());
                        utils_1.logger.info(`Mounted ${version}${normalizedRoutePath} router from ${filePath}`);
                    }
                    else {
                        utils_1.logger.error(`Router module ${filePath} does not export a router creation function`);
                    }
                }
                catch (error) {
                    if (error instanceof Error) {
                        utils_1.logger.error(`Failed to load API resource router: ${routePath} in ${version} ` +
                            error.stack);
                    }
                    else {
                        utils_1.logger.error(`Failed to load API resource router: ${routePath} in ${version}`);
                    }
                }
            }
            // Apply the version router to the app
            app.use(versionRouter.routes()).use(versionRouter.allowedMethods());
            utils_1.logger.info(`Mounted API version: ${version}`);
        }
    });
}
