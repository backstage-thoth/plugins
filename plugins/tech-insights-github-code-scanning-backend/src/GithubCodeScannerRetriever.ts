import {
  FactRetriever,
  FactRetrieverContext,
  TechInsightFact,
} from '@backstage/plugin-tech-insights-node';
import { CatalogClient } from '@backstage/catalog-client';
import { GithubCodeScannerProvider } from './GithubCodeScannerProvider';

export enum FactId {
  isGithubCodeScanningEnabled = 'isGithubCodeScanningEnabled',
  hasGithubCodeScanningNoneSeverity = 'hasGithubCodeScanningNoneSeverity',
  hasGithubCodeScanningNoteSeverity = 'hasGithubCodeScanningNoteSeverity',
  hasGithubCodeScanningWarningSeverity = 'hasGithubCodeScanningWarningSeverity',
  hasGithubCodeScanningErrorSeverity = 'hasGithubCodeScanningErrorSeverity',
}

export const githubCodeScannerRetriever: FactRetriever = {
  id: 'githubCodeScannerRetriever',
  version: '0.0.1',
  title: 'Github Code Scanner Retriever',
  description: 'Generates facts from Github Code Scanner',
  schema: {
    [FactId.isGithubCodeScanningEnabled]: {
      type: 'boolean',
      description: 'Github code scanning is enabled',
    },
    [FactId.hasGithubCodeScanningNoneSeverity]: {
      type: 'boolean',
      description: 'Has Github code scanning alerts with none severity',
    },
    [FactId.hasGithubCodeScanningNoteSeverity]: {
      type: 'boolean',
      description: 'Has Github code scanning alerts with note severity',
    },
    [FactId.hasGithubCodeScanningWarningSeverity]: {
      type: 'boolean',
      description: 'Has Github code scanning alerts with warning severity',
    },
    [FactId.hasGithubCodeScanningErrorSeverity]: {
      type: 'boolean',
      description: 'Has Github code scanning alerts with error severity',
    },
  },
  handler: async ({
    config,
    discovery,
    entityFilter,
    tokenManager,
  }: FactRetrieverContext) => {
    const { token } = await tokenManager.getToken();
    const catalogClient = new CatalogClient({
      discoveryApi: discovery,
    });
    const entities = await catalogClient.getEntities(
      { filter: entityFilter },
      { token },
    );

    const githubCodeScannerProvider =
      GithubCodeScannerProvider.fromConfig(config);
    const result: TechInsightFact[] = [];
    for await (const entity of entities.items) {
      const alertsResult = await githubCodeScannerProvider.getAlerts(entity);

      const severities = {
        none: 0,
        note: 0,
        warning: 0,
        error: 0,
      };

      alertsResult.alerts?.forEach(alert => severities[alert.rule.severity!]++);

      result.push({
        entity: {
          namespace: entity.metadata.namespace!,
          kind: entity.kind,
          name: entity.metadata.name,
        },
        facts: {
          [FactId.isGithubCodeScanningEnabled]: Boolean(
            alertsResult.isCodeScanningEnabled === true ||
              alertsResult.isCodeScanningEnabled !== 'na',
          ),
          [FactId.hasGithubCodeScanningNoneSeverity]: Boolean(
            severities.none > 0
          ),
          [FactId.hasGithubCodeScanningNoteSeverity]: Boolean(
            severities.note > 0
          ),
          [FactId.hasGithubCodeScanningWarningSeverity]: Boolean(
            severities.warning > 0
          ),
          [FactId.hasGithubCodeScanningErrorSeverity]: Boolean(
            severities.error > 0
          ),
        },
      });
    }

    return result;
  },
};
