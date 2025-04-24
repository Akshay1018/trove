import { TemplateOptions as ExternalTemplateOptions } from '../types/template';
import * as fs from 'fs';
import * as path from 'path';

export type Framework = 'express' | 'koa' | 'fastify' | 'nestjs';
export type Auth = 'jwt' | 'oauth' | 'session' | 'skip';
export type CI = 'github' | 'gitlab' | 'jenkins' | 'bitbucket' | 'skip';
export type Database = 'mongodb' | 'postgres' | 'mysql' | 'skip';

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
      'jest.config.js',
      'nodemon.json'
    ],
    src: [
      'src/index.ts',
      'src/app.ts',
      'src/types/index.d.ts',
      'src/types/express/index.d.ts',
      'src/types/pagination.ts',
      'src/config/index.ts',
      'src/config/database.ts',
      'src/utils/logger.ts',
      'src/utils/validation.ts',
      'src/middleware/error.middleware.ts',
      'src/middleware/validation.middleware.ts',
      'src/middleware/logger.middleware.ts',
      'src/controllers/base.controller.ts',
      'src/services/base.service.ts',
      'src/models/base.model.ts',
      'src/repositories/base.repository.ts',
      // Unit tests
      'src/__tests__/unit/controllers.test.ts',
      'src/__tests__/unit/services.test.ts',
      'src/__tests__/unit/repositories.test.ts',
      'src/__tests__/unit/models.test.ts',
      'src/__tests__/unit/utils.test.ts',
      'src/__tests__/unit/config.test.ts',
      // Integration tests
      'src/__tests__/integration/api.test.ts',
      'src/__tests__/integration/database.test.ts',
      'src/__tests__/integration/auth.test.ts',
      'src/__tests__/integration/health.test.ts'
    ]
  }
};

export const FRAMEWORK_SPECIFIC: Record<Framework, FrameworkConfig> = {
  express: {
    files: {
      base: [
        'src/app.ts',
        'src/index.ts',
        'src/routes/index.ts',
        'src/routes/api.routes.ts',
        'src/middleware/error.middleware.ts',
        'src/middleware/validation.middleware.ts',
        'src/middleware/logger.middleware.ts',
        'src/controllers/base.controller.ts',
        'src/controllers/health.controller.ts',
        'src/services/base.service.ts',
        'src/utils/swagger.ts'
      ]
    }
  },
  koa: {
    files: {
      base: [
        'src/app.ts',
        'src/index.ts',
        'src/routes/index.ts',
        'src/routes/api.routes.ts',
        'src/middleware/error.middleware.ts',
        'src/middleware/validation.middleware.ts',
        'src/middleware/logger.middleware.ts',
        'src/controllers/base.controller.ts',
        'src/controllers/health.controller.ts',
        'src/services/base.service.ts'
      ]
    }
  },
  fastify: {
    files: {
      base: [
        'src/app.ts',
        'src/index.ts',
        'src/routes/index.ts',
        'src/routes/api.routes.ts',
        'src/plugins/swagger.ts',
        'src/plugins/cors.ts',
        'src/plugins/helmet.ts',
        'src/controllers/base.controller.ts',
        'src/controllers/health.controller.ts',
        'src/services/base.service.ts'
      ]
    }
  },
  nestjs: {
    files: {
      base: [
        'src/main.ts',
        'src/app.module.ts',
        'src/app.controller.ts',
        'src/app.service.ts',
        'src/common/filters/http-exception.filter.ts',
        'src/common/interceptors/logging.interceptor.ts',
        'src/common/interceptors/transform.interceptor.ts',
        'src/common/guards/jwt-auth.guard.ts',
        'src/common/decorators/roles.decorator.ts',
        'src/modules/health/health.module.ts',
        'src/modules/health/health.controller.ts',
        'src/modules/health/health.service.ts'
      ]
    }
  }
};

