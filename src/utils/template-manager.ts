import { join, dirname } from 'path';
import { existsSync, mkdirSync, writeFileSync, readFileSync, copyFileSync, cpSync } from 'fs';
import { TemplateOptions, FrameworkTemplate } from '../types/template';
import { logger } from './logger';
import ejs from 'ejs';
import { resolveDependencies } from '../package-manager/dependency-resolver';

export class TemplateManager {
  private readonly templatesPath: string;
  private dependencies: Record<string, string> = {};
  private devDependencies: Record<string, string> = {};

  constructor() {
    // Look for templates relative to this file's location
    this.templatesPath = join(dirname(dirname(dirname(__filename))), 'src', 'templates');
  }

  async createProject(projectName: string, options: TemplateOptions): Promise<void> {
    try {
      // Create project directory
      const projectPath = join(process.cwd(), projectName);
      if (existsSync(projectPath)) {
        throw new Error(`Directory ${projectName} already exists`);
      }
      mkdirSync(projectPath, { recursive: true });

      // Resolve dependencies using the dependency resolver
      const resolvedDeps = resolveDependencies({
        framework: options.framework,
        database: options.database,
        auth: options.auth
      });

      this.dependencies = resolvedDeps.dependencies;
      this.devDependencies = resolvedDeps.devDependencies;

      // Load and process templates
      await this.processFrameworkTemplate(projectPath, options);
      if (options.database && options.database !== 'skip') {
        await this.processDatabaseTemplate(projectPath, options);
      }
      if (options.auth && options.auth !== 'skip') {
        await this.processAuthTemplate(projectPath, options);
      }

      logger.info(`Project ${projectName} created successfully!`);
      logger.info('\nNext steps:');
      logger.info(`  cd ${projectName}`);
      logger.info('  npm install');
      logger.info('  npm run dev');

    } catch (error) {
      logger.error('Failed to create project:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  private async processFrameworkTemplate(projectPath: string, options: TemplateOptions): Promise<void> {
    const frameworkPath = join(this.templatesPath, options.framework);
    const basePath = join(frameworkPath, 'base');
    const templateConfig = this.loadTemplateConfig(basePath);
    await this.processTemplate(basePath, projectPath, templateConfig, options);
  }

  private async processDatabaseTemplate(projectPath: string, options: TemplateOptions): Promise<void> {
    if (!options.database || options.database === 'skip') return;
    const databasePath = join(this.templatesPath, 'database', options.database);
    const templateConfig = this.loadTemplateConfig(databasePath);
    await this.processTemplate(databasePath, projectPath, templateConfig, options);
  }

  private async processAuthTemplate(projectPath: string, options: TemplateOptions): Promise<void> {
    if (!options.auth || options.auth === 'skip') return;
    const authPath = join(this.templatesPath, 'auth', options.auth);
    const templateConfig = this.loadTemplateConfig(authPath);
    await this.processTemplate(authPath, projectPath, templateConfig, options);
  }

  private loadTemplateConfig(templatePath: string): FrameworkTemplate {
    const configPath = join(templatePath, 'template.json');
    if (!existsSync(configPath)) {
      throw new Error(`Template configuration not found at ${configPath}`);
    }
    const configContent = readFileSync(configPath, 'utf-8');
    return JSON.parse(configContent) as FrameworkTemplate;
  }

  private async processTemplate(
    templatePath: string,
    projectPath: string,
    template: FrameworkTemplate,
    options: TemplateOptions
  ): Promise<void> {
    // Process each template file
    for (const file of template.files) {
      const sourcePath = join(templatePath, file.source);
      const targetPath = join(projectPath, file.target);
      const targetDir = dirname(targetPath);

      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
      }

      // Handle directories
      if (existsSync(sourcePath)) {
        if (sourcePath.endsWith('.ts') || sourcePath.endsWith('.js') || sourcePath.endsWith('.json') || sourcePath.endsWith('.ejs')) {
          // Process all text files with EJS
          let content = readFileSync(sourcePath, 'utf-8');
          try {
            content = await ejs.render(content, {
              projectName: projectPath.split('/').pop(),
              ...options,
              dependencies: this.dependencies,
              devDependencies: this.devDependencies
            });
            const finalTargetPath = targetPath.endsWith('.ejs') ? targetPath.slice(0, -4) : targetPath;
            await writeFileSync(finalTargetPath, content);
          } catch (error) {
            logger.error(`Error processing template ${sourcePath}:`, error);
            throw error;
          }
        } else {
          // Copy other files/directories as is
          cpSync(sourcePath, targetPath, { recursive: true });
        }
      }
    }
  }
} 