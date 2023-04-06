import {
  FactRetriever,
  FactRetrieverContext,
} from '@backstage/plugin-tech-insights-node';
import { CatalogClient } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import isEmpty from 'lodash/isEmpty';
import { entityHasAnnotation, entityHasLink } from './utils';

const techdocsAnnotation = 'backstage.io/techdocs-ref';
export enum LinkTitle {
  incidentTool = 'Incident Tool',
  alertTool = 'Alert Tool',
  metricsTool = 'Metrics Tool',
  backlogTool = 'Backlog Tool',
  loggingTool = 'Logging Tool',
}

export enum FactId {
  hasTitle = 'hasTitle',
  hasDescription = 'hasDescription',
  hasTags = 'hasTags',
  hasOwner = 'hasOwner',
  hasGroupOwner = 'hasGroupOwner',
  hasLifecycle = 'hasLifecycle',
  hasAnnotationTechdocs = 'hasAnnotation-backstage.io/techdocs-ref',
  hasLinkIncidentTool = 'hasLinkIncidentTool',
  hasLinkAlertTool = 'hasLinkAlertTool',
  hasLinkMetricsTool = 'hasLinkMetricsTool',
  hasLinkBacklogTool = 'hasLinkBacklogTool',
  hasLinkLoggingTool = 'hasLinkLoggingTool',
}

export const entityMetadataFactRetriever: FactRetriever = {
  id: 'entityMetadataFactRetriever',
  version: '0.1.0',
  title: 'Entity Metadata',
  description:
    'Generates facts which indicate the completeness of entity metadata',
  schema: {
    [FactId.hasTitle]: {
      type: 'boolean',
      description: 'The entity has a title in metadata',
    },
    [FactId.hasDescription]: {
      type: 'boolean',
      description: 'The entity has a description in metadata',
    },
    [FactId.hasLifecycle]: {
      type: 'boolean',
      description: 'The entity has lifecycle in metadata',
    },
    [FactId.hasTags]: {
      type: 'boolean',
      description: 'The entity has tags in metadata',
    },
    [FactId.hasOwner]: {
      type: 'boolean',
      description: 'The spec.owner field is set',
    },
    [FactId.hasGroupOwner]: {
      type: 'boolean',
      description: 'The spec.owner field is set and refers to a group',
    },
    [FactId.hasAnnotationTechdocs]: {
      type: 'boolean',
      description: 'The entity has a TechDocs reference annotation',
    },
    [FactId.hasLinkIncidentTool]: {
      type: 'boolean',
      description: 'The entity has a link to an incident tool',
    },
    [FactId.hasLinkAlertTool]: {
      type: 'boolean',
      description: 'The entity has a link to an alert tool',
    },
    [FactId.hasLinkMetricsTool]: {
      type: 'boolean',
      description: 'The entity has a link to an metric tool',
    },
    [FactId.hasLinkBacklogTool]: {
      type: 'boolean',
      description: 'The entity has a link to a backlog tool',
    },
    [FactId.hasLinkLoggingTool]: {
      type: 'boolean',
      description: 'The entity has a link to a logging tool',
    },
  },
  handler: async ({
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

    return entities.items.map((entity: Entity) => {
      return {
        entity: {
          namespace: entity.metadata.namespace!,
          kind: entity.kind,
          name: entity.metadata.name,
        },
        facts: {
          [FactId.hasTitle]: Boolean(entity.metadata?.title),
          [FactId.hasDescription]: Boolean(entity.metadata?.description),
          [FactId.hasLifecycle]: Boolean(entity.spec?.lifecycle),
          [FactId.hasTags]: !isEmpty(entity.metadata?.tags),
          [FactId.hasOwner]: Boolean(entity.spec?.owner),
          [FactId.hasGroupOwner]: Boolean(
            entity.spec?.owner &&
              !(entity.spec?.owner as string).startsWith('user:'),
          ),
          [FactId.hasAnnotationTechdocs]: entityHasAnnotation(
            entity,
            techdocsAnnotation,
          ),
          [FactId.hasAnnotationTechdocs]: entityHasAnnotation(
            entity,
            techdocsAnnotation,
          ),
          [FactId.hasLinkIncidentTool]: entityHasLink(
            entity,
            LinkTitle.incidentTool,
          ),
          [FactId.hasLinkAlertTool]: entityHasLink(entity, LinkTitle.alertTool),
          [FactId.hasLinkBacklogTool]: entityHasLink(
            entity,
            LinkTitle.backlogTool,
          ),
          [FactId.hasLinkLoggingTool]: entityHasLink(
            entity,
            LinkTitle.loggingTool,
          ),
          [FactId.hasLinkMetricsTool]: entityHasLink(
            entity,
            LinkTitle.metricsTool,
          ),
        },
      };
    });
  },
};
