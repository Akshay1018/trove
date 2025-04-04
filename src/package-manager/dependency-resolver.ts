import { Framework, Database, Auth } from '../types/template';
import { Dependencies } from '../types/package-manager';

interface DependencyOptions {
  framework: Framework;
  database?: Database;
  auth?: Auth;
}

export function resolveDependencies(options: DependencyOptions): Dependencies {
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};

  // Framework dependencies
  switch (options.framework) {
    case 'express':
      Object.assign(dependencies, {
        express: '^4.18.2',
        cors: '^2.8.5',
        helmet: '^7.1.0',
        morgan: '^1.10.0',
        dotenv: '^16.4.5',
        winston: '^3.11.0'
      });
      Object.assign(devDependencies, {
        '@types/express': '^4.17.21',
        '@types/cors': '^2.8.17',
        '@types/morgan': '^1.9.9',
        '@types/node': '^20.11.24',
        typescript: '^5.3.3',
        'ts-node': '^10.9.2',
        nodemon: '^3.1.0',
        '@typescript-eslint/eslint-plugin': '^7.1.0',
        '@typescript-eslint/parser': '^7.1.0',
        eslint: '^8.57.0',
        'eslint-config-prettier': '^9.1.0',
        'eslint-plugin-prettier': '^5.1.3',
        prettier: '^3.2.5',
        jest: '^29.7.0',
        '@types/jest': '^29.5.12',
        'ts-jest': '^29.1.2',
        supertest: '^6.3.4',
        '@types/supertest': '^6.0.2'
      });
      break;
    case 'koa':
      Object.assign(dependencies, {
        koa: '^2.15.0',
        '@koa/router': '^12.0.1',
        'koa-bodyparser': '^4.4.1',
        'koa-helmet': '^7.0.2',
        'koa-logger': '^3.2.1',
        dotenv: '^16.4.5',
        winston: '^3.11.0'
      });
      Object.assign(devDependencies, {
        '@types/koa': '^2.14.0',
        '@types/koa__router': '^12.0.4',
        '@types/koa-bodyparser': '^4.3.12',
        '@types/koa-logger': '^3.1.5',
        '@types/node': '^20.11.24',
        typescript: '^5.3.3',
        'ts-node': '^10.9.2',
        nodemon: '^3.1.0',
        '@typescript-eslint/eslint-plugin': '^7.1.0',
        '@typescript-eslint/parser': '^7.1.0',
        eslint: '^8.57.0',
        'eslint-config-prettier': '^9.1.0',
        'eslint-plugin-prettier': '^5.1.3',
        prettier: '^3.2.5',
        jest: '^29.7.0',
        '@types/jest': '^29.5.12',
        'ts-jest': '^29.1.2',
        supertest: '^6.3.4',
        '@types/supertest': '^6.0.2'
      });
      break;
    case 'nest':
      Object.assign(dependencies, {
        '@nestjs/common': '^10.3.3',
        '@nestjs/core': '^10.3.3',
        '@nestjs/platform-express': '^10.3.3',
        'reflect-metadata': '^0.2.1',
        rxjs: '^7.8.1',
        dotenv: '^16.4.5',
        winston: '^3.11.0'
      });
      Object.assign(devDependencies, {
        '@nestjs/cli': '^10.3.2',
        '@nestjs/schematics': '^10.1.1',
        '@nestjs/testing': '^10.3.3',
        '@types/node': '^20.11.24',
        typescript: '^5.3.3',
        'ts-node': '^10.9.2',
        nodemon: '^3.1.0',
        '@typescript-eslint/eslint-plugin': '^7.1.0',
        '@typescript-eslint/parser': '^7.1.0',
        eslint: '^8.57.0',
        'eslint-config-prettier': '^9.1.0',
        'eslint-plugin-prettier': '^5.1.3',
        prettier: '^3.2.5',
        jest: '^29.7.0',
        '@types/jest': '^29.5.12',
        'ts-jest': '^29.1.2',
        supertest: '^6.3.4',
        '@types/supertest': '^6.0.2'
      });
      break;
  }

  // Database dependencies
  if (options.database && options.database !== 'skip') {
    switch (options.database) {
      case 'mongodb':
        Object.assign(dependencies, {
          mongoose: '^8.2.0',
          '@types/mongoose': '^5.11.97'
        });
        break;
      case 'postgres':
        Object.assign(dependencies, {
          'pg': '^8.11.3',
          '@types/pg': '^8.11.0',
          'typeorm': '^0.3.20',
          '@nestjs/typeorm': '^10.0.2'
        });
        break;
      case 'mysql':
        Object.assign(dependencies, {
          mysql2: '^3.9.1',
          '@types/mysql': '^2.15.25',
          'typeorm': '^0.3.20',
          '@nestjs/typeorm': '^10.0.2'
        });
        break;
    }
  }

  // Auth dependencies
  if (options.auth && options.auth !== 'skip') {
    switch (options.auth) {
      case 'jwt':
        Object.assign(dependencies, {
          'jsonwebtoken': '^9.0.2',
          'bcryptjs': '^2.4.3'
        });
        Object.assign(devDependencies, {
          '@types/jsonwebtoken': '^9.0.5',
          '@types/bcryptjs': '^2.4.6'
        });
        break;
      case 'passport':
        Object.assign(dependencies, {
          'passport': '^0.7.0',
          'passport-local': '^1.0.0',
          'bcryptjs': '^2.4.3'
        });
        Object.assign(devDependencies, {
          '@types/passport': '^1.0.16',
          '@types/passport-local': '^1.0.38',
          '@types/bcryptjs': '^2.4.6'
        });
        break;
    }
  }

  return { dependencies, devDependencies };
}