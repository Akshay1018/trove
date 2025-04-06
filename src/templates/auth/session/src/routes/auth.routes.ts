import { FastifyInstance } from 'fastify';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/auth/register', authController.register);
  fastify.post('/auth/login', authController.login);
  fastify.post('/auth/logout', { preHandler: authMiddleware }, authController.logout);
  fastify.get('/auth/me', { preHandler: authMiddleware }, authController.me);
} 