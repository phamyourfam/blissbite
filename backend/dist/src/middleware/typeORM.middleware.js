"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeORMMiddleware = typeORMMiddleware;
/**
 * Default error handler that logs the error and sets appropriate status
 */
const defaultErrorHandler = (ctx, error) => {
    console.error('Database error:', error);
    ctx.status = 500;
    ctx.body = {
        error: 'Database operation failed',
        message: process.env.NODE_ENV === 'production'
            ? 'An internal server error occurred'
            : error.message
    };
};
/**
 * Create TypeORM middleware for Koa that exposes TypeORM repositories
 *
 * @param options Configuration options for the middleware
 * @returns Koa middleware function that adds TypeORM functionality to the context
 *
 * @example
 * ```typescript
 * import { createTypeORMMiddleware } from 'koa-typeorm-middleware';
 * import { AppDataSource } from './data-source';
 * import { User } from './entities/User';
 *
 * const app = new Koa();
 *
 * // Initialize the middleware
 * app.use(createTypeORMMiddleware({
 *   dataSource: AppDataSource
 * }));
 *
 * // Use in routes
 * router.get('/users', async (ctx) => {
 *   const userRepository = ctx.repository(User);
 *   ctx.body = await userRepository.find();
 * });
 * ```
 */
function typeORMMiddleware(options) {
    const { dataSource, errorHandler = defaultErrorHandler } = options;
    if (!dataSource) {
        throw new Error('DataSource is required for TypeORM middleware.');
    }
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const typeORMCtx = ctx;
        // Make the DataSource instance available on the context
        typeORMCtx.dataSource = dataSource;
        // Add repository method to context - this simply exposes TypeORM's getRepository method
        typeORMCtx.getRepository = (entity) => {
            return dataSource.getRepository(entity);
        };
        try {
            // Process the request
            yield next();
        }
        catch (error) {
            // Handle database errors
            errorHandler(ctx, error);
        }
    });
}
