import { Request, Response } from 'express';
import { notFoundHandler } from '../middleware/not-found';
import { AppError } from '../middleware/error';

describe('Not Found Handler', () => {
  it('should throw AppError with 404 status', () => {
    const mockRequest = {
      originalUrl: '/unknown-route'
    } as Request;

    const mockResponse = {} as Response;

    expect(() => notFoundHandler(mockRequest, mockResponse)).toThrow(AppError);
    expect(() => notFoundHandler(mockRequest, mockResponse)).toThrow(
      'Route /unknown-route not found'
    );

    try {
      notFoundHandler(mockRequest, mockResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).statusCode).toBe(404);
    }
  });
}); 