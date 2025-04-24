import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user.model';
import { config } from '../../config';

interface RegisterBody {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export const authController = {
  async register(request: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) {
    try {
      const { email, password, firstName, lastName } = request.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return reply.status(400).send({ error: 'Email already registered' });
      }

      const user = new User({
        email,
        password,
        firstName,
        lastName,
      });

      await user.save();

      const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
        expiresIn: '7d',
      });

      return reply.send({
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      return reply.status(500).send({ error: 'Internal server error' });
    }
  },

  async login(request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) {
    try {
      const { email, password } = request.body;

      const user = await User.findOne({ email });
      if (!user) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
        expiresIn: '7d',
      });

      return reply.send({
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      return reply.status(500).send({ error: 'Internal server error' });
    }
  },

  async me(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user;
      return reply.send({
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      return reply.status(500).send({ error: 'Internal server error' });
    }
  },
}; 