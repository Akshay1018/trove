import { Context } from 'koa';

import { ExampleModel } from '../models/example.model';

import { logger } from '../utils/logger';

export class ExampleController {
  static async findAll(ctx: Context) {
    try {
      
      const examples = await ExampleModel.findAll();
      
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
      
      const example = await ExampleModel.findById(parseInt(id, 10));
      
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
      
      const example = await ExampleModel.create({ name, description });
      
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
      
      const example = await ExampleModel.update(parseInt(id, 10), { name, description });
      
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
      
      const deleted = await ExampleModel.delete(parseInt(id, 10));
      
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