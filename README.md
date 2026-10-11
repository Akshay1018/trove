# Trove CLI

A powerful and flexible CLI tool for creating modern Node.js backend applications with best practices baked in.

[![npm version](https://badge.fury.io/js/trove-cli.svg)](https://badge.fury.io/js/trove-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

## 📋 Prerequisites

Before using Trove CLI, ensure you have the following installed on your system:

- **Node.js** (v16.x or higher)
- **npm** (v8.x or higher) or **yarn** (v1.22.x or higher)
- **Git** (v2.x or higher)
- **Docker** (optional, v20.x or higher) - Required for containerization
- **Database Engines** (based on your selection):
  - MongoDB (v4.4.x or higher)
  - PostgreSQL (v12.x or higher)
  - MySQL (v8.x or higher)

To verify your installations:
```bash
node --version
npm --version
git --version
docker --version  # if using Docker
```

### Database Setup Guides

If you haven't installed the required database engine yet, here are the installation guides for each supported database:

#### MongoDB
- **macOS**:
  ```bash
  # Using Homebrew
  brew tap mongodb/brew
  brew install mongodb-community
  brew services start mongodb-community
  ```
- **Windows**: [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
- **Linux (Ubuntu)**:
  ```bash
  # Import MongoDB public key
  wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
  # Create list file for MongoDB
  echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
  # Install MongoDB
  sudo apt-get update
  sudo apt-get install -y mongodb-org
  sudo systemctl start mongod
  ```
- **Docker**:
  ```bash
  docker run -d -p 27017:27017 --name mongodb mongo:latest
  ```
- [Official MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

#### PostgreSQL
- **macOS**:
  ```bash
  # Using Homebrew
  brew install postgresql
  brew services start postgresql
  ```
- **Windows**: [Download PostgreSQL Installer](https://www.postgresql.org/download/windows/)
- **Linux (Ubuntu)**:
  ```bash
  sudo apt update
  sudo apt install postgresql postgresql-contrib
  sudo systemctl start postgresql
  ```
- **Docker**:
  ```bash
  docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=yourpassword --name postgres postgres:latest
  ```
- [Official PostgreSQL Installation Guide](https://www.postgresql.org/download/)

#### MySQL
- **macOS**:
  ```bash
  # Using Homebrew
  brew install mysql
  brew services start mysql
  ```
- **Windows**: [Download MySQL Installer](https://dev.mysql.com/downloads/installer/)
- **Linux (Ubuntu)**:
  ```bash
  sudo apt update
  sudo apt install mysql-server
  sudo systemctl start mysql
  ```
- **Docker**:
  ```bash
  docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=yourpassword --name mysql mysql:latest
  ```
- [Official MySQL Installation Guide](https://dev.mysql.com/doc/refman/8.0/en/installing.html)

### Database GUI Tools (Optional)
- MongoDB: [MongoDB Compass](https://www.mongodb.com/products/compass)
- PostgreSQL: [pgAdmin](https://www.pgadmin.org/download/)
- MySQL: [MySQL Workbench](https://www.mysql.com/products/workbench/)
- Multi-Database: [DBeaver Community](https://dbeaver.io/)

---

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

---

## 🚀 Features

### Core Framework & Database Support
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

### 🧠 AI-Native & Agentic Features
Trove is evolving beyond a traditional scaffolding tool into an AI-ready backend platform.

- **Natural-Language Project Planning**
  - Describe the backend you want in plain English
  - Trove can convert requirements into a structured project plan
  - Framework, database, and auth recommendations are grounded in real supported capabilities

- **AI-Assisted Stack Recommendation**
  - Compatible stack suggestions based on project needs
  - Validation before generation to reduce unsupported combinations

- **Verified Project Generation**
  - Generate projects using deterministic templates
  - Run post-generation validation checks
  - Surface actual build/test results and failures

- **Self-Repair Workflow (Planned)**
  - Diagnose failing generated projects
  - Apply bounded fixes with approval-based safeguards
  - Improve first-pass reliability for generated apps

- **Model Context Protocol (MCP) Support (Planned)**
  - Make Trove usable from AI coding agents and MCP-compatible tools
  - Expose project-generation and validation capabilities via standard tools
  - Keep the CLI and agent workflows interoperable

- **Headless Generation API (Planned)**
  - Expose Trove capabilities via a programmatic interface
  - Integrate into automation and custom tooling
  - Support developer and AI workflows without requiring CLI interaction

### 🔐 Security & Reliability
- **Approval Gates for Sensitive Operations**
  - Require explicit confirmation before destructive or risky actions
- **Filesystem Safety Controls**
  - Limit write scope and protect sensitive project areas
- **Secret Redaction**
  - Keep credentials and environment values from leaking in logs
- **Production-Ready Security Templates**
  - Helmet configuration
  - Rate limiting
  - CORS policies
  - Input validation patterns

### 📚 Documentation & Developer Productivity
- **Context-Aware Documentation Generation**
  - Generate stack-aware README files
  - Produce OpenAPI/Swagger specs based on selected framework and routes
  - Generate environment configuration docs automatically
- **Automated Project Validation**
  - Lint, build, and test checks aligned with the generated stack
- **Better Developer Experience**
  - Reduced setup time
  - Cleaner project scaffolding
  - More reliable generated output

---

## ✨ What's New in Trove

Trove is moving toward a more modern AI-first backend generation experience while keeping the current CLI workflow reliable and easy to use.

### Recent Focus Areas
- AI-native backend planning using natural language
- Provider-agnostic AI planner and recommendation engine
- Programmatic generation API for headless workflows
- Native MCP server for AI coding agents
- Stronger approval and safety controls for automated operations
- Post-generation validation and bounded self-repair
- Context-aware documentation generation for stack-specific projects
- Improved security middleware and approval flows

### High-Impact Planned Capabilities
- Natural-language generation of full backend architecture plans
- AI-based compatibility validation before project creation
- Guidance for framework, database, and stack decisions
- Verified generation flow with validation feedback loops
- Safe automation boundaries for file writes, commands, and secrets
- Stack-aware project documentation generation

---

## 📦 Installation

### Option 1: Global Installation (Recommended)
```bash
# Using npm
npm install -g trove-cli

# Using yarn
yarn global add trove-cli

# Verify installation
trove --version
```

### Option 2: Local Project Installation
```bash
# Using npm
npm install trove-cli

# Using yarn
yarn add trove-cli

# Run using npx
npx trove create my-project
```

### Option 3: Direct Use Without Installation
```bash
# Using npx
npx trove-cli create my-project

# Using yarn
yarn dlx trove-cli create my-project
```

After installation, you might need to configure:
1. Database connection settings
2. OAuth credentials (if using social authentication)
3. Environment variables

---

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

---

## 📖 Usage Guide

### Creating a New Project

```bash
trove create <project-name> [options]
```

#### Options

- `--framework`: Specify the framework (express, koa, nest, fastify)
- `--database`: Choose database integration (mongodb, postgres, mysql)
- `--auth`: Select authentication method (jwt, session, oauth)
- `--skip-git`: Skip git initialization
- `--skip-install`: Skip package installation
- `--skip-tests`: Skip test setup
- `--skip-ci`: Skip CI/CD setup

### Example Setup

```bash
trove create my-api --framework nest --database postgres --auth jwt --skip-install
```

### Project Structure

```text
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

---

## 🧪 Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Testing & Quality Roadmap
- Executable integration test templates
- End-to-end test scaffolds
- Production-grade validation workflows
- Security and performance benchmarking

---

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

---

## 📚 API Documentation

API documentation is automatically generated using Swagger/OpenAPI. Access it at:

```text
http://localhost:3000/api-docs
```

### Documentation Roadmap
- Stack-aware README generation
- OpenAPI spec generation based on project config
- Environment variable documentation
- Better API docs for generated projects

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Clone the repository
2. Install dependencies
3. Run in development mode

```bash
git clone https://github.com/Akshay1018/trove.git
cd trove
npm install
npm run dev
```

---

## 📞 Support

- GitHub Issues: [Report a bug](https://github.com/Akshay1018/trove/issues)
- Email: ak715173@gmail.com

<!-- - Documentation: [Full documentation](https://github.com/Akshay1018/trove/wiki) -->

---

## 🗺️ Roadmap

### Framework Support
- [ ] Fastify
- [ ] Koa
- [ ] Hapi
- [ ] Advanced NestJS features

### Database Support
- [ ] Advanced PostgreSQL features
- [ ] Advanced MySQL features
- [ ] Redis
- [ ] SQLite
- [ ] Database migration tools
- [ ] Connection pooling optimization

### AI & Agentic Features
- [ ] Natural-language project requirements
- [ ] AI-assisted framework and database recommendations
- [ ] Provider-agnostic AI planner
- [ ] AI command for interactive project planning (`trove ai`)
- [ ] Post-generation validation and self-repair
- [ ] Model Context Protocol (MCP) server support
- [ ] Programmatic headless generation API
- [ ] Capability registry and config validator

### Security Enhancements
- [ ] Advanced Rate Limiting
  - IP-based rate limiting
  - Custom rate limit rules
  - Redis-backed rate limiting
- [ ] Authentication Improvements
  - Two-factor authentication (2FA)
  - OAuth 2.0 social login providers
  - Hardware security key support
  - Passwordless authentication
- [ ] Security Headers & Policies
  - Advanced Helmet configuration
  - Content Security Policy (CSP)
  - CORS policy templates
  - HTTP security headers
- [ ] API Security
  - API key authentication
  - JWT refresh token rotation
  - Request payload validation
  - Input sanitization
- [ ] Monitoring & Protection
  - Brute force protection
  - SQL injection prevention
  - XSS protection
  - CSRF protection
  - Security audit tools
- [ ] Filesystem sandboxing and approval gates
- [ ] Secret redaction and safe logging

### Documentation & Observability
- [ ] Context-aware README generation
- [ ] Stack-aware OpenAPI specification generation
- [ ] Environment documentation generation
- [ ] Structured logging
- [ ] Log aggregation
- [ ] Prometheus metrics
- [ ] Grafana dashboards
- [ ] OpenTelemetry integration
- [ ] Distributed tracing
- [ ] Performance profiling
- [ ] Error tracking

### Developer Experience
- [ ] Enhanced CLI Features
  - Interactive project visualization
  - Custom template support
  - Plugin system
  - Template hot reload
- [ ] Documentation
  - Swagger/OpenAPI integration
  - Automated API documentation
  - JSDoc generation
  - Markdown documentation
- [ ] Development Tools
  - VS Code extensions
  - Development containers
  - Hot reload improvements
  - Debug configurations

### Testing & Quality
- [ ] Testing Frameworks
  - E2E testing templates
  - Load testing setup
  - Security testing
  - Integration testing
- [ ] Code Quality
  - Stricter TypeScript configs
  - Advanced ESLint rules
  - Code coverage requirements
  - Performance benchmarks

### Monitoring & Observability
- [ ] Logging & Monitoring
  - Structured logging
  - Log aggregation
  - Prometheus metrics
  - Grafana dashboards
- [ ] Tracing & Debugging
  - OpenTelemetry integration
  - Distributed tracing
  - Performance profiling
  - Error tracking

### DevOps & Deployment
- [ ] Container Support
  - Multi-stage Dockerfiles
  - Docker Compose templates
  - Kubernetes manifests
  - Container optimization
- [ ] Cloud Integration
  - AWS deployment templates
  - Azure deployment guides
  - GCP configuration
  - Serverless support
- [ ] CI/CD Improvements
  - Advanced pipeline templates
  - Multi-environment support
  - Automated releases
  - Infrastructure as Code

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you! 