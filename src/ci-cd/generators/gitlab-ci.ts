import { PipelineConfig, StageConfig } from '../../types/ci-cd';

export class GitLabCIGenerator {
  public generatePipeline(config: PipelineConfig, stages: StageConfig[]): string {
    const yaml = [
      'image: node:20',
      '',
      'stages:',
      ...stages.map(stage => `  - ${stage.name}`),
      '',
      'cache:',
      '  paths:',
      '    - node_modules/',
      ''
    ];

    if (config.environment) {
      yaml.push('variables:');
      Object.entries(config.environment).forEach(([key, value]) => {
        yaml.push(`  ${key}: ${value}`);
      });
      yaml.push('');
    }

    stages.forEach(stage => {
      yaml.push(...this.generateStage(stage));
    });

    return yaml.join('\n');
  }

  private generateStage(stage: StageConfig): string[] {
    const yaml = [
      `${stage.name}:`,
      `  stage: ${stage.name}`,
      '  script:'
    ];

    stage.commands.forEach(command => {
      yaml.push(`    - ${command}`);
    });

    if (stage.dependencies && stage.dependencies.length > 0) {
      yaml.push('  dependencies:');
      stage.dependencies.forEach(dep => {
        yaml.push(`    - ${dep}`);
      });
    }

    if (stage.artifacts) {
      yaml.push('  artifacts:',
        '    paths:');
      stage.artifacts.forEach(artifact => {
        yaml.push(`      - ${artifact}`);
      });
    }

    if (stage.environment) {
      yaml.push('  variables:');
      Object.entries(stage.environment).forEach(([key, value]) => {
        yaml.push(`    ${key}: ${value}`);
      });
    }

    yaml.push('');
    return yaml;
  }
} 