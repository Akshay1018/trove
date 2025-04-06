import { User } from '../models/user';

describe('User Model', () => {
  describe('Validation', () => {
    it('should validate a valid user', async () => {
      const validUser = new User({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      });

      await expect(validUser.validate()).resolves.toBeUndefined();
    });

    it('should require email', async () => {
      const userWithoutEmail = new User({
        password: 'password123'
      });

      await expect(userWithoutEmail.validate()).rejects.toThrow();
    });

    it('should require password', async () => {
      const userWithoutPassword = new User({
        email: 'test@example.com'
      });

      await expect(userWithoutPassword.validate()).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const userWithInvalidEmail = new User({
        email: 'invalid-email',
        password: 'password123'
      });

      await expect(userWithInvalidEmail.validate()).rejects.toThrow();
    });
  });

  describe('Methods', () => {
    it('should remove password when converting to JSON', () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123'
      });

      const json = user.toJSON();
      expect(json).not.toHaveProperty('password');
      expect(json).toHaveProperty('email', 'test@example.com');
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      await User.create({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('should find user by email', async () => {
      const user = await User.findByEmail('test@example.com');
      expect(user).toBeTruthy();
      expect(user?.email).toBe('test@example.com');
    });

    it('should return null for non-existent email', async () => {
      const user = await User.findByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });
  });
}); 