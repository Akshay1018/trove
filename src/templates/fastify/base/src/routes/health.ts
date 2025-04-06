import { FastifyPluginAsync } from 'fastify';

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });
}; 