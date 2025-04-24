import { join, dirname, basename } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { render } from 'ejs';
import { logger } from './logger';
import { TemplateOptions } from '../types/template-options';
import { TEMPLATES_DIR } from '../config/constants';

export class TemplateManager {
  private templatesPath: string;
  private projectPath: string;
  private templateOptions: TemplateOptions;

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
  }

  private getTemplateFiles(category: string): string[] {
    const categoryPath = join(this.templatesPath, category);
    if (!existsSync(categoryPath)) {
      logger.warn(`Template category not found: ${category}`);
      return [];
    }

    const templates = this.walkDirectory(categoryPath);
    logger.info(`Found ${templates.length} templates in ${category}`);
    return templates;
  }

  private walkDirectory(dir: string): string[] {
    const results: string[] = [];
    const list = readdirSync(dir);

    list.forEach(file => {
      const fullPath = join(dir, file);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        results.push(...this.walkDirectory(fullPath));
      } else if (file.endsWith('.template')) {
        results.push(fullPath);
      }
    });

    return results;
  }

  private async processTemplateFiles(templates: string[]): Promise<void> {
    for (const template of templates) {
      try {
        const content = readFileSync(template, 'utf-8');
        const processed = render(content, this.templateOptions);

        // Calculate relative path within the templates directory
        const templateRelativePath = template
          .replace(this.templatesPath, '')
          .replace(/^\/+/, ''); // Remove leading slash

        let targetRelativePath = '';

        // --- Determine Correct Relative Path in Target Project ---
        if (templateRelativePath.startsWith('common/base/')) {
          targetRelativePath = templateRelativePath.replace(/^common\/base\//, '');
          // Root files from common/base (e.g., package.json) are handled implicitly
        } else if (templateRelativePath.startsWith('frameworks/')) {
          targetRelativePath = templateRelativePath.replace(/^frameworks\/[^/]+\//, '');
        } else if (templateRelativePath.startsWith('databases/')) {
          targetRelativePath = templateRelativePath.replace(/^databases\/[^/]+\//, '');
           // Root files from DB templates (e.g., .env.example) handled implicitly if not in src/
        } else if (templateRelativePath.startsWith('auth/')) {
          targetRelativePath = templateRelativePath.replace(/^auth\/[^/]+\//, '');
          // Root files from Auth templates (e.g., views/) handled implicitly if not in src/
        } else if (templateRelativePath.startsWith('ci/')) {
          const ciType = this.templateOptions.ci;
          const selectedDatabase = this.templateOptions.database;
          
          // --- Filter database-specific CI files ---
          const originalCiFilename = basename(templateRelativePath).replace(/\.template$/, '');
          let skipFile = false;

          if (originalCiFilename === 'mongodb.yml' && selectedDatabase !== 'mongodb') {
              skipFile = true;
          } else if (originalCiFilename === 'postgres.yml' && selectedDatabase !== 'postgres') {
              skipFile = true;
          } else if (originalCiFilename === 'mysql.yml' && selectedDatabase !== 'mysql') {
              skipFile = true;
          }
          // Add more database checks if needed
          
          if (skipFile) {
              logger.info(`Skipping CI template for non-selected database: ${originalCiFilename}`);
              continue; // Skip this file
          }
          // --- End Filter ---

          // Now calculate the final target path for files that were *not* skipped
          targetRelativePath = templateRelativePath.replace(/^ci\/[^/]+\//, ''); // Base relative path

          if (ciType === 'github') {
            // Handle .github files specifically
            if (templateRelativePath.includes('/.github/')) {
                 const parts = templateRelativePath.split('/.github/');
                 if (parts.length > 1) {
                   targetRelativePath = join('.github', parts[1]);
                 }
                 // Note: Files directly under .github (not in workflows) might need separate handling if they exist
            } else {
                 // Files directly under ci/github but not in .github need to be placed at root
                 targetRelativePath = targetRelativePath.replace(/^workflows\//, ''); // Remove workflows prefix
            }
          } else if (ciType === 'gitlab' || ciType === 'bitbucket') {
             // GitLab CI / Bitbucket files go in the root
             // targetRelativePath is already correct (e.g., '.gitlab-ci.yml')
          }
          // Add other CI types if needed
        } else {
           // Fallback for unknown categories? Or assume structure is correct?
           targetRelativePath = templateRelativePath;
        }

        // Remove .template extension from the final path
        targetRelativePath = targetRelativePath.replace(/\.template$/, '');

        // --- Final Path Calculation ---
        const targetPath = join(this.projectPath, targetRelativePath);

        // Ensure target directory exists
        const targetDir = dirname(targetPath);
        if (!existsSync(targetDir)) {
          mkdirSync(targetDir, { recursive: true });
        }

        // Write the processed file
        writeFileSync(targetPath, processed);
        logger.info(`Processed template: ${targetRelativePath} -> ${targetPath}`);

      } catch (error) {
        logger.error(`Failed to process template ${template}:`, error);
        throw error;
      }
    }
  }
} 