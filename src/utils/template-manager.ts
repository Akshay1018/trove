import { join, dirname } from 'path';
import { existsSync, mkdirSync, writeFileSync, readFileSync, copyFileSync } from 'fs';
import { TemplateOptions } from '../types/template';
import { logger } from './logger';
import ejs from 'ejs';
import { resolveDependencies } from '../package-manager/dependency-resolver';
import { getRequiredFiles, createDirectoryStructure } from '../templates/structure';

// Add TemplateData type
type TemplateData = Record<string, string | number | boolean>;

export class TemplateManager {
  private readonly templatesPath: string;
  private dependencies: Record<string, string>;
  private devDependencies: Record<string, string>;

  constructor() {
    // Look for templates in the dist/src/templates directory
    this.templatesPath = join(process.cwd(), 'dist', 'src', 'templates');
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

      // Get required files based on options
      const files = getRequiredFiles({ ...options, projectName });

      // Create directory structure
      createDirectoryStructure({ ...options, projectName });

      // Resolve dependencies
      const resolvedDeps = resolveDependencies(options);
      this.dependencies = resolvedDeps.dependencies;
      this.devDependencies = resolvedDeps.devDependencies;

      // Process each required file
      for (const file of files) {
        // Convert template path to target path
        const targetPath = join(projectPath, this.getTargetPath(file));
        let content = '';
        let templateFound = false;

        // Try framework-specific template first
        if (options.framework && !templateFound) {
          const frameworkTemplate = join(this.templatesPath, 'frameworks', options.framework.toLowerCase(), file.replace(/^frameworks\/[^/]+\//, ''));
          console.log('Looking for framework template:', frameworkTemplate);
          if (existsSync(frameworkTemplate)) {
            content = readFileSync(frameworkTemplate, 'utf-8');
            templateFound = true;
            console.log('Found framework template:', frameworkTemplate);
          }
        }

        // Try database-specific template
        if (options.database && !templateFound) {
          const dbTemplate = join(this.templatesPath, 'databases', options.database.toLowerCase(), file.replace(/^databases\/[^/]+\//, ''));
          console.log('Looking for database template:', dbTemplate);
          if (existsSync(dbTemplate)) {
            content = readFileSync(dbTemplate, 'utf-8');
            templateFound = true;
            console.log('Found database template:', dbTemplate);
          }
        }

        // Try auth-specific template
        if (options.auth && !templateFound) {
          const authTemplate = join(this.templatesPath, 'auth', options.auth.toLowerCase(), file.replace(/^auth\/[^/]+\//, ''));
          console.log('Looking for auth template:', authTemplate);
          if (existsSync(authTemplate)) {
            content = readFileSync(authTemplate, 'utf-8');
            templateFound = true;
            console.log('Found auth template:', authTemplate);
          }
        }

        // Try CI-specific template
        if (options.ci && !templateFound) {
          const ciTemplate = join(this.templatesPath, 'ci', options.ci.toLowerCase(), file.replace(/^ci\/[^/]+\//, ''));
          console.log('Looking for CI template:', ciTemplate);
          if (existsSync(ciTemplate)) {
            content = readFileSync(ciTemplate, 'utf-8');
            templateFound = true;
            console.log('Found CI template:', ciTemplate);
          }
        }

        // Try common template
        if (!templateFound) {
          const commonTemplate = join(this.templatesPath, 'common', 'base', file);
          console.log('Looking for common template:', commonTemplate);
          if (existsSync(commonTemplate)) {
            content = readFileSync(commonTemplate, 'utf-8');
            templateFound = true;
            console.log('Found common template:', commonTemplate);
          }
        }

        if (!templateFound) {
          logger.warn(`Template not found for ${file}`);
          continue;
        }

        // Create directory if it doesn't exist
        const targetDir = dirname(targetPath);
        if (!existsSync(targetDir)) {
          mkdirSync(targetDir, { recursive: true });
        }

        // Replace placeholders and write file
        const processedContent = this.replacePlaceholders(content, options);
        writeFileSync(targetPath, processedContent);
      }

      logger.info('Project created successfully');
    } catch (error) {
      logger.error('Failed to create project:', error);
      throw error;
    }
  }

  private getTargetPath(templatePath: string): string {
    // Remove feature-specific directory prefix and .template extension
    let path = templatePath;

    // Handle framework-specific paths
    path = path.replace(/^frameworks\/[^/]+\//, '');

    // Handle database-specific paths
    path = path.replace(/^databases\/[^/]+\//, '');

    // Handle auth-specific paths
    path = path.replace(/^auth\/[^/]+\//, '');

    // Handle CI-specific paths
    path = path.replace(/^ci\/[^/]+\//, '');

    // Remove .template extension
    path = path.replace(/\.template$/, '');

    // Handle CI-specific paths that should keep their directory structure
    if (path.includes('.github/workflows/') || path.includes('.gitlab-ci') || path.includes('Jenkinsfile')) {
      return path;
    }

    // Handle src directory files
    if (path.startsWith('src/')) {
      return path;
    }

    // Handle root-level files
    return path;
  }

  private loadTemplate(path: string): string {
    const templatePath = join(this.templatesPath, path);
    if (!existsSync(templatePath)) {
      throw new Error(`Template not found: ${path}`);
    }
    return readFileSync(templatePath, 'utf-8');
  }

  private replacePlaceholders(content: string, options: TemplateOptions): string {
    return ejs.render(content, {
      projectName: options.projectName,
      name: options.projectName,
      description: `A modern Node.js backend application using ${options.framework} and ${options.database}`,
      author: process.env.USER || 'Anonymous',
      version: '1.0.0',
      license: 'MIT',
      nodeVersion: process.version,
      ...options,
      dependencies: this.dependencies,
      devDependencies: this.devDependencies
    });
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

export async function generateTemplates(options: TemplateOptions): Promise<void> {
  // Get required files
  const files = getRequiredFiles(options);

  // Create directories
  createDirectoryStructure(options);

  // Copy files
  for (const file of files) {
    const templatePath = join(process.cwd(), 'dist', 'src', 'templates', file);
    const targetPath = file.replace(/\.template$/, '');

    console.log('Looking for template:', templatePath);
    console.log('Target path:', targetPath);

    if (existsSync(templatePath)) {
      console.log('Template found:', templatePath);
      copyFileSync(templatePath, targetPath);
    } else {
      console.warn(`warn: Template not found for ${file}`);
    }
  }

  // Update package.json with dependencies
  await resolveDependencies(options);
} 