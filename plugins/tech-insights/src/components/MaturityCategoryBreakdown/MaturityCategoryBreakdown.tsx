import React from 'react';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { Alert } from '@material-ui/lab';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import { Bar } from 'react-chartjs-2';
import { CategoryScale, Chart, LinearScale, BarElement } from 'chart.js';
import { makeStyles, Theme, useTheme } from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';
import { getTierColors } from '../../tierColors';
import { Category, Tier } from '@backstage-thoth/plugin-tech-insights-common';
import { getTierByServiceCategory } from '../../tierCalculator';

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
  totals: Record<string, Record<string, number>>,
  tierColors: ReturnType<typeof getTierColors>,
  tier: Tier,
) => ({
  label: tier,
  data: [
    totals[Category.Documentation][tier] ?? 0,
    totals[Category.Observability][tier] ?? 0,
    totals[Category.Readability][tier] ?? 0,
    totals[Category.Reliability][tier] ?? 0,
    totals[Category.Security][tier] ?? 0,
    totals[Category.ServiceOwnership][tier] ?? 0,
  ],
  backgroundColor: tierColors[tier],
});

const getTotalsByCategoryTier = (
  checkResultsByComponent:
    | {
        compoundEntityRef: CompoundEntityRef;
        checkResults: CheckResult[];
      }[],
): Record<string, Record<string, number>> => {
  const totals: Record<string, Record<string, number>> = {};
  Object.values(getTierByServiceCategory(checkResultsByComponent)).map(
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
  if (!checkResultsByComponent?.length) {
    return <Alert severity="warning">No checks have any data yet.</Alert>;
  }

  const totals = getTotalsByCategoryTier(checkResultsByComponent);
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
          labels: [
            Category.Documentation,
            Category.Observability,
            Category.Readability,
            Category.Reliability,
            Category.Security,
            Category.ServiceOwnership,
          ],
          datasets: [
            getDatasetByTier(totals, tierColors, Tier.C),
            getDatasetByTier(totals, tierColors, Tier.B),
            getDatasetByTier(totals, tierColors, Tier.A),
            getDatasetByTier(totals, tierColors, Tier.S),
          ],
        }}
      />
    </InfoCard>
  );
};
