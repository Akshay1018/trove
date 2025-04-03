import { FrameworkTemplate } from '../../types';

export const koaTemplate: FrameworkTemplate = {
  name: 'koa',
  dependencies: [
    'koa@2.15.0',
    '@koa/router@12.0.1',
    '@koa/cors@5.0.0',
    'koa-helmet@7.0.2',
    'koa-compress@5.1.1',
    'koa-bodyparser@4.4.1',
    'koa-logger@3.2.1',
    'dotenv@16.3.1',
    'winston@3.11.0'
  ],
  devDependencies: [
    'typescript@5.3.3',
    '@types/node@20.10.5',
    '@types/koa@2.13.12',
    '@types/koa__router@12.0.4',
    '@types/koa-bodyparser@4.3.12',
    '@types/koa-logger@3.1.5',
    '@types/koa-compress@4.0.6',
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
      content: `import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import compress from 'koa-compress';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import { config } from './config';
import { errorHandler } from './middleware/error-handler';
import { routes } from './routes';
import { appLogger } from './utils/logger';

const app = new Koa();
const router = new Router();

// Error handling
app.use(errorHandler);

// Middleware
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser());
app.use(logger());

// Routes
app.use(routes.routes());
app.use(routes.allowedMethods());

// Start server
const port = config.port || 3000;
app.listen(port, () => {
  appLogger.info(\`Server is running on port \${port}\`);
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
      content: `import { Context, Next } from 'koa';
import { appLogger } from '../utils/logger';

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = async (ctx: Context, next: Next): Promise<void> => {
  try {
    await next();
  } catch (err) {
    const error = err as AppError;
    const status = error.status || 500;
    const message = error.message || 'Internal Server Error';

    appLogger.error(\`[\${ctx.method}] \${ctx.path} >> Status:: \${status}, Message:: \${message}\`);

    ctx.status = status;
    ctx.body = {
      status: 'error',
      statusCode: status,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    };
  }
};`
    },
    {
      path: 'src/routes/index.ts',
      content: `import Router from '@koa/router';
import { healthRouter } from './health';

const router = new Router({
  prefix: '/api'
});

router.use('/health', healthRouter.routes(), healthRouter.allowedMethods());

export { router as routes };`
    },
    {
      path: 'src/routes/health.ts',
      content: `import Router from '@koa/router';
import { getHealth } from '../controllers/health';

const router = new Router();

router.get('/', getHealth);

export { router as healthRouter };`
    },
    {
      path: 'src/controllers/health.ts',
      content: `import { Context } from 'koa';

export const getHealth = async (ctx: Context): Promise<void> => {
  ctx.status = 200;
  ctx.body = {
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  };
};`
    },
    {
      path: 'src/utils/logger.ts',
      content: `import winston from 'winston';
import { config } from '../config';

export const appLogger = winston.createLogger({
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
      const response = await request(app.callback()).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('message', 'Server is healthy');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('404 Not Found', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app.callback()).get('/api/unknown');
      expect(response.status).toBe(404);
    });
  });
});`
    }
  ]
}; 