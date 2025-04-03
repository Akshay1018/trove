// Framework types
export type Framework = 'express' | 'nest' | 'fastify' | 'koa';
export type Database = 'mongodb' | 'postgresql' | 'mysql' | 'skip';
export type Auth = 'jwt' | 'session' | 'oauth' | 'skip';
export type Cicd = 'github' | 'gitlab' | 'azure' | 'skip';

// Package related types
export interface PackageInfo {
  name: string;
  version: string;
  description?: string;
  author?: string;
  license?: string;
  category?: string;
  isDevDependency?: boolean;
}

// Template related types
export interface TemplateFile {
  path: string;
  content: string;
  isConfig?: boolean;
}

export interface TemplateOptions {
  framework: Framework;
  database?: Database;
  auth?: Auth;
  cicd?: Cicd;
}

export interface BaseTemplate {
  files: TemplateFile[];
  dependencies: string[];
  devDependencies: string[];
  environmentVariables: Record<string, string>;
} 