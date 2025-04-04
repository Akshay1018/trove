# <%= projectName %>

A modern Koa.js API with TypeScript<% if (database !== 'skip') { %>, <%= database %> database<% } %><% if (auth !== 'skip') { %>, and <%= auth %> authentication<% } %>.

## Features

- [Koa.js](https://koajs.com/) - A lightweight and expressive web framework for Node.js
- [TypeScript](https://www.typescriptlang.org/) - Type safety and modern JavaScript features
<% if (database === 'postgres') { %>- [PostgreSQL](https://www.postgresql.org/) - Powerful, open source object-relational database<% } else if (database === 'mongodb') { %>- [MongoDB](https://www.mongodb.com/) - NoSQL database for modern applications<% } %>
<% if (auth === 'jwt') { %>- [JWT Authentication](https://jwt.io/) - JSON Web Token based authentication<% } else if (auth === 'passport') { %>- [Passport.js](http://www.passportjs.org/) - Simple, unobtrusive authentication<% } %>
- [Winston](https://github.com/winstonjs/winston) - A logger for just about everything
- [Jest](https://jestjs.io/) - Delightful JavaScript Testing Framework
- [ESLint](https://eslint.org/) - Pluggable JavaScript linter
- [Prettier](https://prettier.io/) - Opinionated Code Formatter

## Prerequisites

- Node.js >= 18
- npm >= 9
<% if (database === 'postgres') { %>- PostgreSQL >= 14<% } else if (database === 'mongodb') { %>- MongoDB >= 6<% } %>

## Getting Started

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/<%= projectName %>.git
cd <%= projectName %>
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:

\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

4. Start the development server:

\`\`\`bash
npm run dev
\`\`\`

The API will be available at \`http://localhost:3000\`.

## Available Scripts

- \`npm run dev\` - Start the development server with hot reload
- \`npm run build\` - Build the project for production
- \`npm start\` - Start the production server
- \`npm test\` - Run tests
- \`npm run test:watch\` - Run tests in watch mode
- \`npm run test:coverage\` - Run tests with coverage report
- \`npm run lint\` - Check for linting errors
- \`npm run lint:fix\` - Fix linting errors
- \`npm run format\` - Format code with Prettier

## API Endpoints

### Health Check

- \`GET /health\` - Check API health

### Examples

- \`GET /examples\` - Get all examples
- \`GET /examples/:id\` - Get example by ID
- \`POST /examples\` - Create new example
- \`PUT /examples/:id\` - Update example by ID
- \`DELETE /examples/:id\` - Delete example by ID

## Project Structure

\`\`\`
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # Route definitions
├── utils/          # Utility functions
└── index.ts        # Application entry point
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 