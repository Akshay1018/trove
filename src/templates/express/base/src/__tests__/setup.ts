import mongoose from 'mongoose';
import { config } from '../config';

beforeAll(async () => {
  await mongoose.connect(config.database.url);
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
}); 