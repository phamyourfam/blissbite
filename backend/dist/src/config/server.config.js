"use strict";
/**
 * @file server.ts
 * @description Configures and exports the Koa server instance with all middlewares and API routes.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const bodyparser_1 = __importDefault(require("@koa/bodyparser"));
const koa_compress_1 = __importDefault(require("koa-compress"));
const cors_1 = __importDefault(require("@koa/cors"));
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const koa_1 = __importDefault(require("koa"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const route_list_1 = __importDefault(require("route-list"));
const api_1 = __importDefault(require("../api"));
const _1 = require(".");
const database_config_1 = require("./database.config");
const middleware_1 = require("../middleware");
exports.server = new koa_1.default();
// Set session keys for cookie signing
exports.server.keys = [process.env.SESSION_SECRET || 'your-secret-key'];
/**
 * Apply development-specific middlewares.
 */
if (_1.config.isDevelopment) {
    exports.server.use((0, koa_logger_1.default)());
}
/**
 * Register global middlewares.
 */
exports.server
    .use((0, middleware_1.typeORMMiddleware)({ dataSource: database_config_1.database }))
    .use(middleware_1.errorHandlerMiddleware)
    .use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposeHeaders: ['Content-Length', 'Date', 'X-Request-Id'],
    maxAge: 86400,
    keepHeadersOnError: true
}))
    .use((0, middleware_1.sessionMiddleware)(exports.server))
    .use((0, koa_helmet_1.default)())
    .use((0, koa_compress_1.default)())
    .use((0, bodyparser_1.default)());
/**
 * Mount the API routes on the server.
 */
(0, api_1.default)(exports.server).then(() => {
    if (_1.config.isDevelopment) {
        const routesMap = route_list_1.default.getRoutes(exports.server, 'koa');
        route_list_1.default.printRoutes(routesMap);
    }
});
