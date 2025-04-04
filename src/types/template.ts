export type Framework = 'express' | 'koa' | 'nest';
export type Database = 'mongodb' | 'postgres' | 'mysql' | 'skip';
export type Auth = 'jwt' | 'passport' | 'skip';

export interface TemplateOptions {
  framework: Framework;
  database?: Database;
  auth?: Auth;
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