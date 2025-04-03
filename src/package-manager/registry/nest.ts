import { FrameworkDependencies } from '../types';

export const nestDependencies: FrameworkDependencies = {
  core: [
    {
      name: '@nestjs/common',
      version: '^10.3.0',
      category: 'core',
      description: 'Nest core package'
    },
    {
      name: '@nestjs/core',
      version: '^10.3.0',
      category: 'core',
      description: 'Nest core IoC container package'
    },
    {
      name: '@nestjs/platform-express',
      version: '^10.3.0',
      category: 'core',
      description: 'Nest platform implementation for Express'
    },
    {
      name: '@nestjs/config',
      version: '^3.1.1',
      category: 'core',
      description: 'Configuration module for Nest'
    },
    {
      name: 'reflect-metadata',
      version: '^0.1.13',
      category: 'core',
      description: 'Polyfill for Metadata Reflection API'
    },
    {
      name: 'rxjs',
      version: '^7.8.1',
      category: 'core',
      description: 'Reactive Extensions for JavaScript'
    },
    {
      name: 'class-validator',
      version: '^0.14.0',
      category: 'core',
      description: 'Decorator-based property validation'
    },
    {
      name: 'class-transformer',
      version: '^0.5.1',
      category: 'core',
      description: 'Transform plain object to class instance'
    },
    {
      name: '@nestjs/swagger',
      version: '^7.1.17',
      category: 'core',
      description: 'OpenAPI (Swagger) module for Nest'
    },
    {
      name: 'winston',
      version: '^3.11.0',
      category: 'core',
      description: 'A logger for just about everything'
    },
    {
      name: 'nest-winston',
      version: '^1.9.4',
      category: 'core',
      description: 'Winston module for Nest'
    }
  ],
  database: {
    mongodb: [
      {
        name: '@nestjs/mongoose',
        version: '^10.0.2',
        category: 'database',
        description: 'Mongoose module for Nest'
      },
      {
        name: 'mongoose',
        version: '^8.0.3',
        category: 'database',
        description: 'MongoDB object modeling tool'
      }
    ],
    postgresql: [
      {
        name: '@nestjs/typeorm',
        version: '^10.0.1',
        category: 'database',
        description: 'TypeORM module for Nest'
      },
      {
        name: 'typeorm',
        version: '^0.3.17',
        category: 'database',
        description: 'ORM for TypeScript and JavaScript'
      },
      {
        name: 'pg',
        version: '^8.11.3',
        category: 'database',
        description: 'PostgreSQL client'
      }
    ],
    mysql: [
      {
        name: '@nestjs/typeorm',
        version: '^10.0.1',
        category: 'database',
        description: 'TypeORM module for Nest'
      },
      {
        name: 'typeorm',
        version: '^0.3.17',
        category: 'database',
        description: 'ORM for TypeScript and JavaScript'
      },
      {
        name: 'mysql2',
        version: '^3.6.5',
        category: 'database',
        description: 'MySQL client'
      }
    ]
  },
  auth: {
    jwt: [
      {
        name: '@nestjs/jwt',
        version: '^10.2.0',
        category: 'auth',
        description: 'JWT utilities module for Nest'
      },
      {
        name: '@nestjs/passport',
        version: '^10.0.2',
        category: 'auth',
        description: 'Passport module for Nest'
      },
      {
        name: 'passport-jwt',
        version: '^4.0.1',
        category: 'auth',
        description: 'Passport strategy for authenticating with JWT'
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
        name: '@nestjs/passport',
        version: '^10.0.2',
        category: 'auth',
        description: 'Passport module for Nest'
      },
      {
        name: 'express-session',
        version: '^1.17.3',
        category: 'auth',
        description: 'Session middleware for Express'
      },
      {
        name: 'passport',
        version: '^0.7.0',
        category: 'auth',
        description: 'Authentication middleware for Node.js'
      }
    ],
    oauth: [
      {
        name: '@nestjs/passport',
        version: '^10.0.2',
        category: 'auth',
        description: 'Passport module for Nest'
      },
      {
        name: 'passport',
        version: '^0.7.0',
        category: 'auth',
        description: 'Authentication middleware for Node.js'
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
      name: '@types/express',
      version: '^4.17.21',
      category: 'development',
      description: 'TypeScript definitions for Express',
      isDevDependency: true
    },
    {
      name: '@nestjs/cli',
      version: '^10.2.1',
      category: 'development',
      description: 'Nest CLI',
      isDevDependency: true
    },
    {
      name: '@nestjs/schematics',
      version: '^10.0.3',
      category: 'development',
      description: 'Nest Schematics',
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
    }
  ],
  testing: [
    {
      name: '@nestjs/testing',
      version: '^10.3.0',
      category: 'testing',
      description: 'Nest testing utilities',
      isDevDependency: true
    },
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