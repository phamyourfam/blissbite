import { authenticate } from '../../../middleware/auth.middleware';
import { getAll, getOne, createOne, updateOne, deleteOne } from './establishments.controller';

export default (Router: any) => {
  const router = new Router();

  // Apply authentication middleware to all routes
  router.use(authenticate);

  // GET /establishments - Get all establishments for the current professional account
  router.get('/', getAll);

  // GET /establishments/:establishmentId - Get a single establishment
  router.get('/:establishmentId', getOne);

  // POST /establishments - Create a new establishment
  router.post('/', createOne);

  // PUT /establishments/:establishmentId - Update an establishment
  router.put('/:establishmentId', updateOne);

  // DELETE /establishments/:establishmentId - Delete an establishment
  router.delete('/:establishmentId', deleteOne);

  return router;
}; 