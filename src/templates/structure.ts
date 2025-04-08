import { TemplateOptions } from '../types/template';
import fs from 'fs';
import path from 'path';

export type Framework = 'express' | 'koa' | 'fastify' | 'nestjs';
export type Auth = 'jwt' | 'oauth' | 'session';
export type CI = 'github' | 'gitlab' | 'jenkins' | 'bitbucket';
export type Database = 'mongodb' | 'postgres' | 'mysql';

export interface FrameworkConfig {
  files: {
    base: string[];
  };
}

export interface DatabaseConfig {
  files: {
    base: string[];
  };
}

export const BASE_STRUCTURE = {
  files: {
    base: [
      '.gitignore',
      'README.md',
      '.env.example',
      'package.json',
      'tsconfig.json',
      '.eslintrc.json',
      '.prettierrc',
      'jest.config.js'
    ],
    src: [
      'src/config/index.ts',
      'src/utils/logger.ts',
      // Unit tests
      'src/__tests__/unit/controllers.test.ts.template',
      'src/__tests__/unit/services.test.ts.template',
      'src/__tests__/unit/repositories.test.ts.template',
      'src/__tests__/unit/models.test.ts.template',
      'src/__tests__/unit/utils.test.ts.template',
      'src/__tests__/unit/config.test.ts.template',
      'src/__tests__/unit/.gitkeep',
      // Integration tests
      'src/__tests__/integration/api.test.ts.template',
      'src/__tests__/integration/database.test.ts.template',
      'src/__tests__/integration/auth.test.ts.template',
      'src/__tests__/integration/health.test.ts.template',
      'src/__tests__/integration/.gitkeep'
    ]
  }
};

export const FRAMEWORK_SPECIFIC: Record<Framework, FrameworkConfig> = {
  express: {
    files: {
      base: [
        'frameworks/express/src/app.ts.template',
        'frameworks/express/src/index.ts.template',
        'frameworks/express/src/routes/index.ts.template',
        'frameworks/express/src/middleware/error.middleware.ts.template'
      ]
    }
  },
  koa: {
    files: {
      base: [
        'frameworks/koa/src/app.ts.template',
        'frameworks/koa/src/index.ts.template',
        'frameworks/koa/src/routes/index.ts.template',
        'frameworks/koa/src/middleware/error.middleware.ts.template'
      ]
    }
  },
  fastify: {
    files: {
      base: [
        'frameworks/fastify/src/app.ts.template',
        'frameworks/fastify/src/index.ts.template',
        'frameworks/fastify/src/routes/index.ts.template',
        'frameworks/fastify/src/plugins/swagger.ts.template'
      ]
    }
  },
  nestjs: {
    files: {
      base: [
        'frameworks/nestjs/src/main.ts.template',
        'frameworks/nestjs/src/app.module.ts.template',
        'frameworks/nestjs/src/app.controller.ts.template',
        'frameworks/nestjs/src/app.service.ts.template'
      ]
    }
  }
};

export const DATABASE_SPECIFIC: Record<Database, DatabaseConfig> = {
  mongodb: {
    files: {
      base: [
        'databases/mongodb/config/database.ts.template',
        'databases/mongodb/models/base.model.ts.template',
        'databases/mongodb/models/user.model.ts.template',
        'databases/mongodb/repositories/base.repository.ts.template',
        'databases/mongodb/repositories/user.repository.ts.template'
      ]
    }
  },
  postgres: {
    files: {
      base: [
        'databases/postgres/config/database.ts.template',
        'databases/postgres/models/base.model.ts.template',
        'databases/postgres/models/user.model.ts.template',
        'databases/postgres/repositories/base.repository.ts.template',
        'databases/postgres/repositories/user.repository.ts.template',
        'databases/postgres/migrations/001_init.sql.template'
      ]
    }
  },
  mysql: {
    files: {
      base: [
        'databases/mysql/config/database.ts.template',
        'databases/mysql/models/base.model.ts.template',
        'databases/mysql/models/user.model.ts.template',
        'databases/mysql/repositories/base.repository.ts.template',
        'databases/mysql/repositories/user.repository.ts.template',
        'databases/mysql/migrations/001_init.sql.template'
      ]
    }
  }
};

