import { Framework, Database, Auth, Cicd } from './index';
import { BaseTemplate } from './base';

export interface TemplateOptions {
  framework: Framework;
  database?: Database;
  auth?: Auth;
  cicd?: Cicd;
}

export interface TemplateFile {
  path: string;
  content: string;
  isConfig?: boolean;
}

export interface FrameworkTemplate extends BaseTemplate {}
export interface DatabaseTemplate extends BaseTemplate {}
export interface AuthTemplate extends BaseTemplate {} 