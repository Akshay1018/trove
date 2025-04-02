# Trove CLI

A powerful and flexible CLI tool for creating modern Node.js backend applications with best practices baked in.

[![npm version](https://badge.fury.io/js/trove-cli.svg)](https://badge.fury.io/js/trove-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

## 🌟 Why Trove CLI?

### Streamlined Development Experience

Traditional backend development often involves:
- Manually installing and configuring numerous dependencies
- Setting up project structure from scratch
- Writing boilerplate code for common features
- Spending hours configuring CI/CD pipelines
- Dealing with compatibility issues between different tools

Trove CLI eliminates these pain points by providing:

#### 1. **Zero-Config CI/CD Setup**
- Instant pipeline generation for popular platforms
- Pre-configured workflows for build, test, and deployment
- No need to write YAML files manually
- Built-in best practices for each CI platform
- Automated secret management instructions

#### 2. **Smart Template System**
- Lightweight yet feature-complete templates
- Only essential dependencies included
- No bloated node_modules
- Framework-specific optimizations
- Easy to extend and customize

#### 3. **Time-Saving Features**
- 15+ minutes saved on CI/CD configuration
- 30+ minutes saved on initial project setup
- Pre-configured testing environment
- Ready-to-use authentication systems
- Database integration with best practices

#### 4. **Developer-Friendly Choices**
- Skip what you don't need (database, auth, tests, CI/CD)
- Mix and match frameworks with databases
- Custom configuration options
- Extensible project structure
- Modern tooling out of the box

Here's a quick comparison:

| Feature | Manual Setup | Trove CLI |
|---------|-------------|----------|
| Initial Setup Time | 1-2 hours | 5 minutes |
| CI/CD Configuration | 30-60 minutes | 2 minutes |
| Boilerplate Code | Manual writing | Auto-generated |
| Best Practices | Manual research | Built-in |
| Dependencies | Manual selection | Curated selection |
| Configuration Files | Manual creation | Auto-generated |
| Learning Curve | Steep | Gentle | 

### Real-World Time Saving Example

**Scenario: Setting up a NestJS API with PostgreSQL and GitHub Actions CI/CD**

**Traditional Setup (90-120 minutes):**
1. Create NestJS project (10 mins)
2. Configure TypeORM & PostgreSQL (20 mins)
   - Install dependencies
   - Create configuration
   - Set up entities
   - Configure migrations
3. Set up authentication (25 mins)
   - Install JWT packages
   - Create auth module
   - Configure guards
4. Configure GitHub Actions (35 mins)
   - Research best practices
   - Write YAML configuration
   - Set up environment secrets
   - Configure test database
5. Configure Docker (20 mins)
   - Write Dockerfile
   - Create docker-compose
   - Configure environment

**With Trove CLI (5 minutes):**
```bash
trove create my-nest-api
# Interactive prompts:
# 1. Select NestJS ✓
# 2. Choose PostgreSQL ✓
# 3. Select JWT auth ✓
# 4. Choose GitHub Actions ✓
# Done! 🚀
```

Everything is set up with best practices, including:
- Optimized TypeORM configuration
- JWT authentication with refresh tokens
- GitHub Actions workflow with caching
- Production-ready Dockerfile
- Automatic database migrations
- Pre-configured test environment

### Key Differentiator: CI/CD Excellence

While other CLIs focus on just scaffolding, Trove CLI excels in CI/CD automation:

| Feature | Other CLIs | Trove CLI |
|---------|------------|-----------|
| CI/CD Setup | Manual or basic templates | Complete pipeline generation with:<br>- Multi-stage workflows<br>- Caching strategies<br>- Secret management<br>- Environment configurations<br>- Docker integration<br>- Automated testing<br>- Database migrations |

## 🚀 Features

- **Multiple Framework Support**
  - Express.js
  - Koa.js
  - NestJS
  - Fastify

- **Database Integration**
  - MongoDB with Mongoose
  - PostgreSQL with TypeORM
  - MySQL with TypeORM

- **Authentication Options**
  - JWT Authentication
  - Session-based Authentication
  - OAuth 2.0 Integration

- **CI/CD Pipeline Generation**
  - GitHub Actions
  - GitLab CI
  - Bitbucket Pipelines
  - (Coming Soon: Azure DevOps, CircleCI, Jenkins)

- **Developer Experience**
  - TypeScript Support
  - ESLint + Prettier Configuration
  - Jest Testing Setup
  - Swagger/OpenAPI Documentation
  - Hot Reload Development
  - Docker Support

## 📦 Installation

```bash
npm install -g trove-cli
# or
yarn global add trove-cli
```

## 🛠️ Quick Start

Create a new backend application:

```bash
trove create my-awesome-api
```

Follow the interactive prompts to configure your project:
1. Select your preferred framework
2. Choose database integration
3. Configure authentication method
4. Set up CI/CD pipeline

## 📖 Usage Guide

### Creating a New Project

```bash
trove create <project-name> [options]
```

#### Options

- \`--framework\`: Specify the framework (express, koa, nest, fastify)
- \`--database\`: Choose database integration (mongodb, postgres, mysql)
- \`--auth\`: Select authentication method (jwt, session, oauth)
- \`--skip-git\`: Skip git initialization
- \`--skip-install\`: Skip package installation
- \`--skip-tests\`: Skip test setup
- \`--skip-ci\`: Skip CI/CD setup

### Project Structure

```
my-awesome-api/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   └── app.ts
├── tests/
├── docker/
├── .github/
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 🧪 Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## 🚢 Deployment

### Docker Support

Build the Docker image:

```bash
docker build -t my-awesome-api .
```

Run the container:

```bash
docker run -p 3000:3000 my-awesome-api
```

### CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
```

## 📚 API Documentation

API documentation is automatically generated using Swagger/OpenAPI. Access it at:

```
http://localhost:3000/api-docs
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Clone the repository
2. Install dependencies
3. Run in development mode

```bash
git clone https://github.com/yourusername/trove-cli.git
cd trove-cli
npm install
npm run dev
```

## 📞 Support

- GitHub Issues: [Report a bug](https://github.com/Akshay1018/trove/issues)
- Email: ak715173@gmail.com
<!-- - Documentation: [Full documentation](https://trovecli.dev/docs) -->

## 🗺️ Roadmap

- [ ] Additional framework support
- [ ] GraphQL integration
- [ ] Microservices templates
- [ ] Kubernetes deployment configurations
- [ ] Plugin system
- [ ] Custom template support

## ⭐ Show Your Support

Give a ⭐️ if this project helped you! 