export const AUTH_SPECIFIC: Record<Auth, string[]> = {
  jwt: [
    'auth/jwt/middleware/auth.middleware.ts.template',
    'auth/jwt/controllers/auth.controller.ts.template',
    'auth/jwt/routes/auth.routes.ts.template'
  ],
  oauth: [
    'auth/oauth/middleware/auth.middleware.ts.template',
    'auth/oauth/controllers/auth.controller.ts.template',
    'auth/oauth/routes/auth.routes.ts.template'
  ],
  session: [
    'auth/session/middleware/auth.middleware.ts.template',
    'auth/session/controllers/auth.controller.ts.template',
    'auth/session/routes/auth.routes.ts.template'
  ]
};

export const CI_SPECIFIC: Record<CI, string[]> = {
  github: [
    'ci/github/.github/workflows/ci.yml.template',
    'ci/github/.github/workflows/mongodb.yml.template'
  ],
  gitlab: [
    'ci/gitlab/.gitlab-ci.yml.template',
    'ci/gitlab/mongodb-ci.yml.template'
  ],
  jenkins: [
    'ci/jenkins/Jenkinsfile.template',
    'ci/jenkins/mongodb-pipeline.groovy.template'
  ],
  bitbucket: [
    'ci/bitbucket/bitbucket-pipelines.yml.template',
    'ci/bitbucket/mongodb-pipeline.yml.template'
  ]
};

export function getRequiredFiles(options: TemplateOptions): string[] {
  let files = [...BASE_STRUCTURE.files.base, ...BASE_STRUCTURE.files.src];

  // Add framework-specific files
  if (options.framework) {
    const frameworkConfig = FRAMEWORK_SPECIFIC[options.framework];
    if (frameworkConfig) {
      files = [...files, ...frameworkConfig.files.base];
    }
  }

  // Add database-specific files
  if (options.database && options.database !== 'skip') {
    const dbConfig = DATABASE_SPECIFIC[options.database];
    if (dbConfig) {
      files = [...files, ...dbConfig.files.base];
    }
  }

  // Add auth-specific files
  if (options.auth && options.auth !== 'skip') {
    const authConfig = AUTH_SPECIFIC[options.auth];
    if (authConfig) {
      files = [...files, ...authConfig];
    }
  }

  // Add CI-specific files
  if (options.ci && options.ci !== 'skip') {
    const ciConfig = CI_SPECIFIC[options.ci];
    if (ciConfig) {
      files = [...files, ...ciConfig];
    }
  }

  return files;
}

export function createDirectoryStructure(options: TemplateOptions): void {
  // Create base directories
  const baseDirectories = [
    'src',
    'src/config',
    'src/controllers',
    'src/routes',
    'src/services',
    'src/utils',
    'src/middleware',
    'src/__tests__',
    'src/__tests__/unit',
    'src/__tests__/integration'
  ];

  // Add framework-specific directories
  if (options.framework === 'nestjs') {
    baseDirectories.push(
      'src/modules',
      'src/decorators',
      'src/filters',
      'src/guards',
      'src/interceptors',
      'src/pipes'
    );
  } else if (options.framework === 'fastify') {
    baseDirectories.push(
      'src/plugins',
      'src/schemas'
    );
  }

  // Add database-specific directories
  if (options.database && options.database !== 'skip') {
    baseDirectories.push(
      'src/models',
      'src/repositories'
    );
  }

  // Create directories
  baseDirectories.forEach(dir => {
    const targetDir = path.join(options.projectName || '', dir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
  });
}

export function createProjectStructure(options: TemplateOptions): void {
  // Create directories
  createDirectoryStructure(options);

  // Get required files
  const files = getRequiredFiles(options);

  // Copy files
  files.forEach(file => {
    const templatePath = path.join('templates', file);
    const targetPath = path.join(options.projectName || '', file.replace(/\.template$/, ''));

    if (fs.existsSync(templatePath)) {
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      fs.copyFileSync(templatePath, targetPath);
    } else {
      console.warn(`warn: Template not found for ${file}`);
    }
  });
} 