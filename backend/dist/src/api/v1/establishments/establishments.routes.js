"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const establishments_controller_1 = require("./establishments.controller");
exports.default = (Router) => {
    const router = new Router();
    // Apply authentication middleware to all routes
    router.use(auth_middleware_1.authenticate);
    // GET /establishments - Get all establishments for the current professional account
    router.get('/', establishments_controller_1.getAll);
    // GET /establishments/:establishmentId - Get a single establishment
    router.get('/:establishmentId', establishments_controller_1.getOne);
    // POST /establishments - Create a new establishment
    router.post('/', establishments_controller_1.createOne);
    // PUT /establishments/:establishmentId - Update an establishment
    router.put('/:establishmentId', establishments_controller_1.updateOne);
    // DELETE /establishments/:establishmentId - Delete an establishment
    router.delete('/:establishmentId', establishments_controller_1.deleteOne);
    return router;
};
