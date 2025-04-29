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
exports.authenticate = authenticate;
/**
 * Authentication middleware that validates the session
 * and attaches the account to the context.
 *
 * It checks for authentication in the following order:
 * 1. Session cookie
 * 2. Authorization header (Bearer token)
 *
 * If no valid session is found, it will throw a 401 error.
 */
function authenticate(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        // First try to get the session from the cookie
        if ((_a = ctx.session) === null || _a === void 0 ? void 0 : _a.account) {
            ctx.state.account = ctx.session.account;
            return next();
        }
        // If no session cookie, check Authorization header
        const authHeader = ctx.headers.authorization;
        if (authHeader) {
            const [type, token] = authHeader.split(' ');
            if (type === 'Bearer' && token) {
                const sessionRepository = ctx.getRepository('Session');
                const session = yield sessionRepository.findOne({
                    where: { session_token: token },
                    relations: ['account']
                });
                if (session && session.expires_at > new Date() && session.account) {
                    // Update last activity
                    session.last_activity = new Date();
                    yield sessionRepository.save(session);
                    // Attach account to context
                    ctx.state.account = {
                        id: session.account.id,
                        email: session.account.email,
                        forename: session.account.forename,
                        surname: session.account.surname,
                        accountType: session.account.accountType
                    };
                    return next();
                }
            }
        }
        // If we get here, no valid authentication was found
        ctx.throw(401, 'No valid session found');
    });
}
