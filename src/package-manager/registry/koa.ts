import { FrameworkDependencies } from '../types';

export const koaDependencies: FrameworkDependencies = {
  core: [
    {
      name: 'koa',
      versions: [{ version: '^2.14.2', isRequired: true }],
      category: 'core',
      description: 'Next generation web framework for Node.js'
    },
    {
      name: '@koa/cors',
      versions: [{ version: '^5.0.0', isRequired: true }],
      category: 'core',
      description: 'CORS middleware for Koa'
    },
    {
      name: '@koa/router',
      versions: [{ version: '^12.0.1', isRequired: true }],
      category: 'core',
      description: 'Router middleware for Koa'
    },
    {
      name: 'koa-bodyparser',
      versions: [{ version: '^4.4.1', isRequired: true }],
      category: 'core',
      description: 'Body parser middleware for Koa'
    },
    {
      name: 'koa-helmet',
      versions: [{ version: '^7.0.2', isRequired: true }],
      category: 'core',
      description: 'Security header middleware collection for Koa'
    },
    {
      name: 'dotenv',
      versions: [{ version: '^16.3.1', isRequired: true }],
      category: 'core',
      description: 'Loads environment variables from .env file'
    },
    {
      name: 'winston',
      versions: [{ version: '^3.11.0', isRequired: true }],
      category: 'core',
      description: 'A logger for just about everything'
    }
  ],
  database: {
    mongodb: [
      {
        name: 'mongoose',
        versions: [{ version: '^8.0.3', isRequired: true }],
        category: 'database',
        description: 'MongoDB object modeling tool'
      }
    ],
    postgresql: [
      {
        name: 'pg',
        versions: [{ version: '^8.11.3', isRequired: true }],
        category: 'database',
        description: 'PostgreSQL client'
      },
      {
        name: 'typeorm',
        versions: [{ version: '^0.3.17', isRequired: true }],
        category: 'database',
        description: 'ORM for TypeScript and JavaScript'
      }
    ],
    mysql: [
      {
        name: 'mysql2',
        versions: [{ version: '^3.6.5', isRequired: true }],
        category: 'database',
        description: 'MySQL client'
      },
      {
        name: 'typeorm',
        versions: [{ version: '^0.3.17', isRequired: true }],
        category: 'database',
        description: 'ORM for TypeScript and JavaScript'
      }
    ]
  },
  auth: {
    jwt: [
      {
        name: 'jsonwebtoken',
        versions: [{ version: '^9.0.2', isRequired: true }],
        category: 'auth',
        description: 'JSON Web Token implementation'
      },
      {
        name: 'bcryptjs',
        versions: [{ version: '^2.4.3', isRequired: true }],
        category: 'auth',
        description: 'Password hashing library'
      }
    ],
    session: [
      {
        name: 'koa-session',
        versions: [{ version: '^6.4.0', isRequired: true }],
        category: 'auth',
        description: 'Session middleware for Koa'
      },
      {
        name: 'koa-generic-session',
        versions: [{ version: '^2.3.1', isRequired: false }],
        category: 'auth',
        description: 'Generic session middleware for Koa'
      }
    ],
    oauth: [
      {
        name: 'koa-passport',
        versions: [{ version: '^6.0.0', isRequired: true }],
        category: 'auth',
        description: 'Passport middleware for Koa'
      },
      {
        name: 'passport-google-oauth20',
        versions: [{ version: '^2.0.0', isRequired: true }],
        category: 'auth',
        description: 'Google OAuth 2.0 authentication strategy for Passport'
      }
    ]
  },
  development: [
    {
      name: 'typescript',
      versions: [{ version: '^5.3.3', isRequired: true }],
      category: 'development',
      description: 'TypeScript is a language for application scale JavaScript development',
      isDevDependency: true
    },
    {
      name: '@types/node',
      versions: [{ version: '^20.10.5', isRequired: true }],
      category: 'development',
      description: 'TypeScript definitions for Node.js',
      isDevDependency: true
    },
    {
      name: '@types/koa',
      versions: [{ version: '^2.13.12', isRequired: true }],
      category: 'development',
      description: 'TypeScript definitions for Koa',
      isDevDependency: true
    },
    {
      name: '@types/koa__router',
      versions: [{ version: '^12.0.4', isRequired: true }],
      category: 'development',
      description: 'TypeScript definitions for @koa/router',
      isDevDependency: true
    },
    {
      name: '@typescript-eslint/eslint-plugin',
      versions: [{ version: '^6.15.0', isRequired: true }],
      category: 'development',
      description: 'TypeScript-specific ESLint rules',
      isDevDependency: true
    },
    {
      name: '@typescript-eslint/parser',
      versions: [{ version: '^6.15.0', isRequired: true }],
      category: 'development',
      description: 'Parser for TypeScript-specific ESLint rules',
      isDevDependency: true
    },
    {
      name: 'eslint',
      versions: [{ version: '^8.56.0', isRequired: true }],
      category: 'development',
      description: 'Tool for identifying and reporting on patterns found in ECMAScript/JavaScript code',
      isDevDependency: true
    },
    {
      name: 'prettier',
      versions: [{ version: '^3.1.1', isRequired: true }],
      category: 'development',
      description: 'Prettier is an opinionated code formatter',
      isDevDependency: true
    },
    {
      name: 'ts-node-dev',
      versions: [{ version: '^2.0.0', isRequired: true }],
      category: 'development',
      description: 'Tweaked version of node-dev that uses ts-node under the hood',
      isDevDependency: true
    }
  ],
  testing: [
    {
      name: 'jest',
      versions: [{ version: '^29.7.0', isRequired: true }],
      category: 'testing',
      description: 'Delightful JavaScript Testing',
      isDevDependency: true
    },
    {
      name: '@types/jest',
      versions: [{ version: '^29.5.11', isRequired: true }],
      category: 'testing',
      description: 'TypeScript definitions for Jest',
      isDevDependency: true
    },
    {
      name: 'ts-jest',
      versions: [{ version: '^29.1.1', isRequired: true }],
      category: 'testing',
      description: 'A TypeScript preprocessor with source map support for Jest',
      isDevDependency: true
    },
    {
      name: 'supertest',
      versions: [{ version: '^6.3.3', isRequired: true }],
      category: 'testing',
      description: 'SuperAgent driven library for testing HTTP servers',
      isDevDependency: true
    },
    {
      name: '@types/supertest',
      versions: [{ version: '^2.0.16', isRequired: true }],
      category: 'testing',
      description: 'TypeScript definitions for SuperTest',
      isDevDependency: true
    }
  ]
}; 