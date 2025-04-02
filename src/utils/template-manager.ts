import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import { ProjectConfig } from '../types/project';

export class TemplateManager {
  private templatesDir: string;

  constructor() {
    this.templatesDir = path.join(__dirname, '..', 'templates');
  }

  async copyTemplate(config: ProjectConfig): Promise<void> {
    const { framework, name: projectName } = config;
    const templatePath = path.join(this.templatesDir, framework!, 'base');
    const targetPath = path.join(process.cwd(), projectName);

    // Create project directory
    await fs.promises.mkdir(targetPath, { recursive: true });

    // Copy base template
    await this.copyTemplateFiles(templatePath, targetPath, config);

    // Add database configuration if not skipped
    if (config.database && config.database !== 'skip') {
      const dbTemplatePath = path.join(this.templatesDir, framework!, 'database', config.database);
      await this.copyTemplateFiles(dbTemplatePath, targetPath, config);
    }

    // Add authentication configuration if not skipped
    if (config.auth && config.auth !== 'skip') {
      const authTemplatePath = path.join(this.templatesDir, framework!, 'auth', config.auth);
      await this.copyTemplateFiles(authTemplatePath, targetPath, config);
    }

    // Create minimal configuration files for skipped options
    if (config.database === 'skip') {
      await this.createPlaceholderConfig(targetPath, 'database');
    }

    if (config.auth === 'skip') {
      await this.createPlaceholderConfig(targetPath, 'auth');
    }
  }

  private async createPlaceholderConfig(targetPath: string, type: 'database' | 'auth'): Promise<void> {
    const configDir = path.join(targetPath, 'src', 'config');
    await fs.promises.mkdir(configDir, { recursive: true });

    const placeholderContent = type === 'database' 
      ? this.getDatabasePlaceholder()
      : this.getAuthPlaceholder();

    await fs.promises.writeFile(
      path.join(configDir, `${type}.config.ts`),
      placeholderContent
    );
  }

  private getDatabasePlaceholder(): string {
    return `// Database configuration placeholder
// To add database support later:
// 1. Install required dependencies
// 2. Configure your database connection here
// 3. Update environment variables

export const databaseConfig = {
  // Add your database configuration here
};
`;
  }

  private getAuthPlaceholder(): string {
    return `// Authentication configuration placeholder
// To add authentication support later:
// 1. Install required dependencies
// 2. Configure your authentication here
// 3. Set up authentication middleware
// 4. Create authentication routes

export const authConfig = {
  // Add your authentication configuration here
};
`;
  }

  private async copyTemplateFiles(sourcePath: string, targetPath: string, config: ProjectConfig): Promise<void> {
    const files = await this.getAllFiles(sourcePath);

    for (const file of files) {
      const relativePath = path.relative(sourcePath, file);
      const targetFilePath = path.join(targetPath, relativePath);
      const targetDir = path.dirname(targetFilePath);

      // Create directory if it doesn't exist
      await fs.promises.mkdir(targetDir, { recursive: true });

      // Read and process template
      const content = await fs.promises.readFile(file, 'utf-8');
      const processedContent = await this.processTemplate(content, config);

      // Write processed content
      await fs.promises.writeFile(targetFilePath, processedContent);
    }
  }

  private async getAllFiles(dirPath: string): Promise<string[]> {
    try {
      const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
      const files = await Promise.all(
        entries.map((entry) => {
          const res = path.resolve(dirPath, entry.name);
          return entry.isDirectory() ? this.getAllFiles(res) : [res];
        })
      );
      return files.flat();
    } catch (error) {
      // If directory doesn't exist, return empty array
      return [];
    }
  }

  private async processTemplate(content: string, config: ProjectConfig): Promise<string> {
    try {
      return ejs.render(content, {
        projectName: config.name,
        database: config.database === 'skip' ? null : config.database,
        auth: config.auth === 'skip' ? null : config.auth,
        ...config,
      });
    } catch (error) {
      // If file is not a template, return as is
      return content;
    }
  }
} 