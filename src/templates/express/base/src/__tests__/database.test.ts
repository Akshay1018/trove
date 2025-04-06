import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import { config } from '../config';

describe('Database Connection', () => {
  afterEach(async () => {
    await mongoose.connection.close();
  });

  it('should connect to the database', async () => {
    await connectDatabase();
    expect(mongoose.connection.readyState).toBe(1);
  });

  it('should handle connection errors', async () => {
    const invalidUrl = 'mongodb://invalid:27017/test';
    config.database.url = invalidUrl;

    await expect(connectDatabase()).rejects.toThrow();
  });

  it('should handle disconnection', async () => {
    await connectDatabase();
    expect(mongoose.connection.readyState).toBe(1);

    await mongoose.connection.close();
    expect(mongoose.connection.readyState).toBe(0);
  });

  afterAll(() => {
    // Restore the original database URL
    config.database.url = 'mongodb://localhost:27017/test-db';
  });
}); 