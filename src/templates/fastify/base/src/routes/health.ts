import { FastifyPluginAsync } from 'fastify';

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', {
    schema: {
      tags: ['Health'],
      summary: 'Check service health',
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
            uptime: { type: 'number' },
          },
        },
      },
    },
    handler: async () => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      };
    },
  });
}; 