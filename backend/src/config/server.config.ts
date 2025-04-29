/**
 * @file server.ts
 * @description Configures and exports the Koa server instance with all middlewares and API routes.
 */

import bodyParser from '@koa/bodyparser';
import compress from 'koa-compress';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import Koa from 'koa';
import logger from 'koa-logger';
import RouteList from 'route-list';

import applyApiMiddleware from '../api';
import { config } from '.';
import { database } from './database.config';
import { errorHandlerMiddleware, typeORMMiddleware, sessionMiddleware } from '../middleware';

export const server = new Koa();

// Set session keys for cookie signing
server.keys = [process.env.SESSION_SECRET || 'your-secret-key'];

/**
 * Apply development-specific middlewares.
 */
if (config.isDevelopment) {
	server.use(logger());
}

/**
 * Register global middlewares.
 */
server
	.use(typeORMMiddleware({ dataSource: database }))
	.use(errorHandlerMiddleware)
	.use(cors({
		origin: process.env.FRONTEND_URL || 'http://localhost:3000',
		credentials: true,
		allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
		allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
		exposeHeaders: ['Content-Length', 'Date', 'X-Request-Id'],
		maxAge: 86400,
		keepHeadersOnError: true
	}))
	.use(sessionMiddleware(server))
	.use(helmet())
	.use(compress())
	.use(bodyParser());

/**
 * Mount the API routes on the server.
 */
applyApiMiddleware(server).then(() => {
    if (config.isDevelopment) {
        const routesMap = RouteList.getRoutes(server, 'koa');
        RouteList.printRoutes(routesMap);
    }
});
