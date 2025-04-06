import session from 'express-session';
import MongoStore from 'connect-mongo';
import { config } from '../config';

export const sessionMiddleware = session({
  secret: config.session.secret,
  name: config.session.name,
  cookie: {
    maxAge: config.session.maxAge,
    secure: config.env === 'production',
    httpOnly: true,
    sameSite: 'lax'
  },
  store: MongoStore.create({
    mongoUrl: config.database.url,
    ttl: config.session.maxAge / 1000, // Convert from ms to seconds
    crypto: {
      secret: config.session.secret
    }
  }),
  resave: false,
  saveUninitialized: false
}); 