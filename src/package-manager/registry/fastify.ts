import { PackageInfo, FrameworkDependencies } from '../types';

export const fastifyPackages: PackageInfo[] = [
  {
    name: 'fastify',
    version: '^4.0.0',
    description: 'Fast and low overhead web framework',
    author: 'Fastify team',
    license: 'MIT'
  },
  {
    name: '@fastify/cors',
    version: '^8.0.0',
    description: 'Fastify CORS plugin',
    author: 'Fastify team',
    license: 'MIT'
  },
  {
    name: '@fastify/helmet',
    version: '^11.0.0',
    description: 'Important security headers for Fastify',
    author: 'Fastify team',
    license: 'MIT'
  }
];

export const fastifyDependencies: FrameworkDependencies = {
  core: fastifyPackages,
  database: {},
  auth: {},
  development: [],
  testing: []
}; 