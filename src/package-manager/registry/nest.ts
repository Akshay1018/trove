import { Dependencies } from '../../types/package-manager';

export const nestDependencies: Dependencies = {
  dependencies: {
    '@nestjs/common': '^10.3.0',
    '@nestjs/core': '^10.3.0',
    '@nestjs/platform-express': '^10.3.0',
    '@nestjs/swagger': '^7.2.0',
    'reflect-metadata': '^0.2.1',
    'rxjs': '^7.8.1',
    'helmet': '^7.1.0',
    'dotenv': '^16.4.1',
    'winston': '^3.11.0'
  },
  devDependencies: {
    '@nestjs/cli': '^10.3.0',
    '@nestjs/schematics': '^10.1.0',
    '@nestjs/testing': '^10.3.0',
    '@types/express': '^4.17.21',
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