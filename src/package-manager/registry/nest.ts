import { FrameworkDependencies } from '../types';

export const nestDependencies: FrameworkDependencies = {
  core: [
    {
      name: '@nestjs/common',
      versions: [{ version: '^10.3.0', isRequired: true }],
      category: 'core',
      description: 'Nest core package'
    },
    {
      name: '@nestjs/core',
      versions: [{ version: '^10.3.0', isRequired: true }],
      category: 'core',
      description: 'Nest core IoC container package'
    },
    {
      name: '@nestjs/platform-express',
      versions: [{ version: '^10.3.0', isRequired: true }],
      category: 'core',
      description: 'Nest platform implementation for Express'
    },
    {
      name: '@nestjs/config',
      versions: [{ version: '^3.1.1', isRequired: true }],
      category: 'core',
      description: 'Configuration module for Nest'
    },
    {
      name: 'reflect-metadata',
      versions: [{ version: '^0.1.13', isRequired: true }],
      category: 'core',
      description: 'Polyfill for Metadata Reflection API'
    },
    {
      name: 'rxjs',
      versions: [{ version: '^7.8.1', isRequired: true }],
      category: 'core',
      description: 'Reactive Extensions for JavaScript'
    },
    {
      name: 'class-validator',
      versions: [{ version: '^0.14.0', isRequired: true }],
      category: 'core',
      description: 'Decorator-based property validation'
    },
    {
      name: 'class-transformer',
      versions: [{ version: '^0.5.1', isRequired: true }],
      category: 'core',
      description: 'Transform plain object to class instance'
    },
    {
      name: '@nestjs/swagger',
      versions: [{ version: '^7.1.17', isRequired: true }],
      category: 'core',
      description: 'OpenAPI (Swagger) module for Nest'
    },
    {
      name: 'winston',
      versions: [{ version: '^3.11.0', isRequired: true }],
      category: 'core',
      description: 'A logger for just about everything'
    },
    {
      name: 'nest-winston',
      versions: [{ version: '^1.9.4', isRequired: true }],
      category: 'core',
      description: 'Winston module for Nest'
    }
  ],
  database: {
    mongodb: [
      {
        name: '@nestjs/mongoose',
        versions: [{ version: '^10.0.2', isRequired: true }],
        category: 'database',
        description: 'Mongoose module for Nest'
      },
      {
        name: 'mongoose',
        versions: [{ version: '^8.0.3', isRequired: true }],
        category: 'database',
        description: 'MongoDB object modeling tool'
      }
    ],
    postgresql: [
      {
        name: '@nestjs/typeorm',
        versions: [{ version: '^10.0.1', isRequired: true }],
        category: 'database',
        description: 'TypeORM module for Nest'
      },
      {
        name: 'typeorm',
        versions: [{ version: '^0.3.17', isRequired: true }],
        category: 'database',
        description: 'ORM for TypeScript and JavaScript'
      },
      {
        name: 'pg',
        versions: [{ version: '^8.11.3', isRequired: true }],
        category: 'database',
        description: 'PostgreSQL client'
      }
    ],
    mysql: [
      {
        name: '@nestjs/typeorm',
        versions: [{ version: '^10.0.1', isRequired: true }],
        category: 'database',
        description: 'TypeORM module for Nest'
      },
      {
        name: 'typeorm',
        versions: [{ version: '^0.3.17', isRequired: true }],
        category: 'database',
        description: 'ORM for TypeScript and JavaScript'
      },
      {
        name: 'mysql2',
        versions: [{ version: '^3.6.5', isRequired: true }],
        category: 'database',
        description: 'MySQL client'
      }
    ]
  },
  auth: {
    jwt: [
      {
        name: '@nestjs/jwt',
        versions: [{ version: '^10.2.0', isRequired: true }],
        category: 'auth',
        description: 'JWT utilities module for Nest'
      },
      {
        name: '@nestjs/passport',
        versions: [{ version: '^10.0.2', isRequired: true }],
        category: 'auth',
        description: 'Passport module for Nest'
      },
      {
        name: 'passport-jwt',
        versions: [{ version: '^4.0.1', isRequired: true }],
        category: 'auth',
        description: 'Passport strategy for authenticating with JWT'
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
        name: '@nestjs/passport',
        versions: [{ version: '^10.0.2', isRequired: true }],
        category: 'auth',
        description: 'Passport module for Nest'
      },
      {
        name: 'express-session',
        versions: [{ version: '^1.17.3', isRequired: true }],
        category: 'auth',
        description: 'Session middleware for Express'
      },
      {
        name: 'passport',
        versions: [{ version: '^0.7.0', isRequired: true }],
        category: 'auth',
        description: 'Authentication middleware for Node.js'
      }
    ],
    oauth: [
      {
        name: '@nestjs/passport',
        versions: [{ version: '^10.0.2', isRequired: true }],
        category: 'auth',
        description: 'Passport module for Nest'
      },
      {
        name: 'passport',
        versions: [{ version: '^0.7.0', isRequired: true }],
        category: 'auth',
        description: 'Authentication middleware for Node.js'
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
      name: '@types/express',
      versions: [{ version: '^4.17.21', isRequired: true }],
      category: 'development',
      description: 'TypeScript definitions for Express',
      isDevDependency: true
    },
    {
      name: '@nestjs/cli',
      versions: [{ version: '^10.2.1', isRequired: true }],
      category: 'development',
      description: 'Nest CLI',
      isDevDependency: true
    },
    {
      name: '@nestjs/schematics',
      versions: [{ version: '^10.0.3', isRequired: true }],
      category: 'development',
      description: 'Nest Schematics',
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
    }
  ],
  testing: [
    {
      name: '@nestjs/testing',
      versions: [{ version: '^10.3.0', isRequired: true }],
      category: 'testing',
      description: 'Nest testing utilities',
      isDevDependency: true
    },
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