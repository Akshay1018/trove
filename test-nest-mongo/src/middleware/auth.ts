import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export interface AuthenticatedContext extends Context {
  user?: {
    id: number;
    email: string;
  };
}

export async function authenticate(ctx: AuthenticatedContext, next: Next) {
  try {
    const authHeader = ctx.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = { error: 'No token provided' };
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      id: number;
      email: string;
    };

    ctx.user = decoded;
    await next();
  } catch (error) {
    logger.error('Authentication error:', error);
    ctx.status = 401;
    ctx.body = { error: 'Invalid token' };
  }
} 