import { TemplateOptions } from '../types/template';

export const BASE_STRUCTURE = {
  directories: [
    'src',
    'src/config',
    'src/controllers',
    'src/models',
    'src/routes',
    'src/services',
    'src/utils',
    'src/middleware',
    'src/__tests__',
    'src/__tests__/unit',
    'src/__tests__/integration'
  ],
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
      'src/app.ts',
      'src/index.ts',
      'src/config/index.ts'
    ]
  }
};

export const FRAMEWORK_SPECIFIC = {
  express: {
    directories: [],
    files: [
      'src/middleware/error.ts',
      'src/middleware/not-found.ts'
    ]
  },
  koa: {
    directories: [],
    files: [
      'src/middleware/error.ts',
      'src/middleware/not-found.ts'
    ]
  },
  nestjs: {
    directories: [
      'src/modules',
      'src/common',
      'src/decorators'
    ],
    files: [
      'src/main.ts',
      'src/app.module.ts'
    ]
  },
  fastify: {
    directories: [
      'src/plugins',
      'src/schemas'
    ],
    files: [
      'src/plugins/swagger.ts',
      'src/plugins/cors.ts'
    ]
  }
};

export const DATABASE_SPECIFIC = {
  mongodb: {
    directories: [],
    files: [
      'src/config/database.ts',
      'src/models/base.model.ts'
    ]
  },
  postgres: {
    directories: [
      'src/migrations',
      'src/entities'
    ],
    files: [
      'src/config/database.ts',
      'src/config/ormconfig.ts'
    ]
  },
  mysql: {
    directories: [
      'src/migrations',
      'src/entities'
    ],
    files: [
      'src/config/database.ts',
      'src/config/ormconfig.ts'
    ]
  }
};

export const AUTH_SPECIFIC = {
  jwt: {
    directories: [],
    files: [
      'src/middleware/auth.middleware.ts',
      'src/controllers/auth.controller.ts',
      'src/routes/auth.routes.ts',
      'src/models/user.model.ts',
      'src/config/auth.ts'
    ]
  },
  session: {
    directories: [],
    files: [
      'src/middleware/session.middleware.ts',
      'src/controllers/auth.controller.ts',
      'src/routes/auth.routes.ts',
      'src/models/user.model.ts',
      'src/config/auth.ts'
    ]
  },
  oauth: {
    directories: [
      'src/strategies'
    ],
    files: [
      'src/strategies/google.strategy.ts',
      'src/strategies/github.strategy.ts',
      'src/controllers/auth.controller.ts',
      'src/routes/auth.routes.ts',
      'src/models/user.model.ts',
      'src/config/auth.ts'
    ]
  }
};

export const CI_SPECIFIC = {
  github: {
    directories: [
      '.github/workflows'
    ],
    files: [
      '.github/workflows/ci.yml'
    ]
  },
  gitlab: {
    directories: [],
    files: [
      '.gitlab-ci.yml'
    ]
  },
  bitbucket: {
    directories: [],
    files: [
      'bitbucket-pipelines.yml'
    ]
  }
};

export function getRequiredFiles(options: TemplateOptions): string[] {
  let files = [...BASE_STRUCTURE.files.base, ...BASE_STRUCTURE.files.src];

  // Add framework-specific files
  if (options.framework) {
    files = [...files, ...(FRAMEWORK_SPECIFIC[options.framework]?.files || [])];
  }

  // Add database-specific files if database is selected
  if (options.database && options.database !== 'skip') {
    files = [...files, ...(DATABASE_SPECIFIC[options.database]?.files || [])];
  }

  // Add auth-specific files if auth is selected
  if (options.auth && options.auth !== 'skip') {
    files = [...files, ...(AUTH_SPECIFIC[options.auth]?.files || [])];
  }

  // Add CI-specific files if CI is selected
  if (options.ci && options.ci !== 'skip') {
    files = [...files, ...(CI_SPECIFIC[options.ci]?.files || [])];
  }

  return files;
}

