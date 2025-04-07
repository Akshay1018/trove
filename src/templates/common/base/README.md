# <%= projectName %>

A modern Node.js backend application built with <%= framework %><% if (database !== 'skip') { %> and <%= database %><% } %>.

## Features

- **Framework**: <%= framework %> - <%= framework === 'express' ? 'Fast, unopinionated, minimalist web framework' : framework === 'koa' ? 'Modern & lightweight web framework' : framework === 'fastify' ? 'Fast and low overhead web framework' : 'Progressive Node.js framework for scalable apps' %>
<% if (database !== 'skip') { %>
- **Database**: <%= database %> - <%= database === 'mongodb' ? 'NoSQL database for modern apps' : database === 'postgres' ? 'Advanced open source SQL database' : 'Popular open source SQL database' %>
<% } %>
<% if (auth !== 'skip') { %>
- **Authentication**: <%= auth %> - <%= auth === 'jwt' ? 'JSON Web Token based authentication' : auth === 'session' ? 'Traditional session-based auth' : 'Social authentication (Google, GitHub, etc.)' %>
<% } %>
<% if (ci !== 'skip') { %>
- **CI/CD**: <%= ci %> - <%= ci === 'github' ? 'Modern CI/CD for GitHub' : ci === 'gitlab' ? 'Built-in CI/CD for GitLab' : 'Automated CI/CD pipelines' %>
<% } %>
- **TypeScript**: Enhanced type safety and developer experience
- **ESLint & Prettier**: Code quality and formatting
- **Jest**: Testing framework
- **API Documentation**: OpenAPI/Swagger
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan + Winston
- **Environment Variables**: dotenv for configuration
- **Error Handling**: Centralized error handling
- **Request Validation**: Input validation middleware
- **Hot Reloading**: Fast development with ts-node-dev

## Prerequisites

- Node.js >= 18
- <%= database === 'mongodb' ? 'MongoDB' : database === 'postgres' ? 'PostgreSQL' : database === 'mysql' ? 'MySQL' : 'No database required' %>

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/<%= projectName %>.git
   cd <%= projectName %>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Lint code with ESLint
- `npm run lint:fix` - Fix linting errors
- `npm run format` - Format code with Prettier

## Project Structure

```
<%= projectName %>/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/        # Database models
│   ├── routes/        # Route definitions
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript type definitions
│   ├── app.ts         # Express/Fastify/Koa/NestJS app
│   └── index.ts       # Application entry point
├── tests/
│   ├── unit/          # Unit tests
│   └── integration/   # Integration tests
├── .env.example       # Example environment variables
├── .eslintrc.json    # ESLint configuration
├── .prettierrc       # Prettier configuration
├── jest.config.js    # Jest configuration
├── package.json      # Dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```

## API Documentation

Once the server is running, you can access the API documentation at:
- Development: http://localhost:3000/docs
- Production: https://your-domain.com/docs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 