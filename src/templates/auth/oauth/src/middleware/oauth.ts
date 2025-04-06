import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { config } from '../config';

// Configure Google Strategy
passport.use(new GoogleStrategy({
  clientID: config.oauth.google.clientId,
  clientSecret: config.oauth.google.clientSecret,
  callbackURL: config.oauth.google.callbackUrl,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Handle user data from profile
    const user = {
      id: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      provider: 'google'
    };
    return done(null, user);
  } catch (error) {
    return done(error as Error);
  }
}));

// Configure GitHub Strategy
passport.use(new GitHubStrategy({
  clientID: config.oauth.github.clientId,
  clientSecret: config.oauth.github.clientSecret,
  callbackURL: config.oauth.github.callbackUrl,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Handle user data from profile
    const user = {
      id: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      provider: 'github'
    };
    return done(null, user);
  } catch (error) {
    return done(error as Error);
  }
}));

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}; 