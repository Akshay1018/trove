import { Context } from 'koa';
<% if (database === 'postgres') { %>
import { ExampleModel } from '../models/example.model';
<% } else if (database === 'mongodb') { %>
import { Example } from '../models/example.model';
<% } %>
import { logger } from '../utils/logger';

export class ExampleController {
  static async findAll(ctx: Context) {
    try {
      <% if (database === 'postgres') { %>
      const examples = await ExampleModel.findAll();
      <% } else if (database === 'mongodb') { %>
      const examples = await Example.find().sort({ createdAt: -1 });
      <% } else { %>
      const examples = [
        { id: 1, name: 'Example 1', description: 'This is example 1' },
        { id: 2, name: 'Example 2', description: 'This is example 2' }
      ];
      <% } %>
      ctx.body = examples;
    } catch (error) {
      logger.error('Error in findAll:', error);
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }

  static async findById(ctx: Context) {
    try {
      const { id } = ctx.params;
      <% if (database === 'postgres') { %>
      const example = await ExampleModel.findById(parseInt(id, 10));
      <% } else if (database === 'mongodb') { %>
      const example = await Example.findById(id);
      <% } else { %>
      const example = { id: parseInt(id, 10), name: `Example ${id}`, description: `This is example ${id}` };
      <% } %>
      if (!example) {
        ctx.status = 404;
        ctx.body = { error: 'Example not found' };
        return;
      }
      ctx.body = example;
    } catch (error) {
      logger.error('Error in findById:', error);
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }

  static async create(ctx: Context) {
    try {
      const { name, description } = ctx.request.body as { name: string; description: string };
      if (!name) {
        ctx.status = 400;
        ctx.body = { error: 'Name is required' };
        return;
      }
      <% if (database === 'postgres') { %>
      const example = await ExampleModel.create({ name, description });
      <% } else if (database === 'mongodb') { %>
      const example = await Example.create({ name, description });
      <% } else { %>
      const example = { id: Date.now(), name, description };
      <% } %>
      ctx.status = 201;
      ctx.body = example;
    } catch (error) {
      logger.error('Error in create:', error);
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }

  static async update(ctx: Context) {
    try {
      const { id } = ctx.params;
      const { name, description } = ctx.request.body as { name: string; description: string };
      <% if (database === 'postgres') { %>
      const example = await ExampleModel.update(parseInt(id, 10), { name, description });
      <% } else if (database === 'mongodb') { %>
      const example = await Example.findByIdAndUpdate(id, { name, description }, { new: true });
      <% } else { %>
      const example = { id: parseInt(id, 10), name, description };
      <% } %>
      if (!example) {
        ctx.status = 404;
        ctx.body = { error: 'Example not found' };
        return;
      }
      ctx.body = example;
    } catch (error) {
      logger.error('Error in update:', error);
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }

  static async delete(ctx: Context) {
    try {
      const { id } = ctx.params;
      <% if (database === 'postgres') { %>
      const deleted = await ExampleModel.delete(parseInt(id, 10));
      <% } else if (database === 'mongodb') { %>
      const deleted = await Example.findByIdAndDelete(id);
      <% } else { %>
      const deleted = true;
      <% } %>
      if (!deleted) {
        ctx.status = 404;
        ctx.body = { error: 'Example not found' };
        return;
      }
      ctx.status = 204;
    } catch (error) {
      logger.error('Error in delete:', error);
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }
} 