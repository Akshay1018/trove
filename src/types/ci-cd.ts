export type VCSPlatform = 'github' | 'gitlab' | 'bitbucket' | 'azure-devops' | 'circleci' | 'jenkins';

export type PipelineStage = 'build' | 'test' | 'lint' | 'docker-build' | 'docker-push' | 'deploy-dev' | 'deploy-staging' | 'deploy-prod';

export type DeploymentPlatform = 'aws' | 'gcp' | 'azure' | 'heroku' | 'digital-ocean' | 'none';

export interface CICDConfig {
  enabled: boolean;
  platform: VCSPlatform;
  stages: PipelineStage[];
  deploymentPlatform: DeploymentPlatform;
}

export interface PipelineConfig {
  name: string;
  stages: PipelineStage[];
  triggers: string[];
  environment?: Record<string, string>;
}

export interface StageConfig {
  name: PipelineStage;
  commands: string[];
  dependencies?: string[];
  artifacts?: string[];
  environment?: Record<string, string>;
} 