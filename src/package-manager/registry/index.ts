import { DependencyRegistry } from '../types';
import { expressDependencies } from './express';
import { koaDependencies } from './koa';
import { nestDependencies } from './nest';
import { fastifyDependencies } from './fastify';

export const dependencyRegistry: DependencyRegistry = {
  express: expressDependencies,
  koa: koaDependencies,
  nest: nestDependencies,
  fastify: fastifyDependencies
};

export * from './express';
export * from './koa';
export * from './nest';
export * from './fastify'; 