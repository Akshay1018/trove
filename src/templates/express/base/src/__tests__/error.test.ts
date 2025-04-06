import { AppError } from '../middleware/error';

describe('AppError', () => {
  it('should create an operational error', () => {
    const error = new AppError(400, 'Bad request');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Bad request');
    expect(error.isOperational).toBe(true);
  });

  it('should create a non-operational error', () => {
    const error = new AppError(500, 'Internal server error', false);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(500);
    expect(error.message).toBe('Internal server error');
    expect(error.isOperational).toBe(false);
  });
}); 