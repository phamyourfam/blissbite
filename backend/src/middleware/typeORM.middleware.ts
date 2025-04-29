import { Context, Middleware, Next } from 'koa';
import { DataSource, Repository, EntityTarget, ObjectLiteral } from 'typeorm';

import { TypeORMContext } from './types';

import { Context } from 'koa';
import { DataSource, Repository, EntityTarget, ObjectLiteral } from 'typeorm';

/**
 * Extended Koa Context with TypeORM functionality
 */
export interface TypeORMContext extends Context {
	/**
	 * Get a TypeORM repository for the specified entity
	 */
	repository<Entity extends ObjectLiteral>(
		entity: EntityTarget<Entity>
	): Repository<Entity>;

	/**
	 * The TypeORM DataSource instance
	 */
	dataSource: DataSource;
}

/**
 * Options for configuring the TypeORM middleware
 */
export interface TypeORMMiddlewareOptions {
	/**
	 * The TypeORM DataSource instance to use
	 */
	dataSource: DataSource;

	/**
	 * Error handler function for database errors
	 */
	errorHandler?: (ctx: Context, error: Error) => void;
}

/**
 * Default error handler that logs the error and sets appropriate status
 */
const defaultErrorHandler = (ctx: Context, error: Error): void => {
	console.error('Database error:', error);
	ctx.status = 500;
	ctx.body = {
		error: 'Database operation failed',
		message:
			process.env.NODE_ENV === 'production'
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
export function typeORMMiddleware(
	options: TypeORMMiddlewareOptions
): Middleware {
	const { dataSource, errorHandler = defaultErrorHandler } = options;

	if (!dataSource) {
		throw new Error('DataSource is required for TypeORM middleware.');
	}

	return async (ctx, next): Promise<void> => {
		const typeORMCtx = ctx as TypeORMContext;
		// Make the DataSource instance available on the context
		typeORMCtx.dataSource = dataSource;

		// Add repository method to context - this simply exposes TypeORM's getRepository method
		typeORMCtx.getRepository = <Entity extends ObjectLiteral>(
			entity: EntityTarget<Entity>
		): Repository<Entity> => {
			return dataSource.getRepository(entity);
		};

		try {
			// Process the request
			await next();
		} catch (error) {
			// Handle database errors
			errorHandler(ctx, error as Error);
		}
	};
}
