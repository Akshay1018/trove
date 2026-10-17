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
      'logs'
    ];

    if (!this.templateOptions.skipTests) {
      directories.push('src/__tests__/unit', 'src/__tests__/integration');
    }

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

    // Merge dependencies declared by the selected database and auth templates.
    for (const metadataPath of [
      this.templateOptions.database && this.templateOptions.database !== 'skip'
        ? join(this.templatesPath, 'databases', this.templateOptions.database, 'template.json')
        : undefined,
      this.templateOptions.auth && this.templateOptions.auth !== 'skip'
        ? join(this.templatesPath, 'auth', this.templateOptions.auth, 'template.json')
        : undefined,
    ]) {
      if (!metadataPath || !existsSync(metadataPath)) continue;

      const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
      if (metadata.dependencies || metadata.devDependencies) {
        this.packageJsonContents.push({
          dependencies: metadata.dependencies,
          devDependencies: metadata.devDependencies,
        });
      }
    }
    // After all templates are processed, merge and write the final package.json
    if (this.packageJsonContents.length > 0) {
      const mergedPackageJson = mergePackageJson(this.packageJsonContents);

      if (this.templateOptions.skipTests) {
        for (const script of ['test', 'test:watch', 'test:coverage', 'test:cov']) {
          delete mergedPackageJson.scripts?.[script];
        }

        for (const dependency of [
          '@types/jest',
          'jest',
          'ts-jest',
          '@types/supertest',
          'supertest',
          'mongodb-memory-server'
        ]) {
          delete mergedPackageJson.devDependencies?.[dependency];
          delete mergedPackageJson.dependencies?.[dependency];
        }
      }
      const targetPath = join(this.projectPath, 'package.json');
      writeFileSync(targetPath, JSON.stringify(mergedPackageJson, null, 2));
      logger.info('Written merged package.json');
    }
  }

  private async processTemplateFiles(templates: string[]): Promise<void> {
    for (const template of templates) {
      const templateRelativePath = template
        .replace(this.templatesPath, '')
        .replace(/^[\\/]+/, '')
        .replace(/\\/g, '/');

      // Only include templates for the selected framework, database, and auth option.
      if (templateRelativePath.startsWith('frameworks/') &&
          !templateRelativePath.startsWith(`frameworks/${this.templateOptions.framework}/`)) {
        continue;
      }

      if (templateRelativePath.startsWith('databases/') &&
          (!this.templateOptions.database ||
           this.templateOptions.database === 'skip' ||
           !templateRelativePath.startsWith(`databases/${this.templateOptions.database}/`))) {
        continue;
      }

      // The common/base service is the shared generic implementation.
      // The legacy Express copy redeclares BaseService and breaks builds.
      if (
        this.templateOptions.framework === 'express' &&
        templateRelativePath === 'frameworks/express/src/services/base.service.ts.template'
      ) {
        logger.info(`Skipping conflicting legacy template: ${templateRelativePath}`);
        continue;
      }

      if (templateRelativePath.startsWith('auth/')) {
        if (!this.templateOptions.auth ||
            this.templateOptions.auth === 'skip' ||
            !templateRelativePath.startsWith(`auth/${this.templateOptions.auth}/`)) {
          continue;
        }

        // Skip legacy JWT files that conflict with the current templates.
        if (
          this.templateOptions.framework === 'express' &&
          (
            templateRelativePath === 'auth/jwt/src/middleware/auth.ts' ||
            templateRelativePath === 'auth/jwt/src/routes/auth.ts' ||
            templateRelativePath === 'auth/jwt/src/utils/auth.ts'
          )
        ) {
          continue;
        }

        // These legacy files are framework/database-specific and conflict with
        // the selected database model and the current framework's auth routes.
        if (/^auth\/[^/]+\/src\/models\/user\.model\.ts$/.test(templateRelativePath)) {
          continue;
        }

        if (templateRelativePath.endsWith('/src/routes/auth.ts') &&
            this.templateOptions.framework !== 'koa') {
          continue;
        }

        if (templateRelativePath.endsWith('/src/middleware/auth.ts') &&
            this.templateOptions.framework !== 'koa') {
          continue;
        }
      }
      if (
        this.templateOptions.skipTests &&
        (
          /(^|\/)jest\.config\.[^/]+$/.test(templateRelativePath) ||
          /(^|\/)__tests__(\/|$)/.test(templateRelativePath) ||
          /\.(test|spec)\.[^/]+(?:\.template)?$/.test(templateRelativePath)
        )
      ) {
        logger.info(`Skipping test template: ${templateRelativePath}`);
        continue;
      }

      // Shared legacy tests assume Express and MongoDB-specific modules.
      // Keep framework tests separate and only generate optional integration
      // tests when their corresponding feature is selected.
      if (templateRelativePath.startsWith('common/base/src/__tests__/')) {
        logger.info(`Skipping legacy shared test: ${templateRelativePath}`);
        continue;
      }

      const isExpressJwtAuthTest =
        templateRelativePath === 'frameworks/express/src/__tests__/integration/auth.test.ts.template';

      if (isExpressJwtAuthTest && this.templateOptions.auth !== 'jwt') {
        logger.info(`Skipping JWT-specific auth test for auth option: ${this.templateOptions.auth}`);
        continue;
      }

      const isAuthTest = /(^|\/)auth\.test\.[^/]+(\.template)?$/.test(templateRelativePath);
      const isDatabaseTest = /(^|\/)database\.test\.[^/]+(\.template)?$/.test(templateRelativePath);

      if (isAuthTest && (!this.templateOptions.auth || this.templateOptions.auth === 'skip')) {
        logger.info(`Skipping auth test because authentication is disabled: ${templateRelativePath}`);
        continue;
      }

      if (isDatabaseTest && (!this.templateOptions.database || this.templateOptions.database === 'skip')) {
        logger.info(`Skipping database test because no database is selected: ${templateRelativePath}`);
        continue;
      }
      try {
        const content = readFileSync(template, 'utf-8');
        const processed = render(content, this.templateOptions);

        // Calculate relative path within the templates directory

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

        const targetRelativePath = resolveTargetRelativePath(
          templateRelativePath,
          this.templateOptions.ci
        );

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
        if (item.includes('.backup-') || item.endsWith('.issue36-backup') || item === 'template.json') {
          continue;
        }

        if (item.endsWith('.template')) {
          templates.push(itemPath);
          continue;
        }

        if (existsSync(`${itemPath}.template`)) {
          continue;
        }

        templates.push(itemPath);
      }
    }

    logger.info(`Found ${templates.length} templates in ${relativePath}`);
    return templates;
  }
}

