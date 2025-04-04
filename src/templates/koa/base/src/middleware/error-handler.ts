import { Context, Next } from 'koa';
import { logger } from '../utils/logger';

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    logger.error('Error handling request:', err);

    ctx.status = err.status || 500;
    ctx.body = {
      error: {
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      }
    };
  }
} 