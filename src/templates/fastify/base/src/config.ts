import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  port: z.coerce.number().default(3000),
  host: z.string().default('localhost'),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  logLevel: z.enum(['info', 'error', 'warn', 'debug']).default('info'),
  corsOrigins: z.string().transform(str => str.split(',')).default('http://localhost:3000'),
  mongoUri: z.string().default('mongodb://localhost:27017/test-app'),
  sessionSecret: z.string().default('your-secret-key'),
  sessionMaxAge: z.number().default(7 * 24 * 60 * 60 * 1000), // 7 days in milliseconds
});

export const config = configSchema.parse({
  port: process.env.PORT,
  host: process.env.HOST,
  nodeEnv: process.env.NODE_ENV,
  logLevel: process.env.LOG_LEVEL,
  corsOrigins: process.env.CORS_ORIGINS,
  mongoUri: process.env.MONGO_URI,
  sessionSecret: process.env.SESSION_SECRET,
  sessionMaxAge: process.env.SESSION_MAX_AGE ? parseInt(process.env.SESSION_MAX_AGE) : undefined,
}); 