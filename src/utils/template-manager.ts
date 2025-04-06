import { join, dirname } from 'path';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { TemplateOptions } from '../types/template';
import { logger } from './logger';
import ejs from 'ejs';
import { resolveDependencies } from '../package-manager/dependency-resolver';
import { getRequiredDirectories, getRequiredFiles } from '../templates/structure';

// Add TemplateData type
type TemplateData = Record<string, string | number | boolean>;

export class TemplateManager {
  private readonly templatesPath: string;
  private dependencies: Record<string, string>;
  private devDependencies: Record<string, string>;

  constructor() {
    // Look for templates in the src directory during development
    this.templatesPath = join(process.cwd(), 'src', 'templates');
    this.dependencies = {};
    this.devDependencies = {};
  }

  async createProject(projectName: string, options: TemplateOptions): Promise<void> {
    try {
      // Create project directory
      const projectPath = join(process.cwd(), projectName);
      if (existsSync(projectPath)) {
        throw new Error(`Directory ${projectName} already exists`);
      }

      // Get required directories and files based on options
      const directories = getRequiredDirectories({ ...options, projectName });
      const files = getRequiredFiles({ ...options, projectName });

      // Create all required directories
      directories.forEach(dir => {
        mkdirSync(join(projectPath, dir), { recursive: true });
      });

      // Resolve dependencies
      const resolvedDeps = resolveDependencies(options);
      this.dependencies = resolvedDeps.dependencies.reduce((acc, dep) => {
        acc[dep] = '^1.0.0'; // Default to ^1.0.0, you might want to specify exact versions
        return acc;
      }, {} as Record<string, string>);
      
      this.devDependencies = resolvedDeps.devDependencies.reduce((acc, dep) => {
        acc[dep] = '^1.0.0'; // Default to ^1.0.0, you might want to specify exact versions
        return acc;
      }, {} as Record<string, string>);

      // Process each required file
      for (const file of files) {
        const targetPath = join(projectPath, file);
        const fileWithoutExt = file.replace(/\.[^/.]+$/, '');
        const fileName = file.split('/').pop() || '';

        // Try different template extensions
        const templateExtensions = ['.template'];
        let content = '';
        let templateFound = false;

        for (const ext of templateExtensions) {
          // Try framework-specific template
          if (options.framework) {
            const frameworkTemplate = join(this.templatesPath, options.framework, 'base', file + ext);
            if (existsSync(frameworkTemplate)) {
              content = readFileSync(frameworkTemplate, 'utf-8');
              templateFound = true;
              break;
            }
          }

          // Try database-specific template
          if (options.database && !templateFound) {
            const dbTemplate = join(this.templatesPath, 'databases', options.database, file + ext);
            if (existsSync(dbTemplate)) {
              content = readFileSync(dbTemplate, 'utf-8');
              templateFound = true;
              break;
            }
          }

          // Try auth-specific template
          if (options.auth && !templateFound) {
            const authTemplate = join(this.templatesPath, 'auth', options.auth, file + ext);
            if (existsSync(authTemplate)) {
              content = readFileSync(authTemplate, 'utf-8');
              templateFound = true;
              break;
            }
          }

          // Try CI-specific template
          if (options.ci && !templateFound) {
            if (options.ci === 'github' && file.includes('.github/workflows')) {
              const ciTemplate = join(this.templatesPath, 'ci', options.ci, 'workflows', 'ci.yml');
              if (existsSync(ciTemplate)) {
                content = readFileSync(ciTemplate, 'utf-8');
                templateFound = true;
                break;
              }
            } else {
              const ciTemplate = join(this.templatesPath, 'ci', options.ci, fileName);
              if (existsSync(ciTemplate)) {
                content = readFileSync(ciTemplate, 'utf-8');
                templateFound = true;
                break;
              }
            }
          }

          // Try common template
          if (!templateFound) {
            const commonTemplate = join(this.templatesPath, 'common', 'base', fileName + ext);
            if (existsSync(commonTemplate)) {
              content = readFileSync(commonTemplate, 'utf-8');
              templateFound = true;
              break;
            }
          }
        }

        if (!templateFound) {
          logger.warn(`Template not found for ${file}`);
          continue;
        }

        // Ensure target directory exists
        mkdirSync(dirname(targetPath), { recursive: true });

        // Process template with EJS
        content = ejs.render(content, {
          projectName,
          ...options,
          dependencies: this.dependencies,
          devDependencies: this.devDependencies
        });

        // Write file
        writeFileSync(targetPath, content);
      }

      logger.info('Project created successfully');
    } catch (error) {
      logger.error('Failed to create project:', error);
      throw error;
    }
  }

  private loadTemplate(path: string): string {
    const templatePath = join(this.templatesPath, path);
    if (!existsSync(templatePath)) {
      throw new Error(`Template not found: ${path}`);
    }
    return readFileSync(templatePath, 'utf-8');
  }
}

export const processTemplate = (
  templatePath: string,
  targetPath: string,
  data: TemplateData
): void => {
  // ... existing code ...
};

export const processTemplateString = (
  template: string,
  data: Record<string, string | number | boolean>
): string => {
  try {
    return ejs.render(template, data);
  } catch (error) {
    logger.error('Error processing template string:', error);
    return template;
  }
}; 