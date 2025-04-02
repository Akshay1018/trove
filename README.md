# Trove CLI

A powerful and flexible CLI tool for creating modern Node.js backend applications with best practices baked in.

[![npm version](https://badge.fury.io/js/trove-cli.svg)](https://badge.fury.io/js/trove-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

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

## 🔧 Configuration

### Environment Variables

\`\`\`env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=27017
DB_NAME=myapp
DB_USER=root
DB_PASSWORD=secret

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
\`\`\`

### Database Configuration

Example TypeORM configuration (\`src/config/database.ts\`):

\`\`\`typescript
import { DataSourceOptions } from 'typeorm';

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  synchronize: process.env.NODE_ENV === 'development',
};
\`\`\`

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

\`\`\`yaml
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
\`\`\`

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by best practices from various Node.js frameworks
- Built with TypeScript and modern JavaScript features

## 🔍 Troubleshooting

Common issues and their solutions:

### Installation Issues

...

### Database Connection Issues

...

### Authentication Problems

...

## 📞 Support

- GitHub Issues: [Report a bug](https://github.com/yourusername/trove-cli/issues)
- Email: support@trovecli.dev
- Documentation: [Full documentation](https://trovecli.dev/docs)

## 🗺️ Roadmap

- [ ] Additional framework support
- [ ] GraphQL integration
- [ ] Microservices templates
- [ ] Kubernetes deployment configurations
- [ ] Plugin system
- [ ] Custom template support

## ⭐ Show Your Support

Give a ⭐️ if this project helped you! 