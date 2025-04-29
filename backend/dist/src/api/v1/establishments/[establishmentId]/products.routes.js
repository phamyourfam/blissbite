"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../../../../middleware/auth.middleware");
const products_controller_1 = require("./products.controller");
exports.default = (Router) => {
    // The prefix should match the directory structure
    const router = new Router({ prefix: '/products' });
    // Apply authentication middleware to all routes
    router.use(auth_middleware_1.authenticate);
    // POST /establishments/products/:establishmentId/products - Create a new product
    router.post('/', products_controller_1.createOne);
    // GET /establishments/products/:establishmentId/products - Get all products for an establishment
    router.get('/', products_controller_1.getAll);
    // PUT /establishments/products/:establishmentId/products/:productId - Update a product
    router.put('/:productId', products_controller_1.updateOne);
    // DELETE /establishments/products/:establishmentId/products/:productId - Delete a product
    router.delete('/:productId', products_controller_1.deleteOne);
    return router;
};
