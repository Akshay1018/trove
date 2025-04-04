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

export const oauthDependencies: Dependencies = {
  dependencies: {
    '@nestjs/passport': '^10.0.2',
    'passport': '^0.7.0',
    'passport-google-oauth20': '^2.0.0',
    'passport-facebook': '^3.0.0',
    'passport-github2': '^0.1.12'
  },
  devDependencies: {
    '@types/passport-google-oauth20': '^2.0.14',
    '@types/passport-facebook': '^3.0.3',
    '@types/passport-github2': '^1.2.9'
  }
}; 