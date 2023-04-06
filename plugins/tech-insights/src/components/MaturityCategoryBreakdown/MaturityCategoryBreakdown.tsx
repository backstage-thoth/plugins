import React from 'react';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { Alert } from '@material-ui/lab';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import { Bar } from 'react-chartjs-2';
import { CategoryScale, Chart, LinearScale, BarElement } from 'chart.js';
import { makeStyles, Theme, useTheme } from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';
import { getTierColors } from '../../tierColors';
import { Tier } from '@backstage-thoth/plugin-tech-insights-common';
import { getTierByServiceCategory } from '../../tierCalculator';
import { useApi } from '@backstage/core-plugin-api';
import { TechInsightsApi, techInsightsApiRef } from '../../api';

Chart.register([LinearScale, CategoryScale, BarElement]);

const useStyles = makeStyles<Theme, { height: number | undefined }>({
  card: ({ height }) => ({
    display: 'flex',
    flexDirection: 'column',
    maxHeight: height,
    minHeight: height,
  }),
});

const getDatasetByTier = (
  categories: string[],
  totals: Record<string, Record<string, number>>,
  tierColors: ReturnType<typeof getTierColors>,
  tier: Tier,
) => ({
  label: tier,
  data: categories.map(c => totals[c][tier] ?? 0),
  backgroundColor: tierColors[tier],
});

const getTotalsByCategoryTier = (
  api: TechInsightsApi,
  checkResultsByComponent:
    | {
        compoundEntityRef: CompoundEntityRef;
        checkResults: CheckResult[];
      }[],
): Record<string, Record<string, number>> => {
  const totals: Record<string, Record<string, number>> = {};
  Object.values(getTierByServiceCategory(api, checkResultsByComponent)).map(
    tierByCategory => {
      Object.entries(tierByCategory).map(([categoryKey, tier]) => {
        if (!totals[categoryKey]) {
          totals[categoryKey] = {};
        }

        if (!totals[categoryKey][tier]) {
          totals[categoryKey][tier] = 0;
        }

        totals[categoryKey][tier]++;
      });
    },
  );

  return totals;
};

export const MaturityCategoryBreakdown = (props: {
  checkResultsByComponent:
    | {
        compoundEntityRef: CompoundEntityRef;
        checkResults: CheckResult[];
      }[]
    | undefined;
}) => {
  const classes = useStyles({ height: 300 });
  const tierColors = getTierColors(useTheme());
  const { checkResultsByComponent } = props;
  const api = useApi(techInsightsApiRef);
  if (!checkResultsByComponent?.length) {
    return <Alert severity="warning">No checks have any data yet.</Alert>;
  }

  const totals = getTotalsByCategoryTier(api, checkResultsByComponent);
  const categories = [...Object.values(api.getChecksMetadata()).reduce(
    (acc, cur) => {
      return acc.add(cur.category);
    },
    new Set<string>(),
  )].sort();

  return (
    <InfoCard
      variant="fullHeight"
      title="Category Breakdown"
      cardClassName={classes.card}
    >
      <Bar
        options={{
          indexAxis: 'y',
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              stacked: true,
            },
            x: {
              beginAtZero: true,
              stacked: true,
            },
          },
        }}
        data={{
          labels: categories,
          datasets: [
            getDatasetByTier(categories, totals, tierColors, Tier.C),
            getDatasetByTier(categories, totals, tierColors, Tier.B),
            getDatasetByTier(categories, totals, tierColors, Tier.A),
            getDatasetByTier(categories, totals, tierColors, Tier.S),
          ],
        }}
      />
    </InfoCard>
  );
};
