import { TemplateOptions } from '../types/template';

interface DependencyVersions {
  [key: string]: string;
}

const LATEST_VERSIONS: DependencyVersions = {
  // Common dependencies
  dotenv: '^16.4.5',
  cors: '^2.8.5',
  helmet: '^7.1.0',
  compression: '^1.7.4',
  morgan: '^1.10.0',

  // Framework dependencies
  express: '^4.18.3',
  koa: '^2.15.0',
  '@koa/router': '^12.0.1',
  'koa-bodyparser': '^4.4.1',
  fastify: '^4.26.2',
  '@fastify/cors': '^9.0.1',
  '@fastify/swagger': '^8.14.0',
  '@nestjs/common': '^10.3.3',
  '@nestjs/core': '^10.3.3',
  '@nestjs/platform-express': '^10.3.3',
  'reflect-metadata': '^0.2.1',
  rxjs: '^7.8.1',

  // Database dependencies
  mongoose: '^8.2.1',
  typeorm: '^0.3.20',
  pg: '^8.11.3',
  mysql2: '^3.9.2',

  // Auth dependencies
  jsonwebtoken: '^9.0.2',
  bcryptjs: '^2.4.3',
  'express-session': '^1.18.0',
  'connect-mongo': '^5.1.0',
  passport: '^0.7.0',
  'passport-google-oauth20': '^2.0.0',
  'passport-github2': '^0.1.12',

  // Dev dependencies
  typescript: '^5.4.2',
  '@types/node': '^20.11.24',
  '@types/cors': '^2.8.17',
  '@types/morgan': '^1.9.9',
  '@types/compression': '^1.7.5',
  'ts-node-dev': '^2.0.0',
  jest: '^29.7.0',
  '@types/jest': '^29.5.12',
  'ts-jest': '^29.1.2',
  eslint: '^8.57.0',
  '@typescript-eslint/parser': '^7.1.1',
  '@typescript-eslint/eslint-plugin': '^7.1.1',
  prettier: '^3.2.5',
  '@types/express': '^4.17.21',
  '@types/koa': '^2.15.0',
  '@types/koa__router': '^12.0.4',
  '@types/koa-bodyparser': '^4.3.12',
  '@types/mongoose': '^7.0.0',
  '@types/pg': '^8.11.2',
  '@types/mysql': '^2.15.25',
  '@types/jsonwebtoken': '^9.0.6',
  '@types/bcryptjs': '^2.4.6',
  '@types/express-session': '^1.18.0',
  '@types/passport': '^1.0.16',
  '@types/passport-google-oauth20': '^2.0.14',
  '@types/passport-github2': '^1.2.9'
};

export function resolveDependencies(options: TemplateOptions) {
  const dependencies: string[] = [];
  const devDependencies: string[] = [];

  // Common dependencies
  dependencies.push(
    'dotenv',
    'cors',
    'helmet',
    'compression',
    'morgan'
  );

  // Common dev dependencies
  devDependencies.push(
    'typescript',
    '@types/node',
    '@types/cors',
    '@types/morgan',
    '@types/compression',
    'ts-node-dev',
    'jest',
    '@types/jest',
    'ts-jest',
    'eslint',
    '@typescript-eslint/parser',
    '@typescript-eslint/eslint-plugin',
    'prettier'
  );

  // Framework-specific dependencies
  switch (options.framework) {
    case 'express':
      dependencies.push('express');
      devDependencies.push('@types/express');
      break;
    case 'koa':
      dependencies.push('koa', '@koa/router', 'koa-bodyparser');
      devDependencies.push('@types/koa', '@types/koa__router', '@types/koa-bodyparser');
      break;
    case 'fastify':
      dependencies.push('fastify', '@fastify/cors', '@fastify/swagger');
      break;
    case 'nestjs':
      dependencies.push(
        '@nestjs/common',
        '@nestjs/core',
        '@nestjs/platform-express',
        'reflect-metadata',
        'rxjs'
      );
      break;
  }

  // Database-specific dependencies
  if (options.database !== 'skip') {
    switch (options.database) {
      case 'mongodb':
        dependencies.push('mongoose');
        devDependencies.push('@types/mongoose');
        break;
      case 'postgres':
        dependencies.push('typeorm', 'pg');
        devDependencies.push('@types/pg');
        break;
      case 'mysql':
        dependencies.push('typeorm', 'mysql2');
        devDependencies.push('@types/mysql');
        break;
    }
  }

  // Auth-specific dependencies
  if (options.auth !== 'skip') {
    switch (options.auth) {
      case 'jwt':
        dependencies.push('jsonwebtoken', 'bcryptjs');
        devDependencies.push('@types/jsonwebtoken', '@types/bcryptjs');
        break;
      case 'session':
        dependencies.push('express-session', 'connect-mongo');
        devDependencies.push('@types/express-session');
        break;
      case 'oauth':
        dependencies.push('passport', 'passport-google-oauth20', 'passport-github2');
        devDependencies.push(
          '@types/passport',
          '@types/passport-google-oauth20',
          '@types/passport-github2'
        );
        break;
    }
  }

  // Convert arrays to objects with versions
  const dependencyObject = dependencies.reduce((acc, dep) => {
    acc[dep] = LATEST_VERSIONS[dep] || '^1.0.0';
    return acc;
  }, {} as Record<string, string>);

  const devDependencyObject = devDependencies.reduce((acc, dep) => {
    acc[dep] = LATEST_VERSIONS[dep] || '^1.0.0';
    return acc;
  }, {} as Record<string, string>);

  return {
    dependencies: dependencyObject,
    devDependencies: devDependencyObject
  };
}