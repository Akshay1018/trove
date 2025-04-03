import { TemplateConfig, ProjectStructure, TemplateFile } from './types';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { render } from 'ejs';

export class TemplateManager {
  private readonly templatesPath: string;

  constructor(templatesPath: string) {
    this.templatesPath = templatesPath;
  }

  public async generateProject(config: TemplateConfig): Promise<void> {
    const structure = await this.loadProjectStructure(config);
    await this.createProjectStructure(structure, config);
  }

  private async loadProjectStructure(config: TemplateConfig): Promise<ProjectStructure> {
    const framework = await this.loadFrameworkTemplate(config.framework);
    const database = config.database ? await this.loadDatabaseTemplate(config.database) : undefined;
    const auth = config.auth ? await this.loadAuthTemplate(config.auth) : undefined;
    const configTemplate = await this.loadConfigTemplate(config);

    return {
      directories: [
        'src',
        'src/config',
        'src/controllers',
        'src/models',
        'src/routes',
        'src/services',
        'src/utils',
        'src/middleware',
        'tests',
        'tests/unit',
        'tests/integration'
      ],
      baseFiles: [
        {
          path: 'README.md',
          content: this.generateReadme(config)
        },
        {
          path: '.gitignore',
          content: this.loadTemplate('base/gitignore.template')
        },
        {
          path: '.env.example',
          content: this.generateEnvExample(config)
        }
      ],
      configFiles: configTemplate.files,
      framework,
      database,
      auth,
      config: configTemplate
    };
  }

  private async createProjectStructure(structure: ProjectStructure, config: TemplateConfig): Promise<void> {
    // Create directories
    structure.directories.forEach(dir => {
      mkdirSync(join(process.cwd(), config.projectName, dir), { recursive: true });
    });

    // Create base files
    structure.baseFiles.forEach(file => {
      this.writeTemplateFile(file, config);
    });

    // Create framework files
    structure.framework.files.forEach(file => {
      this.writeTemplateFile(file, config);
    });

    // Create database files if configured
    if (structure.database) {
      structure.database.files.forEach(file => {
        this.writeTemplateFile(file, config);
      });
    }

    // Create auth files if configured
    if (structure.auth) {
      structure.auth.files.forEach(file => {
        this.writeTemplateFile(file, config);
      });
    }

    // Create config files
    structure.configFiles.forEach(file => {
      this.writeTemplateFile(file, config);
    });
  }

  private writeTemplateFile(file: TemplateFile, config: TemplateConfig): void {
    const filePath = join(process.cwd(), config.projectName, file.path);
    mkdirSync(dirname(filePath), { recursive: true });

    const content = file.isConfig ? 
      render(file.content, { config }) : 
      file.content;

    writeFileSync(filePath, content);
  }

  private loadTemplate(path: string): string {
    return readFileSync(join(this.templatesPath, path), 'utf-8');
  }

  private async loadFrameworkTemplate(framework: string): Promise<any> {
    const templatePath = join(this.templatesPath, 'frameworks', framework);
    // Implementation for loading framework-specific templates
    // This will be implemented when we create framework-specific templates
    return {};
  }

  private async loadDatabaseTemplate(database: string): Promise<any> {
    const templatePath = join(this.templatesPath, 'databases', database);
    // Implementation for loading database-specific templates
    // This will be implemented when we create database-specific templates
    return {};
  }

  private async loadAuthTemplate(auth: string): Promise<any> {
    const templatePath = join(this.templatesPath, 'auth', auth);
    // Implementation for loading auth-specific templates
    // This will be implemented when we create auth-specific templates
    return {};
  }

  private async loadConfigTemplate(config: TemplateConfig): Promise<any> {
    // Implementation for loading configuration templates
    // This will be implemented when we create configuration templates
    return {
      files: []
    };
  }

  private generateReadme(config: TemplateConfig): string {
    // Implementation for generating README.md
    // This will be implemented when we create the README template
    return '';
  }

  private generateEnvExample(config: TemplateConfig): string {
    // Implementation for generating .env.example
    // This will be implemented when we create the env template
    return '';
  }
} 