/**
 * Normalizes template path and resolves destination relative path
 * cross-platform for Windows, macOS, and Linux.
 */
export function resolveTargetRelativePath(
  templateRelativePath: string,
  ciType?: string
): string {
  // Normalize Windows backslashes to forward slashes and strip leading slashes
  const normalized = templateRelativePath.replace(/\\/g, '/').replace(/^\/+/, '');

  let targetRelativePath = '';

  if (normalized.startsWith('common/base/')) {
    targetRelativePath = normalized.replace(/^common\/base\//, '');
  } else if (normalized.startsWith('frameworks/')) {
    targetRelativePath = normalized.replace(/^frameworks\/[^/]+\//, '');
  } else if (normalized.startsWith('databases/')) {
    targetRelativePath = normalized.replace(/^databases\/[^/]+\//, '');
  } else if (normalized.startsWith('auth/')) {
    targetRelativePath = normalized.replace(/^auth\/[^/]+\//, '');
  } else if (normalized.startsWith('ci/')) {
    if (ciType === 'github') {
      const relativePath = normalized.replace(/^ci\/github\/workflows\//, '');
      targetRelativePath = join('.github', 'workflows', relativePath);
    } else {
      targetRelativePath = normalized.replace(/^ci\/[^/]+\//, '');
    }
  } else {
    targetRelativePath = normalized;
  }

  // Remove .template extension from the final path
  return targetRelativePath.replace(/\.template$/, '');
}
 
