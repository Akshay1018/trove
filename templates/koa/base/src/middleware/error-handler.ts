import { Context, Next } from 'koa';
import { logger } from '../utils/logger';

export class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    logger.error('Error:', {
      name: err instanceof Error ? err.name : 'UnknownError',
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined
    });

    if (err instanceof HttpError) {
      ctx.status = err.statusCode;
      ctx.body = {
        error: {
          message: err.message,
          status: err.statusCode
        }
      };
      return;
    }

    // Default to 500 server error
    ctx.status = 500;
    ctx.body = {
      error: {
        message: 'Internal Server Error',
        status: 500
      }
    };
  }
} 