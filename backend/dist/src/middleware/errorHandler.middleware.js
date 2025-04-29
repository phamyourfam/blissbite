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
exports.errorHandlerMiddleware = errorHandlerMiddleware;
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
function errorHandlerMiddleware(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield next();
        }
        catch (err) {
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
    });
}
