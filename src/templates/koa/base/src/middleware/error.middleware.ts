import { Context, Next } from 'koa';
import { logger } from '../utils/logger';

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err: any) {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    logger.error(`Error: ${message}`);

    ctx.status = status;
    ctx.body = {
      success: false,
      error: message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    };
  }
} 