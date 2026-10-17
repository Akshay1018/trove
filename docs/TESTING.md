# Testing Generated Projects

Trove-generated projects use Jest for automated tests and Supertest for HTTP
integration tests where supported by the selected framework.

## Run the tests

Install dependencies and run the generated project's test suite:

```bash
npm install
npm test
npm run test:coverage
```

Run tests in watch mode during development:

```bash
npm run test:watch
```

Jest configuration lives in `jest.config.js`. Integration test templates live
under the selected framework's `src/__tests__/integration` directory.

## What integration tests should cover

Framework integration tests should verify:

- The health endpoint returns a successful response.
- An unknown route returns a 404 response.
- Representative API routes handle expected requests and errors.
- Protected routes reject unauthenticated requests when authentication is enabled.

Authentication tests must only be generated when authentication is enabled.
Their routes and expected responses must match the selected authentication
provider and framework.

## Database-backed tests

HTTP integration tests should run without a local database or production
credentials. Database-backed tests must be opt-in and use a dedicated test
database configured through environment variables.

Never point tests at production data. Use isolated test records or a disposable
test database, clean up created data, and close database connections after tests.

Do not commit credentials or real `.env` files. Use documented environment
variable names and safe example values.

## Generate without tests

Use the CLI's `--skip-tests` option when creating a project to omit test files
and Jest configuration. The generated package should also omit test scripts
and test-only dependencies.

After generation, inspect `package.json` and the generated files to confirm
that test assets were excluded.
