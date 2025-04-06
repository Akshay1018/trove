import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(`Error: ${err.message}`);
  
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        status: err.statusCode,
      },
    });
  }

  // Default to 500 server error
  return res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
  });
}; 