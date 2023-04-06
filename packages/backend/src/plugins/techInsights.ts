import {
  createRouter,
  buildTechInsightsContext,
  createFactRetrieverRegistration,
} from '@backstage/plugin-tech-insights-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { JsonRulesEngineFactCheckerFactory } from '@backstage/plugin-tech-insights-backend-module-jsonfc';
import {
  entityMetadataFactRetriever,
  techInsightRuleChecks,
} from '@backstage-thoth/plugin-tech-insights-backend';
import {
  githubCodeScannerRetriever,
  githubCodeScannerRuleChecks,
} from '@backstage-thoth/plugin-tech-insights-github-code-scanning-backend';

const ttlTwoWeeks = { timeToLive: { weeks: 2 } };

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const techInsightsContext = await buildTechInsightsContext({
    logger: env.logger,
    config: env.config,
    database: env.database,
    discovery: env.discovery,
    tokenManager: env.tokenManager,
    scheduler: env.scheduler,
    factRetrievers: [
      createFactRetrieverRegistration({
        cadence: '*/1 * * * *',
        factRetriever: entityMetadataFactRetriever,
        lifecycle: ttlTwoWeeks,
      }),
      createFactRetrieverRegistration({
        cadence: '*/1 * * * *',
        factRetriever: githubCodeScannerRetriever,
        lifecycle: ttlTwoWeeks,
      }),
    ],
    factCheckerFactory: new JsonRulesEngineFactCheckerFactory({
      logger: env.logger,
      checks: [...techInsightRuleChecks, ...githubCodeScannerRuleChecks],
    }),
  });

  return await createRouter({
    ...techInsightsContext,
    logger: env.logger,
    config: env.config,
  });
}
