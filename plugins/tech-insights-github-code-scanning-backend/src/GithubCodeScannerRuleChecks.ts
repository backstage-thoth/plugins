import { githubCodeScannerRetriever } from './GithubCodeScannerRetriever';
import {
  JSON_RULE_ENGINE_CHECK_TYPE,
  TechInsightJsonRuleCheck,
} from '@backstage/plugin-tech-insights-backend-module-jsonfc';
import { FactId } from './GithubCodeScannerRetriever';
import { CheckId } from '@backstage-thoth/plugin-tech-insights-github-code-scanning-common';

export const githubCodeScannerRuleChecks: TechInsightJsonRuleCheck[] = [
  {
    id: CheckId.IsGithubCodeScanningEnabled,
    type: JSON_RULE_ENGINE_CHECK_TYPE,
    name: 'Code scanning Check',
    description: 'Github code scanning is enabled',
    factIds: [githubCodeScannerRetriever.id],
    rule: {
      conditions: {
        all: [
          {
            fact: FactId.isGithubCodeScanningEnabled,
            operator: 'equal',
            value: true,
          },
        ],
      },
    },
  },
  {
    id: CheckId.withoutGithubCodeScanningCriticalAlerts,
    type: JSON_RULE_ENGINE_CHECK_TYPE,
    name: 'No critical security alerts',
    description: 'Without error alerts for Github code scanning',
    factIds: [githubCodeScannerRetriever.id],
    rule: {
      conditions: {
        any: [
          {
            fact: FactId.hasGithubCodeScanningErrorSeverity,
            operator: 'equal',
            value: false,
          },
        ],
      },
    },
  },  
  {
    id: CheckId.withoutGithubCodeScanningLowAlerts,
    type: JSON_RULE_ENGINE_CHECK_TYPE,
    name: 'No low security alerts',
    description: 'Without note or none alerts for Github code scanning',
    factIds: [githubCodeScannerRetriever.id],
    rule: {
      conditions: {
        any: [
          {
            fact: FactId.hasGithubCodeScanningNoteSeverity,
            operator: 'equal',
            value: false,
          },
          {
            fact: FactId.hasGithubCodeScanningNoneSeverity,
            operator: 'equal',
            value: false,
          },
        ],
      },
    },
  },  
  {
    id: CheckId.withoutGithubCodeScanningMediumAlerts,
    type: JSON_RULE_ENGINE_CHECK_TYPE,
    name: 'No warning security alerts',
    description: 'Without warning alerts for Github code scanning',
    factIds: [githubCodeScannerRetriever.id],
    rule: {
      conditions: {
        any: [
          {
            fact: FactId.hasGithubCodeScanningWarningSeverity,
            operator: 'equal',
            value: false,
          },
        ],
      },
    },
  },
];

