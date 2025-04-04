declare module '*.ejs' {
  const content: string;
  export default content;
}

declare module '*.template' {
  const content: string;
  export default content;
}

interface TemplateOptions {
  database?: 'mongodb' | 'postgresql' | 'mysql' | null;
  auth?: 'jwt' | 'session' | 'oauth' | null;
  framework?: 'express' | 'koa' | 'nest' | 'fastify';
  cicd?: 'github' | 'gitlab' | 'bitbucket' | null;
}

interface TemplateFile {
  path: string;
  content: string;
  isConfig?: boolean;
}

interface FrameworkTemplate {
  files: TemplateFile[];
  dependencies: string[];
  devDependencies: string[];
  scripts: Record<string, string>;
}

interface DatabaseTemplate {
  files: TemplateFile[];
  dependencies: string[];
  devDependencies: string[];
  environmentVariables: Record<string, string>;
}

interface AuthTemplate {
  files: TemplateFile[];
  dependencies: string[];
  devDependencies: string[];
  environmentVariables: Record<string, string>;
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