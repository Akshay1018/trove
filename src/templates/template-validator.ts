import { TemplateConfig, TemplateFile } from './types';

export class TemplateValidator {
  public validateConfig(config: TemplateConfig): void {
    if (!config.projectName) {
      throw new Error('Project name is required');
    }

    if (!config.framework) {
      throw new Error('Framework is required');
    }

    if (config.database && !['mongodb', 'postgresql', 'mysql'].includes(config.database)) {
      throw new Error('Invalid database selection');
    }

    if (config.auth && !['jwt', 'session', 'oauth'].includes(config.auth)) {
      throw new Error('Invalid authentication method');
    }

    if (config.cicd) {
      this.validateCiCdConfig(config.cicd);
    }
  }

  public validateTemplateFile(file: TemplateFile): void {
    if (!file.path) {
      throw new Error('Template file path is required');
    }

    if (typeof file.content !== 'string') {
      throw new Error('Template file content must be a string');
    }

    // Validate file path format
    if (file.path.includes('..')) {
      throw new Error('Invalid file path: path traversal not allowed');
    }

    // Validate file extension for config files
    if (file.isConfig && !file.path.endsWith('.ejs')) {
      throw new Error('Config files must have .ejs extension');
    }
  }

  private validateCiCdConfig(cicd: { platform: string; stages: string[]; deploymentPlatform?: string }): void {
    const validPlatforms = ['github', 'gitlab', 'bitbucket', 'azure-devops', 'circleci', 'jenkins'];
    if (!validPlatforms.includes(cicd.platform)) {
      throw new Error('Invalid CI/CD platform');
    }

    const validStages = ['build', 'test', 'lint', 'docker-build', 'docker-push', 'deploy-dev', 'deploy-staging', 'deploy-prod'];
    cicd.stages.forEach(stage => {
      if (!validStages.includes(stage)) {
        throw new Error(`Invalid CI/CD stage: ${stage}`);
      }
    });

    if (cicd.deploymentPlatform) {
      const validDeploymentPlatforms = ['aws', 'gcp', 'azure', 'heroku', 'digital-ocean', 'none'];
      if (!validDeploymentPlatforms.includes(cicd.deploymentPlatform)) {
        throw new Error('Invalid deployment platform');
      }
    }
  }

  public validateProjectStructure(directories: string[]): void {
    const requiredDirs = [
      'src',
      'src/config',
      'src/controllers',
      'src/models',
      'src/routes',
      'src/services',
      'src/utils',
      'tests'
    ];

    requiredDirs.forEach(dir => {
      if (!directories.includes(dir)) {
        throw new Error(`Required directory missing: ${dir}`);
      }
    });
  }

  public validateDependencies(dependencies: string[]): void {
    if (!Array.isArray(dependencies)) {
      throw new Error('Dependencies must be an array');
    }

    dependencies.forEach(dep => {
      if (typeof dep !== 'string') {
        throw new Error('Each dependency must be a string');
      }

      // Basic semver validation
      if (!dep.match(/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*@\d+\.\d+\.\d+(?:-[a-z0-9-]+)?$/)) {
        throw new Error(`Invalid dependency format: ${dep}`);
      }
    });
  }
} 