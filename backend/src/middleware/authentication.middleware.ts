import { Context, Next } from 'koa';
import session from 'koa-session';
import cors from '@koa/cors';
import Koa from 'koa';
import { config } from '../config';

// Session configuration
const SESSION_CONFIG = {
  key: config.auth.sessionCookieName,
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
export const sessionMiddleware = (app: Koa) => {
  // Create CORS middleware
  const corsMiddleware = cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  });

  // Initialize session middleware
  const sessionMiddleware = session(app, SESSION_CONFIG);

  // Return a middleware function that applies CORS first, then session
  return async (ctx: Context, next: Next) => {
    await corsMiddleware(ctx, async () => {
      await sessionMiddleware(ctx, next);
    });
  };
};

/**
 * Authentication middleware that validates the session
 * and attaches the account to the context.
 * 
 * If no valid session is found, it will throw a 401 error.
 */
export async function authenticate(ctx: Context, next: Next) {
  if (!ctx.session || !ctx.session.account) {
    ctx.throw(401, 'No valid session found');
  }

  // Attach account to context
  ctx.state.account = ctx.session.account;

  await next();
} 