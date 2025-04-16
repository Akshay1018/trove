import { join, dirname } from 'path';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs-extra';
import { TemplateOptions as ManagerTemplateOptions } from '../types/template-options';
import { TemplateOptions as ExternalTemplateOptions } from '../types/template';
import { logger } from './logger';
import ejs from 'ejs';
import { resolveDependencies } from '../package-manager/dependency-resolver';
import { getRequiredFiles, createDirectoryStructure, Database } from '../templates/structure';
import * as path from 'path';
import * as fs from 'fs-extra';
import { PackageManager } from '../types/package-manager';
import { TEMPLATES_DIR, BASE_TEMPLATE_PATH } from '../config/constants';

export class TemplateManager {
  private templateOptions: ManagerTemplateOptions;
  private projectPath: string;
  private templatesPath: string;
  private dependencies: Record<string, string>;
  private devDependencies: Record<string, string>;
  private packageManager: PackageManager;

  constructor(options: ManagerTemplateOptions, projectPath: string) {
    this.templateOptions = {
      projectName: path.basename(projectPath),
      ...options,
    };
    this.projectPath = projectPath;
    this.templatesPath = TEMPLATES_DIR;
    this.dependencies = {};
    this.devDependencies = {};
    this.packageManager = options.packageManager || 'npm';
  }

  async createProject(projectName: string): Promise<void> {
    try {
      const projectPath = join(process.cwd(), projectName);
      if (existsSync(projectPath)) {
        throw new Error(`Directory ${projectName} already exists`);
      }

      const externalOptions: ExternalTemplateOptions = {
        projectName: this.templateOptions.projectName,
        framework: this.templateOptions.framework,
        database: this.templateOptions.database,
        auth: this.templateOptions.auth,
        ci: this.templateOptions.ci,
      };

      const files = getRequiredFiles(externalOptions);

      createDirectoryStructure(externalOptions);

      const resolvedDeps = resolveDependencies(externalOptions);
      this.dependencies = resolvedDeps.dependencies;
      this.devDependencies = resolvedDeps.devDependencies;

      for (const file of files) {
        const targetPath = join(projectPath, this.getTargetPath(file));
        const sourcePath = this.getTemplatePath(file);

        if (!sourcePath) {
          logger.warn(`Template source not found for ${file}`);
          continue;
        }
        
        const content = readFileSync(sourcePath, 'utf-8');

        const targetDir = dirname(targetPath);
        if (!existsSync(targetDir)) {
          mkdirSync(targetDir, { recursive: true });
        }

        const processedContent = this.replacePlaceholders(content, this.templateOptions);
        writeFileSync(targetPath, processedContent);
      }

      if (this.templateOptions.auth === 'oauth') {
        this.processOAuthTemplates(projectPath, this.templateOptions);
      }

      logger.info('Project created successfully');
    } catch (error) {
      logger.error('Failed to create project:', error);
      throw error;
    }
  }

