import { Dependencies } from '../../types/package-manager';

export const koaDependencies: Dependencies = {
  dependencies: {
    'koa': '^2.15.0',
    '@koa/router': '^12.0.1',
    'koa-bodyparser': '^4.4.1',
    'koa-helmet': '^7.0.2',
    'koa-logger': '^3.2.1',
    'dotenv': '^16.4.1',
    'winston': '^3.11.0'
  },
  devDependencies: {
    '@types/koa': '^2.15.0',
    '@types/koa__router': '^12.0.4',
    '@types/koa-bodyparser': '^4.3.12',
    '@types/koa-logger': '^3.1.5',
    '@types/node': '^20.11.5',
    'typescript': '^5.3.3',
    'ts-node': '^10.9.2',
    'nodemon': '^3.0.3',
    '@typescript-eslint/eslint-plugin': '^6.19.1',
    '@typescript-eslint/parser': '^6.19.1',
    'eslint': '^8.56.0',
    'eslint-config-prettier': '^9.1.0',
    'eslint-plugin-prettier': '^5.1.3',
    'prettier': '^3.2.4',
    'jest': '^29.7.0',
    '@types/jest': '^29.5.11',
    'ts-jest': '^29.1.1',
    'supertest': '^6.3.4',
    '@types/supertest': '^6.0.2'
  }
}; 