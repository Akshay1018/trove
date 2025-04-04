import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import dotenv from 'dotenv';
import { logger as winston } from './utils/logger';
import { errorHandler } from './middleware/error-handler';
import { router as indexRouter } from './routes';

import { connectDatabase } from './config/database';


// Load environment variables
dotenv.config();

const app = new Koa();
const router = new Router();

// Middleware
app.use(bodyParser());
app.use(helmet());
app.use(logger());
app.use(errorHandler);

// Routes
app.use(indexRouter.routes());
app.use(indexRouter.allowedMethods());

// Error handling
app.on('error', (err, ctx) => {
  winston.error('Server error:', err);
});

const port = process.env.PORT || 3000;

async function start() {
  try {
    
    // Connect to database
    await connectDatabase();
    

    app.listen(port, () => {
      winston.info(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    winston.error('Failed to start server:', error);
    process.exit(1);
  }
}

start(); 