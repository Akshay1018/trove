declare module '*.ejs' {
  const content: string;
  export default content;
}

declare module '*.template' {
  const content: string;
  export default content;
}

type DatabaseType = 'mongodb' | 'postgresql' | 'mysql' | 'skip';
type AuthType = 'jwt' | 'session' | 'oauth' | 'skip';
type CicdType = 'github' | 'gitlab' | 'azure' | 'skip';

export interface TemplateOptions {
  framework: 'express' | 'koa' | 'nestjs' | 'fastify';
  database?: DatabaseType;
  auth?: AuthType;
  cicd?: CicdType;
}

export interface TemplateFile {
  path: string;
  content: string;
  isConfig?: boolean;
}

export interface FrameworkTemplate {
  files: TemplateFile[];
  dependencies: string[];
  devDependencies: string[];
  environmentVariables: Record<string, string>;
}

export interface DatabaseTemplate extends FrameworkTemplate {}
export interface AuthTemplate extends FrameworkTemplate {}

interface PackageInfo {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
}

declare module 'inquirer' {
  interface Answers {
    projectName: string;
    framework: string;
    database: string;
    auth: string;
  }

  interface Question {
    type: string;
    name: string;
    message: string;
    choices?: string[];
    default?: string;
  }

  function prompt(questions: Question[]): Promise<Answers>;
} 