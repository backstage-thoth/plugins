import { CompoundEntityRef } from '@backstage/catalog-model';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import { Category, Metadata, Tier } from '@backstage-thoth/plugin-tech-insights-common';
import { CheckId, checksMetadata } from './checksMetadata';

export const orderByTier: Record<Tier, number> = {
  [Tier.C]: 0,
  [Tier.B]: 1,
  [Tier.A]: 2,
  [Tier.S]: 3,
};

export const tierByOrder: Record<number, Tier> = {
  0: Tier.C,
  1: Tier.B,
  2: Tier.A,
  3: Tier.S,
};

export const getTierByServiceCategory = (
  checkResultsByComponent:
    | {
        compoundEntityRef: CompoundEntityRef;
        checkResults: CheckResult[];
      }[],
): Record<string, Record<string, Tier>> =>
  checkResultsByComponent.reduce((acc, item) => {
    const itemName = item.compoundEntityRef.name;
    acc[itemName] = item.checkResults.reduce((tierByCategory, cur) => {
      const metadata: Metadata = checksMetadata[cur.check.id as CheckId];
      const category: Category = metadata?.category;

      if (!tierByCategory[category]) {
        tierByCategory[category] = Tier.S;
      }

      if (!cur.result) {
        const tier: Tier = metadata?.tier;
        if (orderByTier[tier] - 1 < orderByTier[tierByCategory[category]]) {
          tierByCategory[category] = tierByOrder[orderByTier[tier] - 1];
        }
      }

      return tierByCategory;
    }, {} as Record<string, Tier>);

    return acc;
  }, {} as Record<string, Record<string, Tier>>);

export const getTierByService = (
  checkResultsByComponent:
    | {
        compoundEntityRef: CompoundEntityRef;
        checkResults: CheckResult[];
      }[],
): Record<string, Tier> => {
  const tierByServiceCategory = getTierByServiceCategory(
    checkResultsByComponent,
  );
  return Object.entries(tierByServiceCategory).reduce(
    (acc, [serviceName, categories]) => {
      const minTierOrder = Object.values(categories)
        .map(c => orderByTier[c])
        .reduce((a, b) => Math.min(a, b), Infinity);
      acc[serviceName] = tierByOrder[Math.min(minTierOrder)];
      return acc;
    },
    {} as Record<string, Tier>,
  );
};
