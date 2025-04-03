import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { TemplateOptions, TemplateFile, FrameworkTemplate } from '../types/template';
import { logger } from './logger';
import ejs from 'ejs';

export class TemplateManager {
  private readonly templatesPath: string;

  constructor() {
    this.templatesPath = join(__dirname, '..', 'templates');
  }

  async createProject(projectName: string, options: TemplateOptions): Promise<void> {
    try {
      // Create project directory
      const projectPath = join(process.cwd(), projectName);
      if (existsSync(projectPath)) {
        throw new Error(`Directory ${projectName} already exists`);
      }
      mkdirSync(projectPath, { recursive: true });

      // Load and process templates
      await this.processFrameworkTemplate(projectPath, options);
      if (options.database && options.database !== 'skip') {
        await this.processDatabaseTemplate(projectPath, options);
      }
      if (options.auth && options.auth !== 'skip') {
        await this.processAuthTemplate(projectPath, options);
      }

      logger.success(`Project ${projectName} created successfully!`);
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
    const templateConfig = this.loadTemplateConfig(frameworkPath);
    await this.processTemplate(projectPath, templateConfig, options);
  }

  private async processDatabaseTemplate(projectPath: string, options: TemplateOptions): Promise<void> {
    if (!options.database || options.database === 'skip') return;
    const databasePath = join(this.templatesPath, 'database', options.database);
    const templateConfig = this.loadTemplateConfig(databasePath);
    await this.processTemplate(projectPath, templateConfig, options);
  }

  private async processAuthTemplate(projectPath: string, options: TemplateOptions): Promise<void> {
    if (!options.auth || options.auth === 'skip') return;
    const authPath = join(this.templatesPath, 'auth', options.auth);
    const templateConfig = this.loadTemplateConfig(authPath);
    await this.processTemplate(projectPath, templateConfig, options);
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
    projectPath: string, 
    template: FrameworkTemplate, 
    options: TemplateOptions
  ): Promise<void> {
    // Process each template file
    for (const file of template.files) {
      const targetPath = join(projectPath, file.path);
      const targetDir = targetPath.split('/').slice(0, -1).join('/');
      
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
      }

      let content = file.content;
      if (file.isConfig) {
        content = await ejs.render(content, {
          projectName: projectPath.split('/').pop(),
          ...options,
          dependencies: template.dependencies,
          devDependencies: template.devDependencies,
          env: template.environmentVariables
        });
      }

      writeFileSync(targetPath, content);
    }
  }
} 