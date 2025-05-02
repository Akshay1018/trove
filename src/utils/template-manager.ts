import { join, dirname } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { render } from 'ejs';
import { logger } from './logger';
import { TemplateOptions } from '../types/template-options';
import { TEMPLATES_DIR } from '../config/constants';
import { mergePackageJson } from './package-merger';

export class TemplateManager {
  private templatesPath: string;
  private projectPath: string;
  private templateOptions: TemplateOptions;
  private packageJsonContents: any[] = [];

  constructor(templateOptions: TemplateOptions, projectPath: string) {
    this.templatesPath = TEMPLATES_DIR;
    this.projectPath = projectPath;
    this.templateOptions = templateOptions;
  }

  public async createProject(projectName: string): Promise<void> {
    if (existsSync(this.projectPath)) {
      throw new Error(`Project directory ${projectName} already exists`);
    }

    // Create project directory
    mkdirSync(this.projectPath, { recursive: true });

    // Create base directory structure
    this.createDirectoryStructure();

    // Copy and process templates
    await this.processTemplates();

    logger.info('Project created successfully');
  }

  private createDirectoryStructure(): void {
    const directories = [
      'src/routes',
      'src/controllers',
      'src/services',
      'src/models',
      'src/repositories',
      'src/middleware',
      'src/utils',
      'src/config',
      'src/types',
      'src/__tests__/unit',
      'src/__tests__/integration',
      'logs'
    ];

    directories.forEach(dir => {
      const path = join(this.projectPath, dir);
      if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
      }
    });
  }

  private async processTemplates(): Promise<void> {
    // Process base templates
    const baseTemplates = this.getTemplateFiles('common/base');
    await this.processTemplateFiles(baseTemplates);

    // Process framework-specific templates
    const frameworkTemplates = this.getTemplateFiles(`frameworks/${this.templateOptions.framework}`);
    await this.processTemplateFiles(frameworkTemplates);

    // Process database-specific templates
    const dbTemplates = this.getTemplateFiles(`databases/${this.templateOptions.database}`);
    await this.processTemplateFiles(dbTemplates);

    // Process auth-specific templates
    const authTemplates = this.getTemplateFiles(`auth/${this.templateOptions.auth}`);
    await this.processTemplateFiles(authTemplates);

    // Process CI/CD templates
    const ciTemplates = this.getTemplateFiles(`ci/${this.templateOptions.ci}`);
    await this.processTemplateFiles(ciTemplates);

    // After all templates are processed, merge and write the final package.json
    if (this.packageJsonContents.length > 0) {
      const mergedPackageJson = mergePackageJson(this.packageJsonContents);
      const targetPath = join(this.projectPath, 'package.json');
      writeFileSync(targetPath, JSON.stringify(mergedPackageJson, null, 2));
      logger.info('Written merged package.json');
    }
  }

  private async processTemplateFiles(templates: string[]): Promise<void> {
    for (const template of templates) {
      try {
        const content = readFileSync(template, 'utf-8');
        const processed = render(content, this.templateOptions);

        // Calculate relative path within the templates directory
        const templateRelativePath = template
          .replace(this.templatesPath, '')
          .replace(/^\/+/, '');

        // Special handling for package.json files
        if (templateRelativePath.endsWith('package.json.template') || 
            templateRelativePath.endsWith('package.json')) {
          try {
            // Check if this is a framework-specific package.json
            if (templateRelativePath.includes(`frameworks/${this.templateOptions.framework}`)) {
              const packageJson = JSON.parse(processed);
              this.packageJsonContents.push(packageJson);
            }
            // Check if this is a framework-specific auth package.json
            else if (templateRelativePath.includes(`auth/${this.templateOptions.auth}/${this.templateOptions.framework}.package.json`)) {
              const packageJson = JSON.parse(processed);
              this.packageJsonContents.push(packageJson);
            }
            // Handle regular package.json files
            else if (!templateRelativePath.includes('frameworks/') || 
                     templateRelativePath.includes(`frameworks/${this.templateOptions.framework}`)) {
              const packageJson = JSON.parse(processed);
              this.packageJsonContents.push(packageJson);
            }
            continue; // Skip writing this file as we'll merge it later
          } catch (error) {
            logger.error('Failed to parse package.json template:', error);
          }
        }

        let targetRelativePath = '';

        if (templateRelativePath.startsWith('common/base/')) {
          targetRelativePath = templateRelativePath.replace(/^common\/base\//, '');
        } else if (templateRelativePath.startsWith('frameworks/')) {
          targetRelativePath = templateRelativePath.replace(/^frameworks\/[^/]+\//, '');
        } else if (templateRelativePath.startsWith('databases/')) {
          targetRelativePath = templateRelativePath.replace(/^databases\/[^/]+\//, '');
        } else if (templateRelativePath.startsWith('auth/')) {
          targetRelativePath = templateRelativePath.replace(/^auth\/[^/]+\//, '');
        } else if (templateRelativePath.startsWith('ci/')) {
          const ciType = this.templateOptions.ci;
          const ciSourceDir = dirname(templateRelativePath);
          const relativePathWithinCiDir = templateRelativePath.substring(ciSourceDir.length + 1);

          if (ciType === 'github') {
            targetRelativePath = join('.github', 'workflows', relativePathWithinCiDir);
          } else if (ciType === 'gitlab') {
            targetRelativePath = relativePathWithinCiDir;
          } else if (ciType === 'bitbucket') {
            targetRelativePath = relativePathWithinCiDir;
          } else {
            targetRelativePath = templateRelativePath.replace(/^ci\/[^/]+\/workflows\//, '');
          }
        } else {
          targetRelativePath = templateRelativePath;
        }

        // Remove .template extension from the final path
        targetRelativePath = targetRelativePath.replace(/\.template$/, '');

        const targetPath = join(this.projectPath, targetRelativePath);
        const targetDir = dirname(targetPath);

        if (!existsSync(targetDir)) {
          mkdirSync(targetDir, { recursive: true });
        }

        writeFileSync(targetPath, processed);
        logger.info(`Processed template: ${templateRelativePath} -> ${targetPath}`);

      } catch (error) {
        logger.error(`Failed to process template ${template}:`, error);
        throw error;
      }
    }
  }

  private getTemplateFiles(relativePath: string): string[] {
    const fullPath = join(this.templatesPath, relativePath);
    if (!existsSync(fullPath)) {
      logger.info(`No templates found in ${relativePath}`);
      return [];
    }

    const templates: string[] = [];
    const items = readdirSync(fullPath);

    for (const item of items) {
      const itemPath = join(fullPath, item);
      const stat = statSync(itemPath);

      if (stat.isDirectory()) {
        templates.push(...this.getTemplateFiles(join(relativePath, item)));
      } else {
        templates.push(itemPath);
      }
    }

    logger.info(`Found ${templates.length} templates in ${relativePath}`);
    return templates;
  }
} 