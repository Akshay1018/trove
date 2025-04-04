# Create Node Backend

A powerful and flexible CLI tool for creating modern Node.js backend applications with best practices and CI/CD pipelines baked in.

## Features

- 🚀 Multiple Framework Support (Express, Koa, NestJS, Fastify)
- 📦 Database Integration (MongoDB, PostgreSQL, MySQL)
- 🔐 Authentication Methods (JWT, Session, OAuth)
- 🛠️ TypeScript Configuration
- 📝 ESLint & Prettier Setup
- 🧪 Testing Setup with Jest
- 🔄 CI/CD Pipeline Templates
- 📊 Logging & Error Handling
- 📚 API Documentation (Swagger/OpenAPI)

## Roadmap and Testing Status

### Frameworks
- [x] Express.js - Tested with basic routing, middleware, and error handling
- [x] Koa.js - Tested with basic routing, middleware, and error handling
- [ ] NestJS - Pending implementation and testing
- [ ] Fastify - Pending implementation and testing

### Databases
- [x] MongoDB - Tested with basic CRUD operations
- [x] PostgreSQL - Tested with basic CRUD operations
- [ ] MySQL - Pending implementation and testing
- [x] No Database - Tested skip option

### Authentication
- [x] JWT - Tested with register, login, and protected routes
- [ ] Session-based - Pending implementation and testing
- [ ] OAuth (Google, GitHub) - Pending implementation and testing
- [x] No Auth - Tested skip option

### Core Features
- [x] Project Structure Generation
- [x] Environment Variables Setup
- [x] TypeScript Configuration
- [x] ESLint + Prettier Setup
- [x] Jest Configuration
- [ ] Swagger/OpenAPI Documentation
- [ ] Docker Configuration
- [ ] CI/CD Templates
- [ ] Rate Limiting
- [ ] CORS Configuration
- [ ] API Versioning
- [ ] Database Migrations
- [ ] Seeding
- [ ] Caching
- [ ] WebSocket Support
- [ ] File Upload
- [ ] Email Service Integration
- [ ] Logging Service Integration
- [ ] Monitoring Setup
- [ ] Health Checks
- [ ] API Documentation
- [ ] Security Headers
- [ ] Input Validation
- [ ] Error Handling
- [ ] Request ID Tracking
- [ ] Performance Monitoring
- [ ] Automated Testing
  - [ ] Unit Tests
  - [ ] Integration Tests
  - [ ] E2E Tests
- [ ] Development Tools
  - [ ] Hot Reload
  - [ ] Debug Configuration
  - [ ] VS Code Settings
  - [ ] Git Hooks

## Quick Start

```bash
# Install the CLI globally
npm install -g create-node-backend-temp

# Create a new backend project
create-backend-app create my-app

# Navigate to project directory
cd my-app

# Install dependencies
npm install

# Start development server
npm run dev
```

## Available Commands

After creating your project, you can run:

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run test     # Run tests
npm run lint     # Lint code
npm run format   # Format code
```

## Framework Options

Choose from multiple frameworks:

- **Express.js** - Fast, unopinionated, minimalist web framework
- **Koa.js** - Modern & lightweight web framework
- **NestJS** - Progressive Node.js framework for scalable apps
- **Fastify** - Fast and low overhead web framework

## Database Options

Integrate with your preferred database:

- **MongoDB** - NoSQL database for modern apps
- **PostgreSQL** - Advanced open source SQL database
- **MySQL** - Popular open source SQL database

## Authentication Options

Secure your application with:

- **JWT** - JSON Web Token based authentication
- **Session** - Traditional session-based auth
- **OAuth** - Social authentication (Google, GitHub, etc.)

## Project Structure

```
my-app/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── tests/             # Test files
├── .env              # Environment variables
├── .eslintrc        # ESLint configuration
├── .prettierrc      # Prettier configuration
├── jest.config.js   # Jest configuration
├── package.json     # Dependencies and scripts
└── tsconfig.json    # TypeScript configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Akshay Kumar](https://github.com/Akshay1018)

---
**Note:** This is a temporary package name for testing. The package will be renamed to `trove-cli` in the final release. 