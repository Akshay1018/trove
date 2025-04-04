import { VCSPlatform, PipelineConfig, StageConfig } from '../types/ci-cd';
import { GitHubActionsGenerator } from './generators/github-actions';
import { GitLabCIGenerator } from './generators/gitlab-ci';
import { BitbucketPipelinesGenerator } from './generators/bitbucket-pipelines';

export class PipelineGenerator {
  private githubGenerator: GitHubActionsGenerator;
  private gitlabGenerator: GitLabCIGenerator;
  private bitbucketGenerator: BitbucketPipelinesGenerator;

  constructor() {
    this.githubGenerator = new GitHubActionsGenerator();
    this.gitlabGenerator = new GitLabCIGenerator();
    this.bitbucketGenerator = new BitbucketPipelinesGenerator();
  }

  public generatePipeline(
    platform: VCSPlatform,
    config: PipelineConfig,
    stages: StageConfig[]
  ): { content: string; path: string } {
    switch (platform) {
      case 'github':
        return {
          content: this.githubGenerator.generateWorkflow(config, stages),
          path: '.github/workflows/ci.yml'
        };
      case 'gitlab':
        return {
          content: this.gitlabGenerator.generatePipeline(config, stages),
          path: '.gitlab-ci.yml'
        };
      case 'bitbucket':
        return {
          content: this.bitbucketGenerator.generatePipeline(config, stages),
          path: 'bitbucket-pipelines.yml'
        };
      case 'azure-devops':
        // TODO: Implement Azure DevOps pipeline generator
        throw new Error('Azure DevOps pipeline generation not implemented yet');
      case 'circleci':
        // TODO: Implement CircleCI pipeline generator
        throw new Error('CircleCI pipeline generation not implemented yet');
      case 'jenkins':
        // TODO: Implement Jenkinsfile generator
        throw new Error('Jenkins pipeline generation not implemented yet');
      default:
        throw new Error(`Unsupported VCS platform: ${platform}`);
    }
  }

  public getSecretInstructions(platform: VCSPlatform): string {
    switch (platform) {
      case 'github':
        return `
To set up secrets in GitHub:
1. Go to your repository settings
2. Navigate to Secrets and Variables > Actions
3. Click "New repository secret"
4. Add each required secret with its corresponding value
`;
      case 'gitlab':
        return `
To set up secrets in GitLab:
1. Go to your project's Settings > CI/CD
2. Expand the Variables section
3. Click "Add variable"
4. Add each required secret, making sure to mark them as "Protected" and "Masked"
`;
      case 'bitbucket':
        return `
To set up secrets in Bitbucket:
1. Go to your repository settings
2. Navigate to Repository variables
3. Click "Add variable"
4. Add each required secret, marking them as "Secured" if they contain sensitive data
`;
      case 'azure-devops':
        return `
To set up secrets in Azure DevOps:
1. Go to your project settings
2. Navigate to Pipelines > Library
3. Create a new variable group
4. Add your secrets and mark them as secure
`;
      case 'circleci':
        return `
To set up secrets in CircleCI:
1. Go to your project settings
2. Navigate to Environment Variables
3. Click "Add Variable"
4. Add each required secret
`;
      case 'jenkins':
        return `
To set up secrets in Jenkins:
1. Go to Manage Jenkins > Manage Credentials
2. Choose a credentials domain
3. Click "Add Credentials"
4. Add your secrets as credentials
`;
      default:
        throw new Error(`Unsupported VCS platform: ${platform}`);
    }
  }
} 