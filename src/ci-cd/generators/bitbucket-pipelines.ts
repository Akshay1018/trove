import { PipelineConfig, StageConfig } from '../../types/ci-cd';

export class BitbucketPipelinesGenerator {
  public generatePipeline(config: PipelineConfig, stages: StageConfig[]): string {
    const yaml = [
      'image: node:20',
      '',
      'definitions:',
      '  caches:',
      '    npm: ~/.npm',
      '',
      'pipelines:',
      '  default:',
      '    - parallel:',
      ...this.generateStages(stages),
      '',
      '  branches:',
      '    main:',
      '      - parallel:',
      ...this.generateStages(stages),
      '',
      '    master:',
      '      - parallel:',
      ...this.generateStages(stages)
    ];

    if (config.environment) {
      yaml.push('', 'definitions:', '  variables:');
      Object.entries(config.environment).forEach(([key, value]) => {
        yaml.push(`    ${key}: ${value}`);
      });
    }

    return yaml.join('\n');
  }

  private generateStages(stages: StageConfig[]): string[] {
    return stages.map(stage => {
      const stageYaml = [
        '      - step:',
        `          name: ${stage.name}`,
        '          caches:',
        '            - npm',
        '          script:'
      ];

      stage.commands.forEach(command => {
        stageYaml.push(`            - ${command}`);
      });

      if (stage.environment) {
        stageYaml.push('          variables:');
        Object.entries(stage.environment).forEach(([key, value]) => {
          stageYaml.push(`            ${key}: ${value}`);
        });
      }

      if (stage.artifacts) {
        stageYaml.push('          artifacts:');
        stage.artifacts.forEach(artifact => {
          stageYaml.push(`            - ${artifact}`);
        });
      }

      return stageYaml.join('\n');
    });
  }
} 