export const DATABASE_SPECIFIC: Record<Database, DatabaseConfig> = {
  mongodb: {
    files: {
      base: [
        'src/config/database.ts',
        'src/models/base.model.ts',
        'src/models/user.model.ts',
        'src/repositories/base.repository.ts',
        'src/repositories/user.repository.ts',
        'src/types/mongoose.d.ts'
      ]
    }
  },
  postgres: {
    files: {
      base: [
        'src/config/database.ts',
        'src/models/base.model.ts',
        'src/models/user.model.ts',
        'src/repositories/base.repository.ts',
        'src/repositories/user.repository.ts',
        'src/migrations/001_init.sql',
        'src/types/typeorm.d.ts'
      ]
    }
  },
  mysql: {
    files: {
      base: [
        'src/config/database.ts',
        'src/models/base.model.ts',
        'src/models/user.model.ts',
        'src/repositories/base.repository.ts',
        'src/repositories/user.repository.ts',
        'src/migrations/001_init.sql',
        'src/types/typeorm.d.ts'
      ]
    }
  },
  skip: { files: { base: [] } }
};

export const AUTH_SPECIFIC: Record<Auth, string[]> = {
  jwt: [
    'src/middleware/auth.middleware.ts',
    'src/controllers/auth.controller.ts',
    'src/services/auth.service.ts',
    'src/routes/auth.routes.ts',
    'src/types/jwt.d.ts',
    'src/config/jwt.config.ts'
  ],
  oauth: [
    'src/middleware/auth.middleware.ts',
    'src/controllers/auth.controller.ts',
    'src/services/auth.service.ts',
    'src/routes/auth.routes.ts',
    'src/config/oauth.config.ts',
    'src/types/oauth.d.ts',
    'views/auth/login.ejs'
  ],
  session: [
    'src/middleware/auth.middleware.ts',
    'src/middleware/session.middleware.ts',
    'src/controllers/auth.controller.ts',
    'src/services/auth.service.ts',
    'src/routes/auth.routes.ts',
    'src/config/session.config.ts',
    'src/types/session.d.ts'
  ],
  skip: []
};

export const CI_SPECIFIC: Record<CI, string[]> = {
  github: [
    '.github/workflows/ci.yml',
    '.github/workflows/cd.yml',
    '.github/workflows/mongodb-pipeline.yml',
    '.github/workflows/postgres-pipeline.yml',
    '.github/workflows/mysql-pipeline.yml'
  ],
  gitlab: [
    '.gitlab-ci.yml',
    'ci/mongodb-pipeline.yml',
    'ci/postgres-pipeline.yml',
    'ci/mysql-pipeline.yml'
  ],
  jenkins: [
    'Jenkinsfile',
    'ci/mongodb-pipeline.groovy',
    'ci/postgres-pipeline.groovy',
    'ci/mysql-pipeline.groovy'
  ],
  bitbucket: [
    'bitbucket-pipelines.yml',
    'ci/mongodb-pipeline.yml',
    'ci/postgres-pipeline.yml',
    'ci/mysql-pipeline.yml'
  ],
  skip: []
};

export function getRequiredFiles(options: ExternalTemplateOptions): string[] {
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
    const authFiles = AUTH_SPECIFIC[options.auth];
    if (authFiles) {
      files = [...files, ...authFiles];
    }
  }

  // Add CI-specific files
  if (options.ci && options.ci !== 'skip') {
    const ciFiles = CI_SPECIFIC[options.ci];
    if (ciFiles) {
      files = [...files, ...ciFiles];
    }
  }

  return files;
}

export function createDirectoryStructure(options: ExternalTemplateOptions): void {
  const baseDirectories = [
    'src',
    'src/config',
    'src/controllers',
    'src/routes',
    'src/services',
    'src/utils',
    'src/middleware',
    'src/models',
    'src/repositories',
    'src/types',
    'src/types/express',
    'src/__tests__',
    'src/__tests__/unit',
    'src/__tests__/integration'
  ];

  // Add framework-specific directories
  if (options.framework === 'nestjs') {
    baseDirectories.push(
      'src/modules',
      'src/common',
      'src/common/filters',
      'src/common/guards',
      'src/common/interceptors',
      'src/common/decorators',
      'src/modules/health'
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
      'src/migrations'
    );
  }

  // Add auth-specific directories
  if (options.auth === 'oauth') {
    baseDirectories.push(
      'views',
      'views/auth'
    );
  }

  // Add CI-specific directories
  if (options.ci === 'github') {
    baseDirectories.push(
      '.github',
      '.github/workflows'
    );
  } else if (options.ci !== 'skip') {
    baseDirectories.push('ci');
  }

  // Create directories
  baseDirectories.forEach(dir => {
    const targetDir = path.join(options.projectName || '', dir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
  });
}

export function createProjectStructure(options: ExternalTemplateOptions): void {
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