/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { Alert } from '@material-ui/lab';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { InfoCard } from '@backstage/core-components';
import { getTierColors } from '../../tierColors';
import { Tier } from '@backstage-thoth/plugin-tech-insights-common';
import { useTheme } from '@material-ui/core';
import { getTierByService } from '../../tierCalculator';

Chart.register([ArcElement, Tooltip, Legend]);

export const MaturityOverview = (props: {
  checkResultsByComponent:
    | {
        compoundEntityRef: CompoundEntityRef;
        checkResults: CheckResult[];
      }[]
    | undefined;
}) => {
  const { checkResultsByComponent } = props;
  const tierColors = getTierColors(useTheme());
  if (!checkResultsByComponent?.length) {
    return <Alert severity="warning">No checks have any data yet.</Alert>;
  }

  const tierByService = getTierByService(checkResultsByComponent);

  const totals = Object.values(tierByService).reduce((acc, cur) => {
    if (!acc[cur]) {
      acc[cur] = 0;
    }
    acc[cur] += 1;
    return acc;
  }, {} as Record<Tier, number>);
  return (
    <InfoCard variant="fullHeight" title="Overview">
      <Doughnut
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        }}
        data={{
          labels: [Tier.C, Tier.B, Tier.A, Tier.S],
          datasets: [
            {
              data: [
                totals[Tier.C] ?? 0,
                totals[Tier.B] ?? 0,
                totals[Tier.A] ?? 0,
                totals[Tier.S] ?? 0,
              ],
              backgroundColor: [
                tierColors[Tier.C],
                tierColors[Tier.B],
                tierColors[Tier.A],
                tierColors[Tier.S],
              ],
            },
          ],
        }}
      />
    </InfoCard>
  );
};
