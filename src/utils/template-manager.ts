import { join, dirname } from 'path';
import { existsSync, mkdirSync, writeFileSync, readFileSync, copyFileSync } from 'fs-extra';
import { TemplateOptions } from '../types/template';
import { logger } from './logger';
import ejs from 'ejs';
import { resolveDependencies } from '../package-manager/dependency-resolver';
import { getRequiredFiles, createDirectoryStructure } from '../templates/structure';
import path from 'path';
import fs from 'fs';
import { TEMPLATES_DIR } from '@/config';
import { Framework, Database, Auth, CI } from '@/templates/structure';
import Handlebars from 'handlebars';
import { PackageManager } from '../package-manager';
import { BASE_TEMPLATE_PATH } from '../config';
import { BASE_FILES, FRAMEWORK_SPECIFIC, DATABASE_SPECIFIC, AUTH_SPECIFIC, CI_SPECIFIC } from '../templates/structure';

export class TemplateManager {
  private readonly templatesPath: string;
  private dependencies: Record<string, string>;
  private devDependencies: Record<string, string>;
  private projectDir: string;
  private options: {
    framework: Framework;
    database: Database;
    auth: Auth;
    ci: CI;
  };

  constructor(projectDir: string, options: {
    framework: Framework;
    database: Database;
    auth: Auth;
    ci: CI;
  }) {
    this.templatesPath = join(process.cwd(), 'dist', 'src', 'templates');
    this.dependencies = {};
    this.devDependencies = {};
    this.projectDir = projectDir;
    this.options = options;
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

      // Process auth-specific templates
      if (options.auth === 'oauth') {
        this.processOAuthTemplates(projectPath, options);
      }

      logger.info('Project created successfully');
    } catch (error) {
      logger.error('Failed to create project:', error);
      throw error;
    }
  }

  private processOAuthTemplates(projectPath: string, options: TemplateOptions): void {
    try {
      // Create views directory for OAuth login template
      const viewsDir = join(projectPath, 'views');
      const authViewsDir = join(viewsDir, 'auth');
      
      if (!existsSync(viewsDir)) {
        mkdirSync(viewsDir, { recursive: true });
      }
      
      if (!existsSync(authViewsDir)) {
        mkdirSync(authViewsDir, { recursive: true });
      }
      
      // Copy login template
      const loginTemplateSrc = join(this.templatesPath, 'auth', 'oauth', 'views', 'auth', 'login.ejs.template');
      const loginTemplateDest = join(projectPath, 'views', 'auth', 'login.ejs');
      
      if (existsSync(loginTemplateSrc)) {
        let content = readFileSync(loginTemplateSrc, 'utf-8');
        // Add providers to the template data for OAuth
        content = ejs.render(content, {
          title: options.projectName,
          providers: ['google', 'github']
        });
        writeFileSync(loginTemplateDest, content);
        logger.info(`Created OAuth login template: ${loginTemplateDest}`);
      }
      
      // Copy OAuth config file
      const oauthConfigSrc = join(this.templatesPath, 'auth', 'oauth', 'config', 'oauth.config.ts.template');
      const oauthConfigDest = join(projectPath, 'src', 'config', 'oauth.config.ts');
      
      if (existsSync(oauthConfigSrc)) {
        let content = readFileSync(oauthConfigSrc, 'utf-8');
        content = this.replacePlaceholders(content, options);
        writeFileSync(oauthConfigDest, content);
        logger.info(`Created OAuth config: ${oauthConfigDest}`);
      }
      
      // Make sure user model is properly overridden for OAuth
      const oauthUserModelSrc = join(this.templatesPath, 'auth', 'oauth', 'models', 'user.model.ts.template');
      const oauthUserModelDest = join(projectPath, 'src', 'models', 'user.model.ts');
      
      if (existsSync(oauthUserModelSrc)) {
        let content = readFileSync(oauthUserModelSrc, 'utf-8');
        content = this.replacePlaceholders(content, options);
        writeFileSync(oauthUserModelDest, content);
        logger.info(`Created OAuth user model: ${oauthUserModelDest}`);
      }
    } catch (error) {
      logger.error('Error processing OAuth templates:', error);
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

    // Always ensure models, repositories, controllers, services, and middleware are in src directory
    if (path.match(/^(models|repositories|controllers|services|middleware)\//)) {
      return `src/${path}`;
    }

    // Handle auth-specific paths
    if (path.match(/^(auth|session|jwt|oauth)\//)) {
      return `src/${path}`;
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
      title: options.projectName,
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

  // Check if a template file exists
  private templateExists(templatePath: string): boolean {
    return fs.existsSync(templatePath);
  }

  // Extract database type from CI filename
  private getDatabaseTypeFromCiFilename(filename: string): Database | null {
    const match = filename.match(/^(mongodb|postgres|mysql)-/);
    if (match && match[1]) {
      return match[1] as Database;
    }
    return null;
  }

  // Get the highest priority existing template path
  private getTemplatePath(relativePath: string): string | null {
    const templateTypes: (keyof TemplateManager['options'] | 'common')[] = [
      'framework',
      'database',
      'auth',
      'ci',
      'common',
    ];

    // console.log(`Looking for template: ${relativePath}`);

    for (const type of templateTypes) {
        let baseDir: string;
        let isDbSpecificCiFile = false;
        let requiredDbType: Database | null = null;

        // Determine base directory based on type
        switch (type) {
            case 'common':
                baseDir = BASE_TEMPLATE_PATH;
                break;
            case 'framework':
                baseDir = path.join(TEMPLATES_DIR, 'frameworks', this.options.framework);
                break;
            case 'database':
                baseDir = path.join(TEMPLATES_DIR, 'databases', this.options.database);
                break;
            case 'auth':
                baseDir = path.join(TEMPLATES_DIR, 'auth', this.options.auth);
                break;
            case 'ci':
                baseDir = path.join(TEMPLATES_DIR, 'ci', this.options.ci);
                const filename = path.basename(relativePath);
                requiredDbType = this.getDatabaseTypeFromCiFilename(filename);
                if (requiredDbType) {
                    isDbSpecificCiFile = true;
                }
                break;
            default:
                 // Should not happen, but satisfy typescript
                 continue;
        }

      // Check for combined paths first (e.g., framework/database specific)
        const combinedPathsToCheck = [
            // Framework combinations
            { type: 'framework', option: this.options.framework, subType: 'databases', subOption: this.options.database },
            { type: 'framework', option: this.options.framework, subType: 'auth', subOption: this.options.auth },
            { type: 'framework', option: this.options.framework, subType: 'ci', subOption: this.options.ci },
            // Database combinations
            { type: 'databases', option: this.options.database, subType: 'auth', subOption: this.options.auth },
            { type: 'databases', option: this.options.database, subType: 'ci', subOption: this.options.ci },
            // Auth combinations
            { type: 'auth', option: this.options.auth, subType: 'ci', subOption: this.options.ci },
        ];

        for (const combo of combinedPathsToCheck) {
            if (combo.option && combo.subOption) {
                const combinedPath = path.join(
                    TEMPLATES_DIR,
                    combo.type,
                    combo.option,
                    combo.subType,
                    combo.subOption,
                    relativePath
                );
                 // console.log(`Checking combined path: ${combinedPath}`);
                if (this.templateExists(combinedPath)) {
                    // console.log(`Found combined template: ${combinedPath}`);
                    return combinedPath;
                }
            }
        }

      const fullPath = path.join(baseDir, relativePath);
      // console.log(`Checking ${type} path: ${fullPath}`);

      if (this.templateExists(fullPath)) {
        if (isDbSpecificCiFile) {
          if (requiredDbType === this.options.database) {
            // console.log(`Found matching DB-specific CI template: ${fullPath}`);
            return fullPath;
          } else {
            // console.log(`Skipping non-matching DB-specific CI template: ${fullPath}`);
            continue; // Skip this template, look for the next type
          }
        } else {
          // console.log(`Found ${type} template: ${fullPath}`);
          return fullPath;
        }
      }
    }

    // console.log(`Template not found for: ${relativePath}`);
    return null;
  }

  public async copyTemplateFiles(): Promise<void> {
    const requiredFiles = getRequiredFiles(this.options);
    const packageManager = new PackageManager(this.projectDir);

    await createDirectoryStructure(this.projectDir, this.options);

    for (const relativeFilePath of requiredFiles) {
      const templatePath = this.getTemplatePath(relativeFilePath); // Use class method

      if (templatePath) {
        let destFilePath = path.join(this.projectDir, relativeFilePath);
        const destDir = path.dirname(destFilePath);

        // Rename *.template files
        if (destFilePath.endsWith('.template')) {
          destFilePath = destFilePath.replace(/\.template$/, '');
        }
         // Handle special naming for CI files (e.g., .github/, .gitlab-ci.yml)
         if (relativeFilePath.startsWith('ci/github/.github')) {
          destFilePath = path.join(this.projectDir, relativeFilePath.replace('ci/github/', '').replace(/\.template$/, ''));
        } else if (relativeFilePath.startsWith('ci/gitlab/.gitlab-ci') || relativeFilePath.startsWith('ci/gitlab/mongodb-ci') || relativeFilePath.startsWith('ci/gitlab/postgres-ci') || relativeFilePath.startsWith('ci/gitlab/mysql-ci') ) {
           // Keep the original filename for GitLab root files, removing .template
            destFilePath = path.join(this.projectDir, path.basename(relativeFilePath).replace(/\.template$/, ''));
        } else if (relativeFilePath.startsWith('ci/jenkins/Jenkinsfile') || relativeFilePath.startsWith('ci/jenkins/mongodb-pipeline') || relativeFilePath.startsWith('ci/jenkins/postgres-pipeline') || relativeFilePath.startsWith('ci/jenkins/mysql-pipeline')) {
             // Keep the original filename for Jenkins root files, removing .template
             destFilePath = path.join(this.projectDir, path.basename(relativeFilePath).replace(/\.template$/, ''));
        } else if (relativeFilePath.startsWith('ci/bitbucket/bitbucket-pipelines') || relativeFilePath.startsWith('ci/bitbucket/mongodb-pipeline') || relativeFilePath.startsWith('ci/bitbucket/postgres-pipeline') || relativeFilePath.startsWith('ci/bitbucket/mysql-pipeline')){
            // Keep the original filename for Bitbucket root files, removing .template
            destFilePath = path.join(this.projectDir, path.basename(relativeFilePath).replace(/\.template$/, ''));
        } else if (destFilePath.endsWith('.template')) {
            destFilePath = destFilePath.replace(/\.template$/, '');
        }


        // Ensure destination directory exists
        await fs.ensureDir(path.dirname(destFilePath));

        // Process package.json separately
        if (path.basename(templatePath) === 'package.json') {
          await packageManager.mergePackageJson(templatePath);
        } else if (path.basename(templatePath) === 'login.ejs' && this.options.auth === 'oauth') {
          // Special handling for OAuth login template
          const destViewPath = path.join(this.projectDir, 'views', 'auth', 'login.ejs');
          await fs.ensureDir(path.dirname(destViewPath));
          await fs.copy(templatePath, destViewPath);
          console.log(`info: Created OAuth login template: ${destViewPath}`);
        } else if (path.basename(templatePath) === 'oauth.config.ts' && this.options.auth === 'oauth') {
            const destConfigPath = path.join(this.projectDir, 'src', 'config', 'oauth.config.ts');
            await fs.ensureDir(path.dirname(destConfigPath));
            await fs.copy(templatePath, destConfigPath);
            console.log(`info: Created OAuth config: ${destConfigPath}`);
        } else if (path.basename(templatePath) === 'user.model.ts' && this.options.auth === 'oauth') {
            const destModelPath = path.join(this.projectDir, 'src', 'models', 'user.model.ts');
            // Only copy if it doesn't exist, avoid overwriting DB-specific user model
            if (!fs.existsSync(destModelPath)) {
                await fs.ensureDir(path.dirname(destModelPath));
                await fs.copy(templatePath, destModelPath);
                console.log(`info: Created OAuth user model: ${destModelPath}`);
            }
         } else {
          // For other files, copy them, potentially processing with Handlebars
          if (templatePath.endsWith('.template')) {
            const templateContent = await fs.readFile(templatePath, 'utf-8');
            // Basic check if Handlebars syntax is present
            if (templateContent.includes('{{') && templateContent.includes('}}')) {
              const template = Handlebars.compile(templateContent);
              const result = template({ projectName: path.basename(this.projectDir), ...this.options });
              await fs.writeFile(destFilePath, result);
            } else {
              // If no Handlebars syntax, just copy the file
              await fs.copy(templatePath, destFilePath);
            }
          } else {
            // Copy non-template files directly
            await fs.copy(templatePath, destFilePath);
          }
        }
      } else {
        console.warn(`warn: Template source not found for ${relativeFilePath}`);
      }
    }
    // Finalize package.json after merging all parts
    await packageManager.finalizePackageJson();
  }
}

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

// Function to get the highest priority existing template path
export function getTemplatePath(
  relativePath: string,
  options: {
    framework: Framework;
    database: Database;
    auth: Auth;
    ci: CI;
  }
): string | null {
  const templateTypes: (keyof typeof options | 'common')[] = [
    'framework',
    'database',
    'auth',
    'ci',
    'common',
  ];

  // console.log(`Looking for template: ${relativePath}`);

  for (const type of templateTypes) {
    let baseDir: string;
    let isDbSpecificCiFile = false;
    let requiredDbType: Database | null = null;

    if (type === 'common') {
      baseDir = path.join(TEMPLATES_DIR, 'common', 'base');
    } else if (type === 'framework') {
      baseDir = path.join(TEMPLATES_DIR, 'frameworks', options.framework);
    } else if (type === 'database') {
      baseDir = path.join(TEMPLATES_DIR, 'databases', options.database);
    } else if (type === 'auth') {
      baseDir = path.join(TEMPLATES_DIR, 'auth', options.auth);
    } else { // type === 'ci'
      baseDir = path.join(TEMPLATES_DIR, 'ci', options.ci);
      // Check if the relative path points to a database-specific CI file
      const filename = path.basename(relativePath);
      requiredDbType = getDatabaseTypeFromCiFilename(filename);
      if (requiredDbType) {
        isDbSpecificCiFile = true;
        // console.log(`Detected DB-specific CI file: ${filename}, requires DB: ${requiredDbType}`);
      }
    }

    // Check for combined paths first (e.g., framework/database specific)
    if (type === 'framework' || type === 'database' || type === 'auth' || type === 'ci') {
      // Try framework/database combination
      if (options.framework && options.database) {
          const frameworkDbPath = path.join(
              TEMPLATES_DIR,
              'frameworks',
              options.framework,
              'databases',
              options.database,
              relativePath
          );
          // console.log(`Checking Framework/DB path: ${frameworkDbPath}`);
          if (templateExists(frameworkDbPath)) {
              // console.log(`Found framework/DB template: ${frameworkDbPath}`);
              return frameworkDbPath;
          }
      }
      // Try framework/auth combination
      if (options.framework && options.auth) {
          const frameworkAuthPath = path.join(
              TEMPLATES_DIR,
              'frameworks',
              options.framework,
              'auth',
              options.auth,
              relativePath
          );
          // console.log(`Checking Framework/Auth path: ${frameworkAuthPath}`);
          if (templateExists(frameworkAuthPath)) {
              // console.log(`Found framework/Auth template: ${frameworkAuthPath}`);
              return frameworkAuthPath;
          }
      }
      // Try database/auth combination
      if (options.database && options.auth) {
          const databaseAuthPath = path.join(
              TEMPLATES_DIR,
              'databases',
              options.database,
              'auth',
              options.auth,
              relativePath
          );
          // console.log(`Checking DB/Auth path: ${databaseAuthPath}`);
          if (templateExists(databaseAuthPath)) {
              // console.log(`Found DB/Auth template: ${databaseAuthPath}`);
              return databaseAuthPath;
          }
      }
       // Try framework/ci combination
       if (options.framework && options.ci) {
        const frameworkCiPath = path.join(
            TEMPLATES_DIR,
            'frameworks',
            options.framework,
            'ci',
            options.ci,
            relativePath
        );
        // console.log(`Checking Framework/CI path: ${frameworkCiPath}`);
        if (templateExists(frameworkCiPath)) {
            // console.log(`Found framework/CI template: ${frameworkCiPath}`);
            return frameworkCiPath;
        }
    }
    // Try database/ci combination
    if (options.database && options.ci) {
        const databaseCiPath = path.join(
            TEMPLATES_DIR,
            'databases',
            options.database,
            'ci',
            options.ci,
            relativePath
        );
        // console.log(`Checking DB/CI path: ${databaseCiPath}`);
        if (templateExists(databaseCiPath)) {
            // console.log(`Found DB/CI template: ${databaseCiPath}`);
            return databaseCiPath;
        }
    }
    // Try auth/ci combination
    if (options.auth && options.ci) {
        const authCiPath = path.join(
            TEMPLATES_DIR,
            'auth',
            options.auth,
            'ci',
            options.ci,
            relativePath
        );
        // console.log(`Checking Auth/CI path: ${authCiPath}`);
        if (templateExists(authCiPath)) {
            // console.log(`Found Auth/CI template: ${authCiPath}`);
            return authCiPath;
        }
    }
    }


    const fullPath = path.join(baseDir, relativePath);
    // console.log(`Checking ${type} path: ${fullPath}`);

    if (templateExists(fullPath)) {
      // If it's a DB-specific CI file, ensure the DB type matches the selected option
      if (isDbSpecificCiFile) {
        if (requiredDbType === options.database) {
          // console.log(`Found matching DB-specific CI template: ${fullPath}`);
          return fullPath;
        } else {
          // console.log(`Skipping non-matching DB-specific CI template: ${fullPath}`);
          continue; // Skip this template, look for the next type (e.g., common)
        }
      } else {
        // For non-DB-specific CI files or other types, return immediately
        // console.log(`Found ${type} template: ${fullPath}`);
        return fullPath;
      }
    }
  }

  // console.log(`Template not found for: ${relativePath}`);
  return null; // No template found
} 