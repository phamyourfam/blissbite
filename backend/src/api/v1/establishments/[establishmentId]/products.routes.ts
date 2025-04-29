import { authenticate } from '../../../../middleware/auth.middleware';
import { createOne, getAll, updateOne, deleteOne } from './products.controller';

export default (Router: any) => {
  // The prefix should match the directory structure
  const router = new Router({prefix: '/products'});

  // Apply authentication middleware to all routes
  router.use(authenticate);

  // POST /establishments/products/:establishmentId/products - Create a new product
  router.post('/', createOne);

  // GET /establishments/products/:establishmentId/products - Get all products for an establishment
  router.get('/', getAll);

  // PUT /establishments/products/:establishmentId/products/:productId - Update a product
  router.put('/:productId', updateOne);

  // DELETE /establishments/products/:establishmentId/products/:productId - Delete a product
  router.delete('/:productId', deleteOne);

  return router;
}; 