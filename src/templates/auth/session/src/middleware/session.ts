import { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { config } from '../config';

export const sessionMiddleware = session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.env === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
});

export interface SessionRequest extends Request {
  session: any;
}

export const authenticate = (req: SessionRequest, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}; 