import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { config } from './config';
import { healthRoutes } from './routes/health';
import { authRoutes } from './routes/auth.routes';
import { connectDatabase } from './config/database';
import { configureSession } from './config/session';

export const buildApp = async (): Promise<FastifyInstance> => {
  const app = fastify({
    logger: {
      level: config.logLevel,
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  });

  // Connect to MongoDB
  await connectDatabase();

  // Register plugins
  await app.register(cors, {
    origin: config.corsOrigins,
    credentials: true,
  });
  await app.register(helmet);

  // Configure session
  await configureSession(app);

  // Register routes
  app.register(healthRoutes, { prefix: '/health' });
  app.register(authRoutes, { prefix: '/api' });

  return app;
}; 