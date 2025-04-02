import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
<% if (auth === 'session') { %>import session from 'koa-session';<% } %>
<% if (auth === 'oauth') { %>import passport from 'koa-passport';<% } %>
import { config } from './config';
import { errorHandler } from './middleware/error.middleware';
import { healthRoutes } from './routes/health.routes';
<% if (auth) { %>import { authRoutes } from './routes/auth.routes';<% } %>

const app = new Koa();
const router = new Router();

// Middleware
app.use(cors());
app.use(bodyParser());
app.use(logger());
app.use(errorHandler);

<% if (auth === 'session') { %>
// Session configuration
app.keys = [config.session.secret];
app.use(session(app));
<% } %>

<% if (auth === 'oauth') { %>
// Passport configuration
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());
<% } %>

// Routes
router.use('/api/health', healthRoutes.routes());
<% if (auth) { %>router.use('/api/auth', authRoutes.routes());<% } %>

// Register routes
app.use(router.routes()).use(router.allowedMethods());

// Start server
const port = config.port;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}); 