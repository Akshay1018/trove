export type Framework = 'express' | 'koa' | 'nestjs' | 'fastify';
export type Database = 'mongodb' | 'postgres' | 'mysql' | 'skip';
export type Auth = 'jwt' | 'session' | 'oauth' | 'skip';
export type CI = 'github' | 'gitlab' | 'bitbucket' | 'skip';

export interface TemplateOptions {
  projectName: string;
  framework: Framework;
  database: Database;
  auth: Auth;
  ci: CI;
}

export interface TemplateData {
  projectName: string;
  framework: string;
  database: string;
  auth: string;
  ci?: string;
  [key: string]: string | undefined;
}

export interface TemplateConfig {
  name: string;
  description: string;
  version: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
}

export interface TemplateFile {
  source: string;
  target: string;
}

export interface BaseTemplate {
  name: string;
  description: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  environmentVariables?: Record<string, string>;
  files: TemplateFile[];
}

export interface FrameworkTemplate extends BaseTemplate {}
export interface DatabaseTemplate extends BaseTemplate {}
export interface AuthTemplate extends BaseTemplate {} 