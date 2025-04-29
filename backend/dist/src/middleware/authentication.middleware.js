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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = void 0;
exports.authenticate = authenticate;
const koa_session_1 = __importDefault(require("koa-session"));
const cors_1 = __importDefault(require("@koa/cors"));
const config_1 = require("../config");
// Session configuration
const SESSION_CONFIG = {
    key: config_1.config.auth.sessionCookieName,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
    secure: false, // Set to false for local development
    sameSite: 'lax' // More permissive than 'strict' for local development
};
// Create session middleware
const sessionMiddleware = (app) => {
    // Create CORS middleware
    const corsMiddleware = (0, cors_1.default)({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    });
    // Initialize session middleware
    const sessionMiddleware = (0, koa_session_1.default)(app, SESSION_CONFIG);
    // Return a middleware function that applies CORS first, then session
    return (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
        yield corsMiddleware(ctx, () => __awaiter(void 0, void 0, void 0, function* () {
            yield sessionMiddleware(ctx, next);
        }));
    });
};
exports.sessionMiddleware = sessionMiddleware;
/**
 * Authentication middleware that validates the session
 * and attaches the account to the context.
 *
 * If no valid session is found, it will throw a 401 error.
 */
function authenticate(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!ctx.session || !ctx.session.account) {
            ctx.throw(401, 'No valid session found');
        }
        // Attach account to context
        ctx.state.account = ctx.session.account;
        yield next();
    });
}
