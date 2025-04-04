import { FrameworkTemplate } from '../../types';

export const expressTemplate: FrameworkTemplate = {
  name: 'express',
  dependencies: [
    'express@4.18.2',
    'cors@2.8.5',
    'helmet@7.1.0',
    'dotenv@16.3.1',
    'winston@3.11.0',
    'express-validator@7.0.1',
    'compression@1.7.4',
    'morgan@1.10.0'
  ],
  devDependencies: [
    'typescript@5.3.3',
    '@types/node@20.10.5',
    '@types/express@4.17.21',
    '@types/cors@2.8.17',
    '@types/morgan@1.9.9',
    '@types/compression@1.7.5',
    'ts-node-dev@2.0.0',
    'rimraf@5.0.5'
  ],
  scripts: {
    'start': 'node dist/index.js',
    'dev': 'ts-node-dev --respawn --transpile-only src/index.ts',
    'build': 'rimraf dist && tsc',
    'test': 'jest',
    'test:watch': 'jest --watch',
    'test:coverage': 'jest --coverage',
    'lint': 'eslint . --ext .ts',
    'lint:fix': 'eslint . --ext .ts --fix',
    'format': 'prettier --write "src/**/*.ts"'
  },
  files: [
    {
      path: 'src/index.ts',
      content: `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found';
import { routes } from './routes';
import { logger } from './utils/logger';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const port = config.port || 3000;
app.listen(port, () => {
  logger.info(\`Server is running on port \${port}\`);
});

export default app;`
    },
    {
      path: 'src/config/index.ts',
      content: `import dotenv from 'dotenv';
import { validateConfig } from './validate';

// Load environment variables
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validate configuration
validateConfig(config);

export { config };`
    },
    {
      path: 'src/config/validate.ts',
      content: `interface Config {
  port: number | string;
  nodeEnv: string;
  logLevel: string;
}

export function validateConfig(config: Config): void {
  const errors: string[] = [];

  if (!config.port) {
    errors.push('PORT is required');
  }

  if (!config.nodeEnv) {
    errors.push('NODE_ENV is required');
  }

  if (!config.logLevel) {
    errors.push('LOG_LEVEL is required');
  }

  if (errors.length > 0) {
    throw new Error(\`Invalid configuration: \${errors.join(', ')}\`);
  }
}`
    },
    {
      path: 'src/middleware/error-handler.ts',
      content: `import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(\`[\${req.method}] \${req.path} >> StatusCode:: \${statusCode}, Message:: \${message}\`);

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};`
    },
    {
      path: 'src/middleware/not-found.ts',
      content: `import { Request, Response } from 'express';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: \`Cannot \${req.method} \${req.path}\`
  });
};`
    },
    {
      path: 'src/routes/index.ts',
      content: `import { Router } from 'express';
import { healthRouter } from './health';

const router = Router();

router.use('/health', healthRouter);

export { router as routes };`
    },
    {
      path: 'src/routes/health.ts',
      content: `import { Router } from 'express';
import { getHealth } from '../controllers/health';

const router = Router();

router.get('/', getHealth);

export { router as healthRouter };`
    },
    {
      path: 'src/controllers/health.ts',
      content: `import { Request, Response } from 'express';

export const getHealth = (req: Request, res: Response): void => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
};`
    },
    {
      path: 'src/utils/logger.ts',
      content: `import winston from 'winston';
import { config } from '../config';

export const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});`
    },
    {
      path: 'tests/app.test.ts',
      content: `import request from 'supertest';
import app from '../src/index';

describe('App', () => {
  describe('GET /api/health', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('message', 'Server is healthy');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('404 Not Found', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/unknown');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('statusCode', 404);
    });
  });
});`
    }
  ]
}; 