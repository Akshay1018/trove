import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/not-found.middleware';
import { routes } from './routes';
import { logger } from './utils/logger';
<% if (database === 'mongodb') { %>import { connectDB } from './config/database';<% } %>
<% if (auth === 'session') { %>import session from 'express-session';<% } %>
<% if (auth === 'oauth') { %>import passport from 'passport';
import './config/passport';<% } %>

// Load environment variables
config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

<% if (auth === 'session') { %>
// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
<% } %>

<% if (auth === 'oauth') { %>
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
<% } %>

// Routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    <% if (database === 'mongodb') { %>
    // Connect to MongoDB
    await connectDB();
    logger.info('Connected to MongoDB');
    <% } %>

    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 