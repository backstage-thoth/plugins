import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth,
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  configApiRef,
  createApiFactory,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import {
  techInsightsApiRef,
  TechInsightsClient,
  checksMetadata,
} from '@backstage-thoth/plugin-tech-insights';
import { checksMetadata as githubChecksMetadata } from '@backstage-thoth/plugin-tech-insights-github-code-scanning-common';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
  ScmAuth.createDefaultApiFactory(),
  createApiFactory({
    api: techInsightsApiRef,
    deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
    factory: ({ discoveryApi, identityApi }) =>
      new TechInsightsClient({
        discoveryApi,
        identityApi,
        checksMetadata: {
          ...checksMetadata,
          ...githubChecksMetadata,
        },
      }),
  }),
];