  private processOAuthTemplates(projectPath: string, options: ManagerTemplateOptions): void {
    try {
      const viewsDir = join(projectPath, 'views');
      const authViewsDir = join(viewsDir, 'auth');
      
      if (!existsSync(viewsDir)) mkdirSync(viewsDir, { recursive: true });
      if (!existsSync(authViewsDir)) mkdirSync(authViewsDir, { recursive: true });
      
      const loginTemplateSrc = join(this.templatesPath, 'auth', 'oauth', 'views', 'auth', 'login.ejs.template');
      const loginTemplateDest = join(projectPath, 'views', 'auth', 'login.ejs');
      
      if (existsSync(loginTemplateSrc)) {
        let content = readFileSync(loginTemplateSrc, 'utf-8');
        content = ejs.render(content, {
          title: options.projectName,
          providers: ['google', 'github']
        });
        writeFileSync(loginTemplateDest, content);
        logger.info(`Created OAuth login template: ${loginTemplateDest}`);
      }
      
      const oauthConfigSrc = join(this.templatesPath, 'auth', 'oauth', 'config', 'oauth.config.ts.template');
      const oauthConfigDest = join(projectPath, 'src', 'config', 'oauth.config.ts');
      
      if (existsSync(oauthConfigSrc)) {
        let content = readFileSync(oauthConfigSrc, 'utf-8');
        content = this.replacePlaceholders(content, options);
        writeFileSync(oauthConfigDest, content);
        logger.info(`Created OAuth config: ${oauthConfigDest}`);
      }
      
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
    let targetPath = templatePath;
    targetPath = targetPath.replace(/^frameworks\/[^/]+\//, '');
    targetPath = targetPath.replace(/^databases\/[^/]+\//, '');
    targetPath = targetPath.replace(/^auth\/[^/]+\//, '');
    targetPath = targetPath.replace(/^ci\/[^/]+\//, '');
    targetPath = targetPath.replace(/^common\/base\//, '');
    targetPath = targetPath.replace(/\.template$/, '');

    if (targetPath.includes('.github/workflows/') || targetPath.includes('.gitlab-ci') || targetPath.includes('Jenkinsfile') || targetPath.includes('bitbucket-pipelines')) {
      return targetPath.startsWith('.') ? targetPath : path.basename(targetPath); 
    }
    if (targetPath.match(/^(models|repositories|controllers|services|middleware|config|utils|types)\//)) {
      return path.join('src', targetPath);
    }
    if (targetPath.startsWith('src/') || targetPath.startsWith('__tests__')) {
       return targetPath.startsWith('__tests__') ? path.join('src', targetPath) : targetPath;
    }
    if (targetPath.startsWith('views/')) {
      return targetPath;
    }
    return targetPath;
  }

  private loadTemplate(filePath: string): string {
     const templatePath = this.getTemplatePath(filePath);
     if (!templatePath || !existsSync(templatePath)) {
       throw new Error(`Template source path not found or invalid for: ${filePath}`);
     }
     return readFileSync(templatePath, 'utf-8');
  }

  private replacePlaceholders(content: string, options: ManagerTemplateOptions): string {
    return ejs.render(content, {
      projectName: options.projectName,
      name: options.projectName,
      title: options.projectName,
      description: options.description || `A modern Node.js backend application using ${options.framework} and ${options.database}`,
      author: options.author || process.env.USER || 'Anonymous',
      version: options.version || '1.0.0',
      license: options.license || 'MIT',
      nodeVersion: process.version,
      ...options,
      dependencies: this.dependencies,
      devDependencies: this.devDependencies
    });
  }

  private templateExists(templatePath: string): boolean {
    return fs.existsSync(templatePath);
  }

  private getDatabaseTypeFromCiFilename(filename: string): Database | undefined {
    if (filename.includes('mongodb')) return 'mongodb';
    if (filename.includes('postgres')) return 'postgres';
    if (filename.includes('mysql')) return 'mysql';
    if (filename.includes('skip')) return 'skip'; 
    return undefined;
  }

  private getTemplatePath(relativePath: string): string | null {
    const priority: (keyof ManagerTemplateOptions | 'common')[] = [
      'framework',
      'database',
      'auth',
      'ci',
      'common',
    ];

    for (const type of priority) {
      let baseDir: string | null = null;
      let isDbSpecificCiFile = false;
      let requiredDbType: Database | undefined = undefined;
      let optionValue: string | undefined;

      switch (type) {
        case 'common':
          baseDir = BASE_TEMPLATE_PATH;
          optionValue = 'common';
          break;
        case 'framework':
          optionValue = this.templateOptions.framework;
          if (optionValue) baseDir = path.join(TEMPLATES_DIR, 'frameworks', optionValue);
          break;
        case 'database':
          optionValue = this.templateOptions.database;
          if (optionValue && optionValue !== 'skip') baseDir = path.join(TEMPLATES_DIR, 'databases', optionValue);
          break;
        case 'auth':
          optionValue = this.templateOptions.auth;
          if (optionValue && optionValue !== 'skip') baseDir = path.join(TEMPLATES_DIR, 'auth', optionValue);
          break;
        case 'ci':
          optionValue = this.templateOptions.ci;
          if (optionValue && optionValue !== 'skip') {
            baseDir = path.join(TEMPLATES_DIR, 'ci', optionValue);
            const filename = path.basename(relativePath);
            requiredDbType = this.getDatabaseTypeFromCiFilename(filename);
            if (requiredDbType && requiredDbType !== 'skip') {
              isDbSpecificCiFile = true;
            }
          }
          break;
      }

      if (!baseDir) continue;
      
      const simplePath = path.join(baseDir, relativePath.replace(/^[^/]+\//, ''));
      const simplePathDirect = path.join(baseDir, relativePath);
      
      const pathsToCheck = [simplePathDirect, simplePath].filter((p, i, self) => self.indexOf(p) === i);

      for (const checkPath of pathsToCheck) {
         if (this.templateExists(checkPath)) {
            if (isDbSpecificCiFile) {
               if (requiredDbType === this.templateOptions.database) {
                 return checkPath;
               }
            } else {
              return checkPath;
            }
         }
      }
    }
    
    const commonBasePath = path.join(BASE_TEMPLATE_PATH, relativePath.replace(/^common\/base\//, ''));
    if (this.templateExists(commonBasePath)) {
        return commonBasePath;
    }

    return null;
  }

  public async copyTemplateFiles(): Promise<void> {
    const externalOptions: ExternalTemplateOptions = {
        projectName: this.templateOptions.projectName,
        framework: this.templateOptions.framework,
        database: this.templateOptions.database,
        auth: this.templateOptions.auth,
        ci: this.templateOptions.ci,
      };
    const requiredFiles = getRequiredFiles(externalOptions);
    
    await createDirectoryStructure(externalOptions);

    for (const relativeFilePath of requiredFiles) {
      const templatePath = this.getTemplatePath(relativeFilePath);

      if (templatePath) {
        const destFilePath = path.join(this.projectPath, this.getTargetPath(relativeFilePath));
        await fs.ensureDir(path.dirname(destFilePath));

        if (path.basename(destFilePath) === 'package.json') {
           await this.processTemplateFile(templatePath, destFilePath);
        } else if (path.basename(destFilePath) === 'login.ejs' && this.templateOptions.auth === 'oauth') {
           this.processOAuthSpecificFile(templatePath, destFilePath, 'login.ejs', this.templateOptions);
        } else if (path.basename(destFilePath) === 'oauth.config.ts' && this.templateOptions.auth === 'oauth') {
           this.processOAuthSpecificFile(templatePath, destFilePath, 'oauth.config.ts', this.templateOptions);
        } else if (path.basename(destFilePath) === 'user.model.ts' && this.templateOptions.auth === 'oauth') {
           this.processOAuthSpecificFile(templatePath, destFilePath, 'user.model.ts', this.templateOptions);
         } else {
           await this.processTemplateFile(templatePath, destFilePath);
        }
      } else {
        if (!(relativeFilePath.includes('user.model.ts') && this.templateOptions.auth === 'oauth')) {
            logger.warn(`warn: Template source not found for ${relativeFilePath}`);
        }
      }
    }
    logger.info('Template files copied successfully.');
  }
  
  private async processOAuthSpecificFile(templatePath: string, destFilePath: string, type: 'login.ejs' | 'oauth.config.ts' | 'user.model.ts', options: ManagerTemplateOptions) {
      if (type === 'login.ejs') {
           const destViewPath = path.join(this.projectPath, 'views', 'auth', 'login.ejs');
           await fs.ensureDir(path.dirname(destViewPath));
           const templateContent = await fs.readFile(templatePath, 'utf-8');
           const processedContent = ejs.render(templateContent, {
              projectName: options.projectName, 
              title: options.projectName,
              providers: ['google', 'github']
            });
           await fs.writeFile(destViewPath, processedContent);
           logger.info(`Created OAuth login template: ${destViewPath}`);
      } else if (type === 'oauth.config.ts') {
           const destConfigPath = path.join(this.projectPath, 'src', 'config', 'oauth.config.ts');
           await fs.ensureDir(path.dirname(destConfigPath));
           await this.processTemplateFile(templatePath, destConfigPath);
           logger.info(`Created OAuth config: ${destConfigPath}`);
      } else if (type === 'user.model.ts') {
           const destModelPath = path.join(this.projectPath, 'src', 'models', 'user.model.ts');
            if (!fs.existsSync(destModelPath)) {
                await fs.ensureDir(path.dirname(destModelPath));
                await this.processTemplateFile(templatePath, destModelPath);
                logger.info(`Created OAuth user model: ${destModelPath}`);
            } else {
              logger.info(`Skipping OAuth user model creation, ${destModelPath} already exists (likely from DB template).`);
            }
      }
  }

  public async processTemplates(): Promise<void> {
     logger.info('Processing templates...');
     await this.copyTemplateFiles(); 
     logger.info('Template processing finished.');
  }

  private async processTemplateFile(templatePath: string, destFilePath: string): Promise<void> {
    try {
      const templateContent = await fs.readFile(templatePath, 'utf-8');
      if (templateContent.includes('<%') || templateContent.includes('%>')) { 
        const result = this.replacePlaceholders(templateContent, this.templateOptions); 
        await fs.writeFile(destFilePath, result);
      } else {
        await fs.copy(templatePath, destFilePath);
      }
    } catch (error) {
        logger.error(`Error processing template file ${templatePath} to ${destFilePath}:`, error);
    }
  }
} 