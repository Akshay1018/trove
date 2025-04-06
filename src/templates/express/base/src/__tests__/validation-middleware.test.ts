import { Request, Response } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';
import { AppError } from '../middleware/error';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {}
    };
    mockResponse = {};
    nextFunction = jest.fn();
  });

  it('should pass validation for valid data', async () => {
    const validations = [
      body('email').isEmail(),
      body('password').isLength({ min: 6 })
    ];

    mockRequest.body = {
      email: 'test@example.com',
      password: 'password123'
    };

    const middleware = validate(validations);
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
  });

  it('should throw error for invalid data', async () => {
    const validations = [
      body('email').isEmail(),
      body('password').isLength({ min: 6 })
    ];

    mockRequest.body = {
      email: 'invalid-email',
      password: 'short'
    };

    const middleware = validate(validations);

    try {
      await middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).statusCode).toBe(400);
      expect((error as AppError).message).toBe('Validation error');
    }

    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should handle multiple validation errors', async () => {
    const validations = [
      body('email').isEmail(),
      body('password').isLength({ min: 6 }),
      body('age').isInt({ min: 18 })
    ];

    mockRequest.body = {
      email: 'invalid-email',
      password: 'short',
      age: 'not-a-number'
    };

    const middleware = validate(validations);

    try {
      await middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).statusCode).toBe(400);
      expect((error as AppError).message).toBe('Validation error');
    }

    expect(nextFunction).not.toHaveBeenCalled();
  });
}); 