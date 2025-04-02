# Create Backend App

A powerful CLI tool to create backend applications with various frameworks and configurations.

## Features

- Multiple framework support (Express.js, NestJS, Fastify, Koa)
- Database integration (MongoDB, PostgreSQL, MySQL)
- Authentication methods (JWT, Session, OAuth)
- TypeScript support out of the box
- Best practices and project structure
- Automated dependency installation

## Installation

```bash
npm install -g create-backend-app
```

## Usage

```bash
# Interactive mode
create-backend-app create my-app

# With options
create-backend-app create my-app --framework express --database mongodb --auth jwt
```

## Available Options

- `--framework`: Choose between express, nest, fastify, or koa
- `--database`: Choose between mongodb, postgresql, or mysql
- `--auth`: Choose between jwt, session, or oauth

## Project Structure

The generated project follows best practices and includes:

- TypeScript configuration
- Environment configuration
- Testing setup (Jest)
- Linting and formatting (ESLint + Prettier)
- Git initialization
- Documentation
- Basic CRUD operations
- Authentication setup
- Database connection
- Error handling
- Request validation
- Logging

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Link the package: `npm link`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT 