import { Framework } from '../../types/template';
import { Dependencies } from '../../types/package-manager';
import { expressDependencies } from './express';
import { koaDependencies } from './koa';
import { nestDependencies } from './nest';
import { fastifyDependencies } from './fastify';

export const frameworkDependencyRegistry: { [key in 'express' | 'koa' | 'nestjs']: Dependencies } = {
  express: expressDependencies,
  koa: koaDependencies,
  nestjs: nestDependencies
};

export * from './express';
export * from './koa';
export * from './nest';
export * from './fastify'; 