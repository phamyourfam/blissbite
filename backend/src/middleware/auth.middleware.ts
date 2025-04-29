import { Context, Next } from 'koa';
import { TypeORMContext } from './typeORM.middleware';

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
export async function authenticate(ctx: TypeORMContext, next: Next) {
  // First try to get the session from the cookie
  if (ctx.session?.account) {
    ctx.state.account = ctx.session.account;
    return next();
  }

  // If no session cookie, check Authorization header
  const authHeader = ctx.headers.authorization;
  if (authHeader) {
    const [type, token] = authHeader.split(' ');
    if (type === 'Bearer' && token) {
      const sessionRepository = ctx.getRepository('Session');
      const session = await sessionRepository.findOne({
        where: { session_token: token },
        relations: ['account']
      });

      if (session && session.expires_at > new Date() && session.account) {
        // Update last activity
        session.last_activity = new Date();
        await sessionRepository.save(session);

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
} 