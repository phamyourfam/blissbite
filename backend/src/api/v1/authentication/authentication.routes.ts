/**
 * @file authentication.routes.ts
 * @description Authentication routes for API v1
 */

import {
	signupStart,
	verifyEmailCode,
	login,
	logout,
	getCurrentUser,
	completeSignup
} from './authentication.controller';

export default (Router: any) => {
	const router = new Router();

	// Signup Flow
	router.post('/signup/start', signupStart);
	router.post('/verify-email/:code', verifyEmailCode);
	router.post('/signup/complete', completeSignup);

	// Session Management
	router.post('/login', login);
	router.post('/logout', logout);
	router.get('/me', getCurrentUser);

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
