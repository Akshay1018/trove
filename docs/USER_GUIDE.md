# Trove CLI User Guide

## User Interaction Flow

### 1. Installation
```bash
# Global installation (recommended)
npm install -g trove-cli

# Or using npx directly
npx trove-cli@latest
```

### 2. Project Creation
```bash
# Interactive mode
trove create my-app

# Or with specific options
trove create my-app --framework fastify --database mongodb --auth oauth
```

#### Interactive Prompts
1. **Project Name** (if not provided in command)
   ```
   ? Enter your project name: my-app
   ```

2. **Framework Selection**
   ```
   ? Select a framework:
   ❯ Fastify
     Express
     NestJS
     Koa
   ```

3. **Database Selection**
   ```
   ? Select a database:
   ❯ MongoDB
     PostgreSQL
     MySQL
   ```

4. **Authentication Method**
   ```
   ? Select authentication method:
   ❯ JWT
     Session
     OAuth (Google + GitHub)
   ```

5. **CI/CD Platform** (Optional)
   ```
   ? Select CI/CD platform:
   ❯ GitHub Actions
     GitLab CI
     Bitbucket Pipelines
     None
   ```

### 3. Configuration
After project creation, you'll need to:

1. **Set Environment Variables**
   ```bash
   cd my-app
   cp .env.example .env
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   - Follow database-specific setup in `README.md`
   - Run migrations/seeds if applicable

4. **OAuth Setup** (if selected)
   - Create OAuth applications in Google/GitHub
   - Update credentials in `.env`

5. **CI/CD Setup** (if selected)
   - Configure repository secrets
   - Enable CI/CD in your platform
   - Review and customize CI/CD templates

### 4. Development
```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Generated Project Structure

```
my-app/
├── src/
│   ├── config/                 # Configuration files
│   │   ├── database.ts        # Database configuration
│   │   ├── auth.ts           # Authentication configuration
│   │   └── app.ts            # Application configuration
│   │
│   ├── controllers/           # Route controllers
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   │
│   ├── models/               # Database models
│   │   └── user.model.ts
│   │
│   ├── middleware/           # Custom middleware
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── routes/              # Route definitions
│   │   ├── auth.routes.ts
│   │   └── user.routes.ts
│   │
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   │
│   ├── utils/              # Utility functions
│   │   ├── logger.ts
│   │   └── validators.ts
│   │
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   │
│   └── app.ts             # Application entry point
│
├── tests/                 # Test files
│   ├── unit/
│   ├── integration/
│   └── setup.ts
│
├── .github/              # GitHub specific files
│   └── workflows/        # GitHub Actions workflows
│       └── ci.yml
│
├── docs/                 # Documentation
│   ├── API.md
│   └── DEPLOYMENT.md
│
├── scripts/             # Build/deployment scripts
│   ├── build.sh
│   └── deploy.sh
│
├── .env.example        # Example environment variables
├── .eslintrc.json     # ESLint configuration
├── .prettierrc        # Prettier configuration
├── .gitignore        # Git ignore rules
├── Dockerfile        # Docker configuration
├── docker-compose.yml # Docker Compose configuration
├── jest.config.js   # Jest configuration
├── package.json     # Project dependencies
├── tsconfig.json   # TypeScript configuration
└── README.md       # Project documentation
```

## Key Features

1. **Type Safety**
   - Full TypeScript support
   - Type definitions for all modules
   - Type-safe database models

2. **Code Quality**
   - ESLint configuration
   - Prettier formatting
   - Git hooks (husky)
   - Jest testing setup

3. **Security**
   - Helmet integration
   - CORS configuration
   - Rate limiting
   - Environment variables management

4. **Development Experience**
   - Hot reload
   - Debug configurations
   - Comprehensive logging
   - API documentation

5. **Production Ready**
   - Docker support
   - CI/CD pipelines
   - Environment specific configs
   - Performance optimizations

## Common Commands

```bash
# Development
npm run dev         # Start development server
npm run lint        # Run ESLint
npm run format      # Format code with Prettier

# Testing
npm test           # Run all tests
npm run test:watch # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Building
npm run build      # Build for production
npm start          # Start production server

# Docker
docker-compose up  # Start with Docker
docker-compose up -d # Start in background
```

## Customization

Each generated component can be customized:

1. **Framework Configuration**
   - Update `src/config/app.ts`
   - Modify middleware in `src/middleware/`

2. **Database**
   - Adjust models in `src/models/`
   - Update database config in `src/config/database.ts`

3. **Authentication**
   - Modify auth flow in `src/controllers/auth.controller.ts`
   - Update auth config in `src/config/auth.ts`

4. **CI/CD**
   - Customize workflows in `.github/workflows/`
   - Adjust deployment scripts in `scripts/`

For detailed customization guides, refer to:
- [CI/CD Customization](../src/templates/ci/README.md)
- [Database Configuration](../docs/DATABASE.md)
- [Authentication Setup](../docs/AUTH.md) 