import { Request, Response } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {}
    };
    mockResponse = {
      json: jest.fn()
    };
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
    await expect(
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )
    ).rejects.toThrow();

    expect(nextFunction).not.toHaveBeenCalled();
  });
}); 