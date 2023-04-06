import { entityMetadataFactRetriever } from '@backstage/plugin-tech-insights-backend';
import {
  JSON_RULE_ENGINE_CHECK_TYPE,
  TechInsightJsonRuleCheck,
} from '@backstage/plugin-tech-insights-backend-module-jsonfc';
import { FactId } from './EntityMetadataFactRetriever';
import { CheckId } from '@backstage-thoth/plugin-tech-insights-common';

export const techInsightRuleChecks: TechInsightJsonRuleCheck[] = [
  {
    id: CheckId.OwnerCheck,
    type: JSON_RULE_ENGINE_CHECK_TYPE,
    name: 'Owner Check',
    description: 'An Owner has been set for this entity',
    factIds: [entityMetadataFactRetriever.id],
    rule: {
      conditions: {
        all: [
          {
            fact: FactId.hasOwner,
            operator: 'equal',
            value: true,
          },
        ],
      },
    },
  },
  {
    id: CheckId.GroupOwnerCheck,
    type: JSON_RULE_ENGINE_CHECK_TYPE,
    name: 'Group Owner Check',
    description:
      'A Group has been set as the owner for this entity',
      factIds: [entityMetadataFactRetriever.id],
    rule: {
      conditions: {
        all: [
          {
            fact: FactId.hasGroupOwner,
            operator: 'equal',
            value: true,
          },
        ],
      },
    },
  },
  {
    id: CheckId.TitleCheck,
    type: JSON_RULE_ENGINE_CHECK_TYPE,
    name: 'Title Check',
    description:
      'A Title has been set for this entity',
      factIds: [entityMetadataFactRetriever.id],
    rule: {
      conditions: {
        all: [
          {
            fact: FactId.hasTitle,
            operator: 'equal',
            value: true,
          },
        ],
      },
    },
  },
  {
    id: CheckId.LifecycleCheck,
    type: JSON_RULE_ENGINE_CHECK_TYPE,
    name: 'Lifecycle Check',
    description:
      'Lifecycle has been set for this entity',
      factIds: [entityMetadataFactRetriever.id],
    rule: {
      conditions: {
        all: [
          {
            fact: FactId.hasLifecycle,
            operator: 'equal',
            value: true,
          },
        ],
      },
    },
  },
  {
    id: CheckId.HasDescription,
    type: JSON_RULE_ENGINE_CHECK_TYPE,
    name: 'Description Check',
    description:
      'A Description has been set for this entity',
      factIds: [entityMetadataFactRetriever.id],
    rule: {
      conditions: {
        all: [
          {
            fact: FactId.hasDescription,
            operator: 'equal',
            value: true,
          },
        ],
      },
    },
  },
  {
    id: CheckId.HasTags,
    type: JSON_RULE_ENGINE_CHECK_TYPE,
    name: 'Tags Check',
    description:
      'Some Tags has been set for this entity',
      factIds: [entityMetadataFactRetriever.id],
    rule: {
      conditions: {
        all: [
          {
            fact: FactId.hasTags,
            operator: 'equal',
            value: true,
          },
        ],
      },
    },
  },
  {
    id: CheckId.TechDocsCheck,
    type: JSON_RULE_ENGINE_CHECK_TYPE,
    name: 'TechDocs Check',
    description: 'TechDocs has been enabled for this entity',
    factIds: [entityMetadataFactRetriever.id],
    rule: {
      conditions: {
        all: [
          {
            fact: FactId.hasAnnotationTechdocs,
            operator: 'equal',
            value: true,
          },
        ],
      },
    },
  },
  {
    id: CheckId.HasAlertTool,
    type: JSON_RULE_ENGINE_CHECK_TYPE,
    name: 'Alert Tool Check',
    description: 'A link to an Alert Tool has been set for this entity',
    factIds: [entityMetadataFactRetriever.id],
    rule: {
      conditions: {
        all: [
          {
            fact: FactId.hasLinkAlertTool,
            operator: 'equal',
            value: true,
          },
        ],
      },
    },
  },
  {
    id: CheckId.HasBacklogTool,
    type: JSON_RULE_ENGINE_CHECK_TYPE,
    name: 'Backlog Tool Check',
    description: 'A link to an Backlog Tool has been set for this entity',
    factIds: [entityMetadataFactRetriever.id],
    rule: {
      conditions: {
        all: [
          {
            fact: FactId.hasLinkBacklogTool,
            operator: 'equal',
            value: true,
          },
        ],
      },
    },
  },
  {
    id: CheckId.HasIncidentTool,
    type: JSON_RULE_ENGINE_CHECK_TYPE,
    name: 'Incident Tool Check',
    description: 'A link to an Incident Tool has been set for this entity',
    factIds: [entityMetadataFactRetriever.id],
    rule: {
      conditions: {
        all: [
          {
            fact: FactId.hasLinkIncidentTool,
            operator: 'equal',
            value: true,
          },
        ],
      },
    },
  },
  {
    id: CheckId.HasLoggingTool,
    type: JSON_RULE_ENGINE_CHECK_TYPE,
    name: 'Logging Tool Check',
    description: 'A link to an Logging Tool has been set for this entity',
    factIds: [entityMetadataFactRetriever.id],
    rule: {
      conditions: {
        all: [
          {
            fact: FactId.hasLinkLoggingTool,
            operator: 'equal',
            value: true,
          },
        ],
      },
    },
  },
  {
    id: CheckId.HasMetricsTool,
    type: JSON_RULE_ENGINE_CHECK_TYPE,
    name: 'Metric Tool Check',
    description: 'A link to an Metric Tool has been set for this entity',
    factIds: [entityMetadataFactRetriever.id],
    rule: {
      conditions: {
        all: [
          {
            fact: FactId.hasLinkMetricsTool,
            operator: 'equal',
            value: true,
          },
        ],
      },
    },
  },
];
