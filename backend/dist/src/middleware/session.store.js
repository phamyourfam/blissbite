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
exports.TypeORMSessionStore = void 0;
const authentication_session_entity_1 = require("../entities/authentication/authentication.session.entity");
class TypeORMSessionStore {
    get(key_1, maxAge_1, _a) {
        return __awaiter(this, arguments, void 0, function* (key, maxAge, { rolling, changed, ctx }) {
            const typeORMCtx = ctx;
            const sessionRepository = typeORMCtx.getRepository(authentication_session_entity_1.Session);
            const session = yield sessionRepository.findOne({
                where: { session_token: key },
                relations: ['account']
            });
            if (!session) {
                return null;
            }
            // Check if session is expired
            if (session.expires_at < new Date()) {
                yield this.destroy(key, { rolling, changed, ctx });
                return null;
            }
            // Update last activity
            session.last_activity = new Date();
            yield sessionRepository.save(session);
            return {
                account: session.account,
                sessionToken: session.session_token,
                expiresAt: session.expires_at
            };
        });
    }
    set(key_1, sess_1, maxAge_1, _a) {
        return __awaiter(this, arguments, void 0, function* (key, sess, maxAge, { rolling, changed, ctx }) {
            const typeORMCtx = ctx;
            const sessionRepository = typeORMCtx.getRepository(authentication_session_entity_1.Session);
            const session = yield sessionRepository.findOne({
                where: { session_token: key }
            });
            if (session) {
                // Update existing session
                session.expires_at = new Date(Date.now() + maxAge);
                session.last_activity = new Date();
                yield sessionRepository.save(session);
            }
            else {
                // Create new session
                const newSession = sessionRepository.create({
                    session_token: key,
                    expires_at: new Date(Date.now() + maxAge),
                    last_activity: new Date(),
                    account: sess.account
                });
                yield sessionRepository.save(newSession);
            }
        });
    }
    destroy(key_1, _a) {
        return __awaiter(this, arguments, void 0, function* (key, { rolling, changed, ctx }) {
            const typeORMCtx = ctx;
            const sessionRepository = typeORMCtx.getRepository(authentication_session_entity_1.Session);
            yield sessionRepository.delete({ session_token: key });
        });
    }
}
exports.TypeORMSessionStore = TypeORMSessionStore;
