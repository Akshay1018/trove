import { Dependencies } from '../../types/package-manager';

export const jwtDependencies: Dependencies = {
  dependencies: {
    '@nestjs/jwt': '^10.2.0',
    '@nestjs/passport': '^10.0.2',
    'passport-jwt': '^4.0.1',
    'bcryptjs': '^2.4.3',
    'passport': '^0.7.0'
  },
  devDependencies: {
    '@types/passport-jwt': '^4.0.0',
    '@types/bcryptjs': '^2.4.6'
  }
};

export const sessionDependencies: Dependencies = {
  dependencies: {
    '@nestjs/passport': '^10.0.2',
    'express-session': '^1.17.3',
    'passport': '^0.7.0',
    'connect-redis': '^7.1.1'
  },
  devDependencies: {
    '@types/express-session': '^1.17.10',
    '@types/passport': '^1.0.16'
  }
};

export const expressOAuthDependencies: Dependencies = {
  dependencies: {
    'passport': '^0.7.0',
    'passport-google-oauth20': '^2.0.0',
    'passport-github2': '^0.1.12',
    'express-session': '^1.17.3'
  },
  devDependencies: {
    '@types/passport': '^1.0.16',
    '@types/passport-google-oauth20': '^2.0.14',
    '@types/passport-github2': '^1.2.9',
    '@types/express-session': '^1.17.10'
  }
};

export const koaOAuthDependencies: Dependencies = {
  dependencies: {
    'passport': '^0.7.0',
    'passport-google-oauth20': '^2.0.0',
    'passport-github2': '^0.1.12',
    'koa-session': '^6.4.0',
    'koa-passport': '^6.0.0'
  },
  devDependencies: {
    '@types/passport': '^1.0.16',
    '@types/passport-google-oauth20': '^2.0.14',
    '@types/passport-github2': '^1.2.9',
    '@types/koa-session': '^6.4.5'
  }
}; 