import dotenv from 'dotenv';
import path from 'path';
import { testConfig } from './test';

// Load environment variables from .env file
dotenv.config();

const {
  NODE_ENV = 'development',
  PORT = 3000,
  MONGODB_URI = 'mongodb://localhost:27017/my-app',
  SESSION_SECRET = 'your-session-secret',
  SESSION_NAME = 'sid',
  SESSION_MAX_AGE = '86400000', // 24 hours
  JWT_SECRET = 'your-jwt-secret',
  JWT_EXPIRES_IN = '1d',
} = process.env;

const isTest = NODE_ENV === 'test';

export const config = {
  env: NODE_ENV,
  port: Number(PORT),
  database: {
    url: isTest ? testConfig.database.url : MONGODB_URI,
  },
  session: {
    secret: isTest ? testConfig.session.secret : SESSION_SECRET,
    name: isTest ? testConfig.session.name : SESSION_NAME,
    maxAge: isTest ? testConfig.session.maxAge : Number(SESSION_MAX_AGE),
  },
  jwt: {
    secret: JWT_SECRET,
    expiresIn: JWT_EXPIRES_IN,
  },
  paths: {
    root: path.resolve(__dirname, '../../'),
    public: path.resolve(__dirname, '../../public'),
    uploads: path.resolve(__dirname, '../../uploads'),
  },
} as const; 