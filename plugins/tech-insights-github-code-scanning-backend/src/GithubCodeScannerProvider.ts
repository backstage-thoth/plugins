import {
  GithubCredentialsProvider,
  ScmIntegrations,
  GithubIntegrationConfig,
  GithubIntegration,
  SingleInstanceGithubCredentialsProvider,
} from '@backstage/integration';
import { Config } from '@backstage/config';
import { Entity } from '@backstage/catalog-model';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';

export const GITHUB_REPO_ANNOTATION = 'github.com/project-slug';

const isSecurityInsightsAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[GITHUB_REPO_ANNOTATION]);

export const useProjectEntity = (entity: Entity) => {
  const projectSlug = entity.metadata?.annotations?.[
    GITHUB_REPO_ANNOTATION
  ] as string;
  return {
    owner: projectSlug.split('/')[0],
    repo: projectSlug.split('/')[1],
  };
};

export class GithubCodeScannerProvider {
  private readonly integration: GithubIntegrationConfig;
  private readonly githubCredentialsProvider: GithubCredentialsProvider;

  static fromConfig(config: Config): GithubCodeScannerProvider {
    const integrations = ScmIntegrations.fromConfig(config);

    const integrationHost = 'github.com';
    const integration = integrations.github.byHost(integrationHost);

    if (!integration) {
      throw new Error(
        `There is no GitHub config that matches host ${integrationHost}. Please add a configuration entry for it under integrations.github`,
      );
    }

    return new GithubCodeScannerProvider(integration);
  }

  private constructor(integration: GithubIntegration) {
    this.integration = integration.config;
    this.githubCredentialsProvider =
      SingleInstanceGithubCredentialsProvider.create(integration.config);
  }

  /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.getProviderName} */
  getProviderName(): string {
    return `github-provider:1`;
  }

  private async getClient(
    projectEntity: ReturnType<typeof useProjectEntity>,
  ): Promise<Octokit> {
    const { token: githubToken } =
      await this.githubCredentialsProvider.getCredentials({
        url: `https://${this.integration.host}//${projectEntity.owner}`,
      });

    return new Octokit({
      auth: githubToken,
      baseUrl: this.integration.apiBaseUrl,
    });
  }

  async getAlerts(entity: Entity): Promise<{
    isCodeScanningEnabled: true | false | 'na';
    alerts?: (RestEndpointMethodTypes['codeScanning']['listAlertsForRepo']['response']['data'][number] & {
      rule: { security_severity_level?: string };
    })[];
  }> {
    if (!isSecurityInsightsAvailable(entity)) {
      return { isCodeScanningEnabled: 'na' };
    }

    try {
      const projectEntity = useProjectEntity(entity);
      const alerts: RestEndpointMethodTypes['codeScanning']['listAlertsForRepo']['response'] =
        await (
          await this.getClient(projectEntity)
        ).codeScanning.listAlertsForRepo({
          ...projectEntity,
        });

      return {
        isCodeScanningEnabled: true,
        alerts: alerts.data,
      };
    } catch (err: any) {
      return {
        isCodeScanningEnabled:
          err?.message?.includes('must be enabled') === undefined
            ? 'na'
            : false,
      };
    }
  }
}
