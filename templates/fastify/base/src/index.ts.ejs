import fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
<% if (auth === 'jwt') { %>import jwt from '@fastify/jwt';<% } %>
<% if (auth === 'session') { %>
import cookie from '@fastify/cookie';
import session from '@fastify/session';<% } %>
import { config } from './config';
import { healthRoutes } from './routes/health';
<% if (auth) { %>import { authRoutes } from './routes/auth';<% } %>

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Register plugins
async function bootstrap() {
  try {
    // CORS
    await server.register(cors, {
      origin: true,
    });

    <% if (auth === 'jwt') { %>
    // JWT
    await server.register(jwt, {
      secret: process.env.JWT_SECRET || 'your-secret-key',
    });<% } %>

    <% if (auth === 'session') { %>
    // Session
    await server.register(cookie);
    await server.register(session, {
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      cookie: {
        secure: process.env.NODE_ENV === 'production',
      },
    });<% } %>

    // Swagger documentation
    await server.register(swagger, {
      swagger: {
        info: {
          title: '<%= projectName %>',
          description: 'API documentation',
          version: '1.0.0',
        },
        <% if (auth === 'jwt') { %>
        securityDefinitions: {
          bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
          },
        },<% } %>
      },
    });

    await server.register(swaggerUi, {
      routePrefix: '/api/docs',
    });

    // Register routes
    await server.register(healthRoutes, { prefix: '/api/health' });
    <% if (auth) { %>await server.register(authRoutes, { prefix: '/api/auth' });<% } %>

    // Start server
    const port = config.port;
    const address = await server.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening at ${address}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

bootstrap(); 