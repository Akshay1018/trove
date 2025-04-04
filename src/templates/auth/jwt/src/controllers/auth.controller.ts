import { Context } from 'koa';
<% if (database === 'postgres') { %>
import { UserModel } from '../models/user.model';
<% } else if (database === 'mongodb') { %>
import { User } from '../models/user.model';
<% } %>
import { generateToken, hashPassword, comparePassword } from '../utils/auth';
import { logger } from '../utils/logger';

export class AuthController {
  static async register(ctx: Context) {
    try {
      const { email, password, name } = ctx.request.body as {
        email: string;
        password: string;
        name: string;
      };

      // Validate input
      if (!email || !password || !name) {
        ctx.status = 400;
        ctx.body = { error: 'Email, password, and name are required' };
        return;
      }

      // Check if user already exists
      <% if (database === 'postgres') { %>
      const existingUser = await UserModel.findByEmail(email);
      <% } else if (database === 'mongodb') { %>
      const existingUser = await User.findOne({ email });
      <% } else { %>
      const existingUser = null;
      <% } %>
      if (existingUser) {
        ctx.status = 409;
        ctx.body = { error: 'User already exists' };
        return;
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      <% if (database === 'postgres') { %>
      const user = await UserModel.create({
        email,
        password: hashedPassword,
        name
      });
      <% } else if (database === 'mongodb') { %>
      const user = await User.create({
        email,
        password: hashedPassword,
        name
      });
      <% } else { %>
      const user = {
        id: Date.now(),
        email,
        name
      };
      <% } %>

      // Generate token
      const token = generateToken({ id: user.id, email: user.email });

      ctx.status = 201;
      ctx.body = {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      };
    } catch (error) {
      logger.error('Error in register:', error);
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }

  static async login(ctx: Context) {
    try {
      const { email, password } = ctx.request.body as {
        email: string;
        password: string;
      };

      // Validate input
      if (!email || !password) {
        ctx.status = 400;
        ctx.body = { error: 'Email and password are required' };
        return;
      }

      // Find user
      <% if (database === 'postgres') { %>
      const user = await UserModel.findByEmail(email);
      <% } else if (database === 'mongodb') { %>
      const user = await User.findOne({ email });
      <% } else { %>
      const user = null;
      <% } %>
      if (!user) {
        ctx.status = 401;
        ctx.body = { error: 'Invalid credentials' };
        return;
      }

      // Verify password
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        ctx.status = 401;
        ctx.body = { error: 'Invalid credentials' };
        return;
      }

      // Generate token
      const token = generateToken({ id: user.id, email: user.email });

      ctx.body = {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      };
    } catch (error) {
      logger.error('Error in login:', error);
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }

  static async me(ctx: Context) {
    try {
      const { user } = ctx as { user: { id: number; email: string } };

      // Find user
      <% if (database === 'postgres') { %>
      const userData = await UserModel.findById(user.id);
      <% } else if (database === 'mongodb') { %>
      const userData = await User.findById(user.id);
      <% } else { %>
      const userData = { id: user.id, email: user.email, name: 'Test User' };
      <% } %>
      if (!userData) {
        ctx.status = 404;
        ctx.body = { error: 'User not found' };
        return;
      }

      ctx.body = {
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name
        }
      };
    } catch (error) {
      logger.error('Error in me:', error);
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }
} 