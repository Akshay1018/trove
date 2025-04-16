import { Framework } from '../templates/structure';
import { Database } from '../templates/structure';
import { Auth } from '../templates/structure';
import { CI } from '../templates/structure';

export interface TemplateOptions {
  projectName: string;
  framework: Framework;
  database: Database;
  auth: Auth;
  ci: CI;
  packageManager?: 'npm' | 'yarn' | 'pnpm';
  port?: number;
  description?: string;
  author?: string;
  license?: string;
  version?: string;
} 