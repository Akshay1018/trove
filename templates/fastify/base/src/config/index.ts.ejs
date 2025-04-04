import { config as dotenv } from 'dotenv';

// Load environment variables
dotenv();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  <% if (database === 'mongodb') { %>
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/<%= projectName %>',
  },
  <% } else if (database === 'postgresql') { %>
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || '<%= projectName %>',
  },
  <% } else if (database === 'mysql') { %>
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    database: process.env.MYSQL_DB || '<%= projectName %>',
  },
  <% } %>
  <% if (auth === 'jwt') { %>
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  <% } else if (auth === 'session') { %>
  session: {
    secret: process.env.SESSION_SECRET || 'your-secret-key',
  },
  <% } else if (auth === 'oauth') { %>
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
    },
  },
  <% } %>
}; 