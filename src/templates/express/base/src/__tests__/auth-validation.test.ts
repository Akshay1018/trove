import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { registerValidation, loginValidation } from '../validations/auth';

describe('Auth Validation Schemas', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {}
    };
    mockResponse = {};
  });

  describe('Register Validation', () => {
    it('should pass validation for valid registration data', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      for (const validation of registerValidation) {
        await validation.run(mockRequest as Request);
      }

      const errors = validationResult(mockRequest as Request);
      expect(errors.isEmpty()).toBe(true);
    });

    it('should fail validation for invalid email', async () => {
      mockRequest.body = {
        email: 'invalid-email',
        password: 'password123'
      };

      for (const validation of registerValidation) {
        await validation.run(mockRequest as Request);
      }

      const errors = validationResult(mockRequest as Request);
      expect(errors.isEmpty()).toBe(false);
      expect(errors.array()[0].msg).toBe('Please enter a valid email');
    });

    it('should fail validation for short password', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'short'
      };

      for (const validation of registerValidation) {
        await validation.run(mockRequest as Request);
      }

      const errors = validationResult(mockRequest as Request);
      expect(errors.isEmpty()).toBe(false);
      expect(errors.array()[0].msg).toBe('Password must be at least 6 characters long');
    });

    it('should fail validation for password without number', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'password'
      };

      for (const validation of registerValidation) {
        await validation.run(mockRequest as Request);
      }

      const errors = validationResult(mockRequest as Request);
      expect(errors.isEmpty()).toBe(false);
      expect(errors.array()[0].msg).toBe('Password must contain at least one number');
    });
  });

  describe('Login Validation', () => {
    it('should pass validation for valid login data', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      for (const validation of loginValidation) {
        await validation.run(mockRequest as Request);
      }

      const errors = validationResult(mockRequest as Request);
      expect(errors.isEmpty()).toBe(true);
    });

    it('should fail validation for invalid email', async () => {
      mockRequest.body = {
        email: 'invalid-email',
        password: 'password123'
      };

      for (const validation of loginValidation) {
        await validation.run(mockRequest as Request);
      }

      const errors = validationResult(mockRequest as Request);
      expect(errors.isEmpty()).toBe(false);
      expect(errors.array()[0].msg).toBe('Please enter a valid email');
    });

    it('should fail validation for missing password', async () => {
      mockRequest.body = {
        email: 'test@example.com'
      };

      for (const validation of loginValidation) {
        await validation.run(mockRequest as Request);
      }

      const errors = validationResult(mockRequest as Request);
      expect(errors.isEmpty()).toBe(false);
      expect(errors.array()[0].msg).toBe('Password is required');
    });
  });
}); 