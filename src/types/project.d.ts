import { TemplateOptions } from './template';

export interface ProjectConfig extends TemplateOptions {
  name: string;
}

export interface ProjectDependency {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
} 