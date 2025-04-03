import { FrameworkDependencies } from '../types';

export const koaDependencies: FrameworkDependencies = {
  core: [
    {
      name: 'koa',
      version: '^2.14.2',
      category: 'core',
      description: 'Next generation web framework for Node.js'
    },
    {
      name: '@koa/cors',
      version: '^5.0.0',
      category: 'core',
      description: 'CORS middleware for Koa'
    },
    {
      name: '@koa/router',
      version: '^12.0.1',
      category: 'core',
      description: 'Router middleware for Koa'
    },
    {
      name: 'koa-bodyparser',
      version: '^4.4.1',
      category: 'core',
      description: 'Body parser middleware for Koa'
    },
    {
      name: 'koa-helmet',
      version: '^7.0.2',
      category: 'core',
      description: 'Security header middleware collection for Koa'
    },
    {
      name: 'dotenv',
      version: '^16.3.1',
      category: 'core',
      description: 'Loads environment variables from .env file'
    },
    {
      name: 'winston',
      version: '^3.11.0',
      category: 'core',
      description: 'A logger for just about everything'
    }
  ],
  database: {
    mongodb: [
      {
        name: 'mongoose',
        version: '^8.0.3',
        category: 'database',
        description: 'MongoDB object modeling tool'
      }
    ],
    postgresql: [
      {
        name: 'pg',
        version: '^8.11.3',
        category: 'database',
        description: 'PostgreSQL client'
      },
      {
        name: 'typeorm',
        version: '^0.3.17',
        category: 'database',
        description: 'ORM for TypeScript and JavaScript'
      }
    ],
    mysql: [
      {
        name: 'mysql2',
        version: '^3.6.5',
        category: 'database',
        description: 'MySQL client'
      },
      {
        name: 'typeorm',
        version: '^0.3.17',
        category: 'database',
        description: 'ORM for TypeScript and JavaScript'
      }
    ]
  },
  auth: {
    jwt: [
      {
        name: 'jsonwebtoken',
        version: '^9.0.2',
        category: 'auth',
        description: 'JSON Web Token implementation'
      },
      {
        name: 'bcryptjs',
        version: '^2.4.3',
        category: 'auth',
        description: 'Password hashing library'
      }
    ],
    session: [
      {
        name: 'koa-session',
        version: '^6.4.0',
        category: 'auth',
        description: 'Session middleware for Koa'
      },
      {
        name: 'koa-generic-session',
        version: '^2.3.1',
        category: 'auth',
        description: 'Generic session middleware for Koa'
      }
    ],
    oauth: [
      {
        name: 'koa-passport',
        version: '^6.0.0',
        category: 'auth',
        description: 'Passport middleware for Koa'
      },
      {
        name: 'passport-google-oauth20',
        version: '^2.0.0',
        category: 'auth',
        description: 'Google OAuth 2.0 authentication strategy for Passport'
      }
    ]
  },
  development: [
    {
      name: 'typescript',
      version: '^5.3.3',
      category: 'development',
      description: 'TypeScript is a language for application scale JavaScript development',
      isDevDependency: true
    },
    {
      name: '@types/node',
      version: '^20.10.5',
      category: 'development',
      description: 'TypeScript definitions for Node.js',
      isDevDependency: true
    },
    {
      name: '@types/koa',
      version: '^2.13.12',
      category: 'development',
      description: 'TypeScript definitions for Koa',
      isDevDependency: true
    },
    {
      name: '@types/koa__router',
      version: '^12.0.4',
      category: 'development',
      description: 'TypeScript definitions for @koa/router',
      isDevDependency: true
    },
    {
      name: '@typescript-eslint/eslint-plugin',
      version: '^6.15.0',
      category: 'development',
      description: 'TypeScript-specific ESLint rules',
      isDevDependency: true
    },
    {
      name: '@typescript-eslint/parser',
      version: '^6.15.0',
      category: 'development',
      description: 'Parser for TypeScript-specific ESLint rules',
      isDevDependency: true
    },
    {
      name: 'eslint',
      version: '^8.56.0',
      category: 'development',
      description: 'Tool for identifying and reporting on patterns found in ECMAScript/JavaScript code',
      isDevDependency: true
    },
    {
      name: 'prettier',
      version: '^3.1.1',
      category: 'development',
      description: 'Prettier is an opinionated code formatter',
      isDevDependency: true
    },
    {
      name: 'ts-node-dev',
      version: '^2.0.0',
      category: 'development',
      description: 'Tweaked version of node-dev that uses ts-node under the hood',
      isDevDependency: true
    }
  ],
  testing: [
    {
      name: 'jest',
      version: '^29.7.0',
      category: 'testing',
      description: 'Delightful JavaScript Testing',
      isDevDependency: true
    },
    {
      name: '@types/jest',
      version: '^29.5.11',
      category: 'testing',
      description: 'TypeScript definitions for Jest',
      isDevDependency: true
    },
    {
      name: 'ts-jest',
      version: '^29.1.1',
      category: 'testing',
      description: 'A TypeScript preprocessor with source map support for Jest',
      isDevDependency: true
    },
    {
      name: 'supertest',
      version: '^6.3.3',
      category: 'testing',
      description: 'SuperAgent driven library for testing HTTP servers',
      isDevDependency: true
    },
    {
      name: '@types/supertest',
      version: '^2.0.16',
      category: 'testing',
      description: 'TypeScript definitions for SuperTest',
      isDevDependency: true
    }
  ]
}; 