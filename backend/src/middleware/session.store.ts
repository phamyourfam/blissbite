import { Session } from '../entities/authentication/authentication.session.entity';
import { Context } from 'koa';
import { TypeORMContext } from './typeORM.middleware';

export class TypeORMSessionStore {
  async get(key: string, maxAge: number, { rolling, changed, ctx }: { rolling: boolean; changed: boolean; ctx?: any }) {
    const typeORMCtx = ctx as TypeORMContext;
    const sessionRepository = typeORMCtx.getRepository(Session);

    const session = await sessionRepository.findOne({
      where: { session_token: key },
      relations: ['account']
    });

    if (!session) {
      return null;
    }

    // Check if session is expired
    if (session.expires_at < new Date()) {
      await this.destroy(key, { rolling, changed, ctx });
      return null;
    }

    // Update last activity
    session.last_activity = new Date();
    await sessionRepository.save(session);

    return {
      account: session.account,
      sessionToken: session.session_token,
      expiresAt: session.expires_at
    };
  }

  async set(key: string, sess: any, maxAge: number, { rolling, changed, ctx }: { rolling: boolean; changed: boolean; ctx?: any }) {
    const typeORMCtx = ctx as TypeORMContext;
    const sessionRepository = typeORMCtx.getRepository(Session);

    const session = await sessionRepository.findOne({
      where: { session_token: key }
    });

    if (session) {
      // Update existing session
      session.expires_at = new Date(Date.now() + maxAge);
      session.last_activity = new Date();
      await sessionRepository.save(session);
    } else {
      // Create new session
      const newSession = sessionRepository.create({
        session_token: key,
        expires_at: new Date(Date.now() + maxAge),
        last_activity: new Date(),
        account: sess.account
      });
      await sessionRepository.save(newSession);
    }
  }

  async destroy(key: string, { rolling, changed, ctx }: { rolling: boolean; changed: boolean; ctx?: any }) {
    const typeORMCtx = ctx as TypeORMContext;
    const sessionRepository = typeORMCtx.getRepository(Session);

    await sessionRepository.delete({ session_token: key });
  }
} 