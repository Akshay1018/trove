import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../../models/user.model';

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    if (!request.session.userId || !request.session.isAuthenticated) {
      return reply.status(401).send({ error: 'Authentication required' });
    }

    const user = await User.findById(request.session.userId);
    if (!user) {
      request.session.destroy();
      return reply.status(401).send({ error: 'User not found' });
    }

    if (!user.isActive) {
      request.session.destroy();
      return reply.status(401).send({ error: 'User is inactive' });
    }

    request.user = user;
  } catch (error) {
    request.session.destroy();
    return reply.status(401).send({ error: 'Invalid session' });
  }
} 