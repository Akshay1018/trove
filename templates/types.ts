export interface TemplateConfig {
  projectName: string;
  framework: string;
  database?: string;
  auth?: string;
  cicd?: {
    platform: string;
    stages: string[];
    deploymentPlatform?: string;
  };
}

export interface TemplateFile {
  path: string;
  content: string;
  isConfig?: boolean;
}

export interface FrameworkTemplate {
  name: string;
  files: TemplateFile[];
  dependencies: string[];
  devDependencies: string[];
  scripts: Record<string, string>;
}

export interface DatabaseTemplate {
  name: string;
  files: TemplateFile[];
  dependencies: string[];
  envVars: Record<string, string>;
  configFiles?: TemplateFile[];
}

export interface AuthTemplate {
  name: string;
  files: TemplateFile[];
  dependencies: string[];
  envVars: Record<string, string>;
  middlewares?: TemplateFile[];
}

export interface ConfigTemplate {
  name: string;
  files: TemplateFile[];
  variables: Record<string, string>;
}

export interface ProjectStructure {
  directories: string[];
  baseFiles: TemplateFile[];
  configFiles: TemplateFile[];
  framework: FrameworkTemplate;
  database?: DatabaseTemplate;
  auth?: AuthTemplate;
  config: ConfigTemplate;
} 