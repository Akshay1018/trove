import { FastifyInstance } from 'fastify';
import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';
import MongoStore from 'connect-mongo';
import { config } from '../../config';

export async function configureSession(app: FastifyInstance) {
  // Register cookie parser
  await app.register(fastifyCookie);

  // Register session middleware
  await app.register(fastifySession, {
    secret: config.sessionSecret,
    cookieName: 'sessionId',
    cookie: {
      secure: config.nodeEnv === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    store: MongoStore.create({
      mongoUrl: config.mongoUri,
      collectionName: 'sessions',
      ttl: 7 * 24 * 60 * 60, // 7 days
      autoRemove: 'native',
    }),
  });

  // Add session type declaration
  declare module 'fastify' {
    interface Session {
      userId?: string;
      isAuthenticated?: boolean;
    }
  }
} 