import {
  Category as CommonCategory,
  CheckId as CommonCheckId,
  Metadata,
  Tier,
} from '@backstage-thoth/plugin-tech-insights-common';
import { CheckId as CodeScanningCheckId } from '@backstage-thoth/plugin-tech-insights-github-code-scanning-common';

export type CheckId = CommonCheckId & CodeScanningCheckId;

export const checksMetadata: Record<CheckId, Metadata> = {
  [CommonCheckId.OwnerCheck]: {
    category: CommonCategory.ServiceOwnership,
    tier: Tier.A,
  },
  [CommonCheckId.GroupOwnerCheck]: {
    category: CommonCategory.ServiceOwnership,
    tier: Tier.A,
  },
  [CommonCheckId.TitleCheck]: {
    category: CommonCategory.Readability,
    tier: Tier.B,
  },
  [CommonCheckId.LifecycleCheck]: {
    category: CommonCategory.Readability,
    tier: Tier.B,
  },
  [CommonCheckId.HasDescription]: {
    category: CommonCategory.Readability,
    tier: Tier.A,
  },
  [CommonCheckId.HasTags]: {
    category: CommonCategory.Readability,
    tier: Tier.S,
  },
  [CommonCheckId.TechDocsCheck]: {
    category: CommonCategory.Documentation,
    tier: Tier.S,
  },
  [CommonCheckId.HasAlertTool]: {
    category: CommonCategory.Reliability,
    tier: Tier.S,
  },
  [CommonCheckId.HasIncidentTool]: {
    category: CommonCategory.Reliability,
    tier: Tier.S,
  },
  [CommonCheckId.HasMetricsTool]: {
    category: CommonCategory.Observability,
    tier: Tier.A,
  },
  [CommonCheckId.HasLoggingTool]: {
    category: CommonCategory.Observability,
    tier: Tier.B,
  },
  [CommonCheckId.HasBacklogTool]: {
    category: CommonCategory.Observability,
    tier: Tier.B,
  },
  [CodeScanningCheckId.IsGithubCodeScanningEnabled]: {
    category: CommonCategory.Security,
    tier: Tier.B,
  },
  [CodeScanningCheckId.withoutGithubCodeScanningCriticalAlerts]: {
    category: CommonCategory.Security,
    tier: Tier.B,
  },
  [CodeScanningCheckId.withoutGithubCodeScanningMediumAlerts]: {
    category: CommonCategory.Security,
    tier: Tier.A,
  },
  [CodeScanningCheckId.withoutGithubCodeScanningLowAlerts]: {
    category: CommonCategory.Security,
    tier: Tier.S,
  },
};
