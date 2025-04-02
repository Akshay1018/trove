import { PipelineConfig, StageConfig } from '../../types/ci-cd';

export class GitHubActionsGenerator {
  public generateWorkflow(config: PipelineConfig, stages: StageConfig[]): string {
    const yaml = [
      'name: ' + config.name,
      '',
      'on:',
      '  push:',
      '    branches: [ main, master ]',
      '  pull_request:',
      '    branches: [ main, master ]',
      '',
      'jobs:'
    ];

    stages.forEach(stage => {
      yaml.push(...this.generateStage(stage));
    });

    return yaml.join('\n');
  }

  private generateStage(stage: StageConfig): string[] {
    const yaml = [
      `  ${stage.name}:`,
      '    runs-on: ubuntu-latest',
      ''
    ];

    if (stage.dependencies && stage.dependencies.length > 0) {
      yaml.push('    needs: [' + stage.dependencies.join(', ') + ']');
    }

    if (stage.environment) {
      yaml.push('    env:');
      Object.entries(stage.environment).forEach(([key, value]) => {
        yaml.push(`      ${key}: ${value}`);
      });
    }

    yaml.push(
      '    steps:',
      '    - uses: actions/checkout@v4',
      '',
      '    - name: Setup Node.js',
      '      uses: actions/setup-node@v4',
      '      with:',
      '        node-version: 20',
      '        cache: npm',
      ''
    );

    stage.commands.forEach(command => {
      yaml.push(
        `    - name: ${command}`,
        `      run: ${command}`
      );
    });

    if (stage.artifacts) {
      yaml.push(
        '    - name: Upload artifacts',
        '      uses: actions/upload-artifact@v4',
        '      with:',
        '        name: ' + stage.name + '-artifacts',
        '        path: ' + stage.artifacts.join('\n')
      );
    }

    yaml.push('');
    return yaml;
  }
} 