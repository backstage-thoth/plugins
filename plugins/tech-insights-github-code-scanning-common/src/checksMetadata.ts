import {
  Category,
  Metadata,
  Tier,
} from '@backstage-thoth/plugin-tech-insights-common';
import { CheckId } from './types';

export const checksMetadata: Record<CheckId, Metadata> = {
  [CheckId.IsGithubCodeScanningEnabled]: {
    category: Category.Security,
    tier: Tier.B,
  },
  [CheckId.withoutGithubCodeScanningCriticalAlerts]: {
    category: Category.Security,
    tier: Tier.B,
  },
  [CheckId.withoutGithubCodeScanningMediumAlerts]: {
    category: Category.Security,
    tier: Tier.A,
  },
  [CheckId.withoutGithubCodeScanningLowAlerts]: {
    category: Category.Security,
    tier: Tier.S,
  },
};
