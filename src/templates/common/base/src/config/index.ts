import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), '.env') });

interface Config {
  env: string;
  port: number;
  host: string;
  apiPrefix: string;
  logLevel: string;
  cors: {
    origin: string;
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
<% if (database === 'mongodb') { %>
  mongodb: {
    uri: string;
  };
<% } else if (database === 'postgres') { %>
  postgres: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  };
<% } else if (database === 'mysql') { %>
  mysql: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  };
<% } %>
<% if (auth === 'jwt') { %>
  jwt: {
    secret: string;
    expiresIn: string;
  };
<% } else if (auth === 'session') { %>
  session: {
    secret: string;
    name: string;
  };
<% } else if (auth === 'oauth') { %>
  oauth: {
    google: {
      clientId: string;
      clientSecret: string;
    };
    github: {
      clientId: string;
      clientSecret: string;
    };
    callbackUrl: string;
  };
<% } %>
}

export const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || 'localhost',
  apiPrefix: process.env.API_PREFIX || '/api',
  logLevel: process.env.LOG_LEVEL || 'info',
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
<% if (database === 'mongodb') { %>
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/<%= projectName %>',
  },
<% } else if (database === 'postgres') { %>
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    database: process.env.POSTGRES_DB || '<%= projectName %>',
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
  },
<% } else if (database === 'mysql') { %>
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    database: process.env.MYSQL_DB || '<%= projectName %>',
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
  },
<% } %>
<% if (auth === 'jwt') { %>
  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
<% } else if (auth === 'session') { %>
  session: {
    secret: process.env.SESSION_SECRET || 'your-session-secret-key',
    name: process.env.SESSION_NAME || 'sid',
  },
<% } else if (auth === 'oauth') { %>
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
    callbackUrl: process.env.OAUTH_CALLBACK_URL || 'http://localhost:3000/auth/callback',
  },
<% } %>
}; 