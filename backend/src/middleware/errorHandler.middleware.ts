import { Context, Next } from 'koa';

/**
 * Koa error handling middleware.
 *
 * Catches errors thrown from downstream middleware, logs errors with status codes 500 or greater,
 * and sets a consistent error response.
 *
 * @async
 * @param {Context} ctx - The Koa context object.
 * @param {Next} next - The next middleware function in the chain.
 * @returns {Promise<void>} A promise that resolves once the middleware chain has completed.
 */
export async function errorHandlerMiddleware(
	ctx: Context,
	next: Next
): Promise<void> {
	try {
		await next();
	} catch (err: any) {
		if (err.status >= 500) {
			console.log('Error handler:', err);
		}

		switch (err.message) {
			case 'ctx.repository is not a function':
				err.message = 'TypeORM middleware not applied.';
				break;
		}

		ctx.status = err.status || 500;
		ctx.body = {
			status: 'failed',
			message: err.message || 'Internal server error'
		};
	}
}
