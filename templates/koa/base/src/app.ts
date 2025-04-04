import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import { config } from './config';
import { errorHandler } from './middleware/error-handler';
import { routes } from './routes';

const app = new Koa();
const router = new Router();

// Middleware
app.use(helmet());
app.use(logger());
app.use(bodyParser());
app.use(errorHandler);

// Routes
routes(router);
app.use(router.routes());
app.use(router.allowedMethods());

// Error handling
app.on('error', (err, ctx) => {
  console.error('Server error:', err);
});

export { app }; 