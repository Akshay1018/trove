# <%= projectName %>

A Node.js backend application built with Express.js and TypeScript.

## Features

- Express.js with TypeScript
- MongoDB with Mongoose
- Session-based authentication
- Error handling middleware
- Request logging with Morgan
- Security headers with Helmet
- CORS support
- Compression middleware
- ESLint and Prettier for code formatting
- Jest for testing
- Hot reloading with Nodemon

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <%= projectName %>
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/<%= projectName %>
   SESSION_SECRET=your-session-secret
   SESSION_NAME=sid
   SESSION_MAX_AGE=86400000
   ```

## Development

Start the development server with hot reloading:
```bash
npm run dev
# or
yarn dev
```

## Testing

Run the test suite:
```bash
npm test
# or
yarn test
```

## Building for Production

Build the application:
```bash
npm run build
# or
yarn build
```

Start the production server:
```bash
npm start
# or
yarn start
```

## Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build the application
- `npm start` - Start the production server
- `npm test` - Run the test suite
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── __tests__/     # Test files
├── config/        # Configuration files
├── middleware/    # Express middleware
├── routes/        # API routes
├── app.ts         # Express app setup
└── index.ts       # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 