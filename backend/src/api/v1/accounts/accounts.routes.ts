import * as controller from './accounts.controller';
import { authenticate } from '../../../middleware/auth.middleware';

/**
 * Create and return a Koa Router configured with account routes.
 *
 * @param {Function} Router - Koa Router constructor.
 * @returns {Object} A Koa Router instance configured with account routes.
 */
export default (Router: any) => {
	const router = new Router({
		// prefix: `/accounts`
	});

	router
		.get('/:accountId', authenticate, controller.getOne)
		.get('/', authenticate, controller.getAll)
		.post('/', controller.createOne)
		.patch('/:accountId', authenticate, controller.updateOne)
		.delete('/:accountId', authenticate, controller.deleteOne);

	return router;
};
