import { TemplateOptions } from '../types/template';

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

  return {
    dependencies: [...new Set(dependencies)],
    devDependencies: [...new Set(devDependencies)]
  };
}