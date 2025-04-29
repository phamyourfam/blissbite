"use strict";
/**
 * @file authentication.routes.ts
 * @description Authentication routes for API v1
 */
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_controller_1 = require("./authentication.controller");
exports.default = (Router) => {
    const router = new Router();
    // Signup Flow
    router.post('/signup/start', authentication_controller_1.signupStart);
    router.post('/verify-email/:code', authentication_controller_1.verifyEmailCode);
    router.post('/signup/complete', authentication_controller_1.completeSignup);
    // Session Management
    router.post('/login', authentication_controller_1.login);
    router.post('/logout', authentication_controller_1.logout);
    router.get('/me', authentication_controller_1.getCurrentUser);
    // Password Reset Flow (to be implemented)
    router.post('/password-reset/request', (ctx) => {
        ctx.status = 501;
        ctx.body = { message: 'Not implemented yet' };
    });
    router.post('/password-reset/confirm', (ctx) => {
        ctx.status = 501;
        ctx.body = { message: 'Not implemented yet' };
    });
    return router;
};
