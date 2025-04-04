# <%= projectName %>

A modern Koa.js application with TypeScript, PostgreSQL, and best practices.

## Features

- Koa.js with TypeScript
- PostgreSQL with Sequelize ORM
- JWT Authentication
- Error handling middleware
- Request logging with koa-logger
- Structured logging with Winston
- Environment variables with dotenv
- ESLint and Prettier for code formatting
- Jest for testing
- Hot reloading with nodemon

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL (v14 or higher)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Start production server:
```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Check code style
- `npm run lint:fix` - Fix code style issues
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── index.ts        # Application entry point
```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/users` - Get all users (protected)
- `GET /api/users/:id` - Get user by ID (protected)

## Environment Variables

| Variable      | Description              | Default               |
|--------------|-------------------------|----------------------|
| PORT         | Server port             | 3000                 |
| NODE_ENV     | Environment            | development          |
| DB_HOST      | Database host          | localhost            |
| DB_PORT      | Database port          | 5432                 |
| DB_USER      | Database user          | postgres             |
| DB_PASSWORD  | Database password      | postgres             |
| DB_NAME      | Database name          | test-project         |
| JWT_SECRET   | JWT signing secret     | -                    |
| LOG_LEVEL    | Logging level          | info                 |

## Error Handling

The application includes centralized error handling with custom error classes and middleware. All errors are properly logged using Winston logger.

## Authentication

JWT-based authentication is implemented with the following features:
- Password hashing using bcrypt
- JWT token generation and verification
- Protected routes using authentication middleware

## Development

### Code Style

This project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

### Testing

Tests are written using Jest and include:
- Unit tests for utilities and services
- Integration tests for API endpoints
- Test coverage reporting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 