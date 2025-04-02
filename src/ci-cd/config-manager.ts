import { CICDConfig, PipelineConfig, StageConfig, VCSPlatform, PipelineStage, DeploymentPlatform } from '../types/ci-cd';

export class CICDConfigManager {
  private config: CICDConfig;

  constructor() {
    this.config = {
      enabled: false,
      platform: 'github',
      stages: ['build', 'test', 'lint'],
      deploymentPlatform: 'none'
    };
  }

  public setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  public setPlatform(platform: VCSPlatform): void {
    this.config.platform = platform;
  }

  public setStages(stages: PipelineStage[]): void {
    this.config.stages = stages;
  }

  public setDeploymentPlatform(platform: DeploymentPlatform): void {
    this.config.deploymentPlatform = platform;
  }

  public getConfig(): CICDConfig {
    return { ...this.config };
  }

  public generatePipelineConfig(): PipelineConfig {
    const config: PipelineConfig = {
      name: 'CI/CD Pipeline',
      stages: this.config.stages,
      triggers: ['push', 'pull_request']
    };

    if (this.config.deploymentPlatform !== 'none') {
      config.environment = this.generateEnvironmentConfig();
    }

    return config;
  }

  private generateEnvironmentConfig(): Record<string, string> {
    const env: Record<string, string> = {};

    switch (this.config.deploymentPlatform) {
      case 'aws':
        env.AWS_ACCESS_KEY_ID = '${{ secrets.AWS_ACCESS_KEY_ID }}';
        env.AWS_SECRET_ACCESS_KEY = '${{ secrets.AWS_SECRET_ACCESS_KEY }}';
        env.AWS_REGION = '${{ secrets.AWS_REGION }}';
        break;
      case 'gcp':
        env.GOOGLE_CLOUD_KEY = '${{ secrets.GOOGLE_CLOUD_KEY }}';
        env.GOOGLE_PROJECT_ID = '${{ secrets.GOOGLE_PROJECT_ID }}';
        break;
      case 'azure':
        env.AZURE_CREDENTIALS = '${{ secrets.AZURE_CREDENTIALS }}';
        break;
      case 'heroku':
        env.HEROKU_API_KEY = '${{ secrets.HEROKU_API_KEY }}';
        env.HEROKU_APP_NAME = '${{ secrets.HEROKU_APP_NAME }}';
        break;
      case 'digital-ocean':
        env.DIGITALOCEAN_ACCESS_TOKEN = '${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}';
        break;
    }

    return env;
  }

  public generateStageConfigs(): StageConfig[] {
    return this.config.stages.map(stage => this.generateStageConfig(stage));
  }

  private generateStageConfig(stage: PipelineStage): StageConfig {
    const baseConfig: StageConfig = {
      name: stage,
      commands: [],
      dependencies: []
    };

    switch (stage) {
      case 'build':
        baseConfig.commands = [
          'npm ci',
          'npm run build'
        ];
        break;
      case 'test':
        baseConfig.commands = [
          'npm ci',
          'npm run test'
        ];
        baseConfig.dependencies = ['build'];
        break;
      case 'lint':
        baseConfig.commands = [
          'npm ci',
          'npm run lint'
        ];
        break;
      case 'docker-build':
        baseConfig.commands = [
          'docker build -t $IMAGE_NAME .'
        ];
        baseConfig.dependencies = ['build'];
        break;
      case 'docker-push':
        baseConfig.commands = [
          'docker push $IMAGE_NAME'
        ];
        baseConfig.dependencies = ['docker-build'];
        break;
      case 'deploy-dev':
      case 'deploy-staging':
      case 'deploy-prod':
        baseConfig.commands = this.generateDeployCommands(stage);
        baseConfig.dependencies = ['docker-push'];
        baseConfig.environment = this.generateEnvironmentConfig();
        break;
    }

    return baseConfig;
  }

  private generateDeployCommands(stage: PipelineStage): string[] {
    const commands: string[] = [];
    const environment = stage.replace('deploy-', '');

    switch (this.config.deploymentPlatform) {
      case 'aws':
        commands.push(
          'aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID',
          'aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY',
          'aws configure set region $AWS_REGION',
          `aws ecs update-service --cluster ${environment} --service $SERVICE_NAME --force-new-deployment`
        );
        break;
      case 'gcp':
        commands.push(
          'echo $GOOGLE_CLOUD_KEY | base64 -d > /tmp/google-cloud-key.json',
          'export GOOGLE_APPLICATION_CREDENTIALS=/tmp/google-cloud-key.json',
          'gcloud auth activate-service-account --key-file=/tmp/google-cloud-key.json',
          `gcloud run deploy $SERVICE_NAME --image $IMAGE_NAME --platform managed --region $REGION --project $GOOGLE_PROJECT_ID`
        );
        break;
      case 'azure':
        commands.push(
          'az login --service-principal -u $AZURE_SP_ID -p $AZURE_SP_KEY --tenant $AZURE_TENANT_ID',
          `az webapp deployment container config --name $APP_NAME --resource-group $RESOURCE_GROUP --docker-custom-image-name $IMAGE_NAME`
        );
        break;
      case 'heroku':
        commands.push(
          'heroku container:login',
          `heroku container:push web --app $HEROKU_APP_NAME-${environment}`,
          `heroku container:release web --app $HEROKU_APP_NAME-${environment}`
        );
        break;
      case 'digital-ocean':
        commands.push(
          'doctl auth init --access-token $DIGITALOCEAN_ACCESS_TOKEN',
          `doctl apps create-deployment $APP_ID --force-rebuild`
        );
        break;
    }

    return commands;
  }
} 