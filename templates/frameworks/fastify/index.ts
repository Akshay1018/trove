import { FrameworkTemplate } from '../../types';

export const fastifyTemplate: FrameworkTemplate = {
  name: 'fastify',
  dependencies: [
    'fastify@4.25.2',
    '@fastify/cors@8.5.0',
    '@fastify/helmet@11.1.1',
    '@fastify/swagger@8.12.1',
    '@fastify/swagger-ui@2.0.1',
    '@fastify/env@4.3.0',
    '@fastify/sensible@5.5.0',
    '@fastify/type-provider-typebox@3.5.0',
    '@sinclair/typebox@0.31.28',
    'pino-pretty@10.3.0',
    'close-with-grace@1.2.0'
  ],
  devDependencies: [
    'typescript@5.3.3',
    '@types/node@20.10.5',
    'tsx@4.7.0',
    'tsup@8.0.1',
    '@types/jest@29.5.11',
    'jest@29.7.0',
    'ts-jest@29.1.1',
    'pino-pretty@10.3.0'
  ],
  scripts: {
    'build': 'tsup src/index.ts --format cjs,esm --dts',
    'dev': 'tsx watch src/index.ts',
    'start': 'node dist/index.js',
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
      content: `import { join } from 'path';
import closeWithGrace from 'close-with-grace';
import { buildServer } from './server';
import { config } from './config';

async function main() {
  const server = await buildServer();

  await server.listen({
    port: config.PORT,
    host: config.HOST
  });

  closeWithGrace({ delay: 2000 }, async ({ signal, err }) => {
    if (err) {
      server.log.error(err);
    }
    server.log.info(\`Received \${signal}, closing server...\`);
    await server.close();
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});`
    },
    {
      path: 'src/server.ts',
      content: `import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import sensible from '@fastify/sensible';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { healthRoutes } from './routes/health';
import { swaggerConfig } from './config/swagger';

export async function buildServer() {
  const server = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  }).withTypeProvider<TypeBoxTypeProvider>();

  // Register plugins
  await server.register(cors);
  await server.register(helmet);
  await server.register(sensible);
  
  // Swagger documentation
  await server.register(swagger, swaggerConfig);
  await server.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
  });

  // Register routes
  await server.register(healthRoutes, { prefix: '/api/health' });

  // Error handler
  server.setErrorHandler((error, request, reply) => {
    server.log.error(error);
    reply.status(500).send({
      status: 'error',
      message: 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  });

  return server;
}`
    },
    {
      path: 'src/config/index.ts',
      content: `import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

const ConfigSchema = Type.Object({
  NODE_ENV: Type.Union([
    Type.Literal('development'),
    Type.Literal('production'),
    Type.Literal('test')
  ]),
  PORT: Type.Number({ default: 3000 }),
  HOST: Type.String({ default: '0.0.0.0' }),
  LOG_LEVEL: Type.Union([
    Type.Literal('info'),
    Type.Literal('error'),
    Type.Literal('debug'),
    Type.Literal('warn')
  ], { default: 'info' })
});

const validator = TypeCompiler.Compile(ConfigSchema);

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3000,
  HOST: process.env.HOST || '0.0.0.0',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
} as const;

if (!validator.Check(config)) {
  throw new Error(\`Invalid configuration: \${JSON.stringify(validator.Errors(config))}\`);
}

export { config };`
    },
    {
      path: 'src/config/swagger.ts',
      content: `import { SwaggerOptions } from '@fastify/swagger';

export const swaggerConfig: SwaggerOptions = {
  swagger: {
    info: {
      title: 'API Documentation',
      description: 'API endpoints documentation',
      version: '1.0.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'health', description: 'Health check endpoints' }
    ]
  }
};`
    },
    {
      path: 'src/routes/health.ts',
      content: `import { FastifyPluginAsync } from 'fastify';
import { Type } from '@sinclair/typebox';

const HealthResponse = Type.Object({
  status: Type.String(),
  timestamp: Type.String()
});

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', {
    schema: {
      response: {
        200: HealthResponse
      },
      tags: ['health']
    }
  }, async () => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString()
    };
  });
};`
    },
    {
      path: 'test/health.test.ts',
      content: `import { test } from 'tap';
import { buildServer } from '../src/server';

test('health check returns 200', async (t) => {
  const server = await buildServer();

  t.teardown(() => server.close());

  const response = await server.inject({
    method: 'GET',
    url: '/api/health'
  });

  t.equal(response.statusCode, 200);
  t.same(JSON.parse(response.payload), {
    status: 'healthy',
    timestamp: response.json().timestamp
  });
});`
    }
  ]
}; 