export function getRequiredDirectories(options: TemplateOptions): string[] {
  let directories = [...BASE_STRUCTURE.directories];

  // Add framework-specific directories
  if (options.framework) {
    directories = [...directories, ...(FRAMEWORK_SPECIFIC[options.framework]?.directories || [])];
  }

  // Add database-specific directories if database is selected
  if (options.database && options.database !== 'skip') {
    directories = [...directories, ...(DATABASE_SPECIFIC[options.database]?.directories || [])];
  }

  // Add auth-specific directories if auth is selected
  if (options.auth && options.auth !== 'skip') {
    directories = [...directories, ...(AUTH_SPECIFIC[options.auth]?.directories || [])];
  }

  // Add CI-specific directories if CI is selected
  if (options.ci && options.ci !== 'skip') {
    directories = [...directories, ...(CI_SPECIFIC[options.ci]?.directories || [])];
  }

  return directories;
}

export const getProjectStructure = (options: TemplateOptions) => ({
  directories: getRequiredDirectories(options),
  configFiles: [
    {
      name: '.env.example',
      content: getEnvTemplate(options)
    },
    {
      name: '.gitignore',
      content: getGitignoreTemplate()
    },
    {
      name: 'package.json',
      content: getPackageTemplate(options)
    },
    {
      name: 'tsconfig.json',
      content: getTsConfigTemplate()
    },
    {
      name: '.eslintrc.json',
      content: getEslintTemplate()
    },
    {
      name: '.prettierrc',
      content: getPrettierTemplate()
    }
  ]
});

const getEnvTemplate = (options: TemplateOptions) => {
  let template = `
# Application
PORT=3000
NODE_ENV=development
`;

  // Add database configuration
  if (options.database === 'postgres') {
    template += `
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=app
DB_SCHEMA=public
`;
  } else if (options.database === 'mysql') {
    template += `
# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=app
DB_CHARSET=utf8mb4
`;
  } else if (options.database === 'mongodb') {
    template += `
# MongoDB
MONGODB_URI=mongodb://localhost:27017/app
`;
  }

  // Add auth configuration
  if (options.auth === 'jwt') {
    template += `
# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
`;
  } else if (options.auth === 'session') {
    template += `
# Session
SESSION_SECRET=your-session-secret
SESSION_NAME=connect.sid
SESSION_MAX_AGE=86400000
`;
  } else if (options.auth === 'oauth') {
    template += `
# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback
`;
  }

  return template;
};

const getGitignoreTemplate = () => {
  return `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build output
dist/
build/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.*.local

# IDE and editor files
.idea/
.vscode/
*.swp
*.swo
*~

# Operating System
.DS_Store
Thumbs.db

# Test coverage
coverage/

# Logs
logs/
*.log`;
};

const getPackageTemplate = (options: TemplateOptions) => {
  return {
    name: options.projectName,
    version: '1.0.0',
    description: 'A modern Node.js backend application',
    main: 'dist/index.js',
    scripts: {
      start: 'node dist/index.js',
      dev: 'ts-node-dev --respawn src/index.ts',
      build: 'tsc',
      lint: 'eslint . --ext .ts',
      test: 'jest',
      'test:coverage': 'jest --coverage'
    }
  };
};

const getTsConfigTemplate = () => {
  return {
    compilerOptions: {
      target: 'ES2020',
      module: 'commonjs',
      lib: ['ES2020'],
      outDir: './dist',
      rootDir: './src',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      moduleResolution: 'node',
      resolveJsonModule: true,
      baseUrl: '.',
      paths: {
        '@/*': ['src/*']
      }
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist', '**/*.test.ts']
  };
};

const getEslintTemplate = () => {
  return {
    parser: '@typescript-eslint/parser',
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended'
    ],
    plugins: ['@typescript-eslint'],
    env: {
      node: true,
      es6: true,
      jest: true
    },
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module'
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  };
};

const getPrettierTemplate = () => {
  return {
    semi: true,
    trailingComma: 'es5',
    singleQuote: true,
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    bracketSpacing: true,
    arrowParens: 'avoid',
    endOfLine: 'lf'
  };
}; 