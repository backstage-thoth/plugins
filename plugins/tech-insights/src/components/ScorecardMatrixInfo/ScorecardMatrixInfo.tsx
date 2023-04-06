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

import { BackstageTheme } from '@backstage/theme';
import React from 'react';
import {
  Avatar,
  Box,
  Grid,
  LinearProgressProps,
  makeStyles,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import { Alert } from '@material-ui/lab';
import { ErrorPanel, InfoCard, Progress } from '@backstage/core-components';
import { Category, Metadata, Tier } from '@backstage-thoth/plugin-tech-insights-common';
import { TechInsightsApi } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import { InsightFacts, techInsightsApiRef } from '../../api';
import { CheckResultRenderer } from '../CheckResultRenderer';
import { useEntity } from '@backstage/plugin-catalog-react';
import useAsync from 'react-use/lib/useAsync';
import { getCompoundEntityRef } from '@backstage/catalog-model';
import { CheckId, checksMetadata } from '../../checksMetadata';
import { getTierColors } from '../../tierColors';

const HeaderRightTypography = withStyles(theme => ({
  root: {
    color: (theme as BackstageTheme).palette.textSubtle,
    fontWeight: 'bold',
  },
}))(Typography);

const HeaderTopTypography = withStyles({
  root: {
    textAlign: 'center',
  },
})(HeaderRightTypography);

const EmptyGrid = withStyles({
  root: {
    margin: '0px',
  },
})(Grid);

const borderColorLight = 'rgba(0, 0, 0, 0.12)';
const borderColorDark = 'rgba(255, 255, 255, 0.12)';
const getBorderColor = (theme: Theme) =>
  theme.palette.type === 'light' ? borderColorLight : borderColorDark;
const getBorder = (theme: Theme) => `1px solid ${getBorderColor(theme)}`;

const CategoryValueGrid = withStyles(theme => ({
  root: {
    borderBottom: getBorder(theme),
    borderRight: getBorder(theme),
  },
}))(EmptyGrid);

const CategoryHeaderGrid = withStyles(theme => ({
  root: {
    backgroundColor: getBorderColor(theme),
  },
}))(EmptyGrid);

const CategoryTopHeaderGrid = withStyles(theme => ({
  root: {
    borderTop: getBorder(theme),
    borderBottom: getBorder(theme),
    borderRight: getBorder(theme),
  },
}))(CategoryHeaderGrid);

const CategoryRightHeaderGrid = withStyles(theme => ({
  root: {
    borderBottom: getBorder(theme),
    borderLeft: getBorder(theme),
    borderRight: getBorder(theme),
    overflowWrap: 'break-word',
  },
}))(CategoryHeaderGrid);

const CategoryTopRightHeaderGrid = withStyles(theme => ({
  root: {
    borderBottom: getBorder(theme),
    borderRight: getBorder(theme),
  },
}))(EmptyGrid);

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number },
) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <Progress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const categoryValueItems = (
  checkResultRenderers: CheckResultRenderer[],
  checkResultsByCategory: CheckResult[],
) => {
  return (checkResultsByCategory || []).map(result => {
    const component = checkResultRenderers
      .find(({ type }) => type === result.check.type)
      ?.component(result);

    return component ? (
      <React.Fragment key={result.check.id}>{component}</React.Fragment>
    ) : (
      <Alert severity="error">Unknown type.</Alert>
    );
  });
};

const useStyles = (props: { value: string; backgroundColor?: string }) =>
  makeStyles(theme => {
    const tierColors = getTierColors(theme);
    const color = tierColors[props.value as Tier];
    return {
      avatar: {
        marginLeft: '10px',
        backgroundColor: props.backgroundColor || 'transparent',
        border: `1px solid ${color}`,
        color: color,
        fontWeight: 700,
      },
    };
  });

export default function LetterAvatar(props: {
  value: string;
  backgroundColor?: string;
}) {
  const classes = useStyles(props)();
  return (
    <Avatar className={classes.avatar}>
      <span>{props.value}</span>
    </Avatar>
  );
}

const infoCard = (
  api: TechInsightsApi,
  checkResults: CheckResult[],
  facts: InsightFacts,
) => {
  const checkResultsByTier: Record<
    string,
    { order: number; success: number; failure: number; value: number }
  > = {
    C: { order: 0, success: 0, failure: 0, value: 100 },
    B: { order: 1, success: 0, failure: 0, value: 0 },
    A: { order: 2, success: 0, failure: 0, value: 0 },
    S: { order: 3, success: 0, failure: 0, value: 0 },
  };
  const checkResultsByCategory: Record<
    string,
    Record<string, CheckResult[]>
  > = checkResults.reduce((acc, checkResult) => {
    const metadata: Metadata = checksMetadata[checkResult.check.id as CheckId];
    const category: Category = metadata?.category;
    if (!acc[category]) {
      acc[category] = {};
    }

    const tier: Tier = metadata?.tier;
    if (!acc[category][tier]) {
      acc[category][tier] = [];
    }

    checkResult.check.metadata = {
      ...checkResult.check.metadata,
      timestamp: facts ? facts[checkResult.check.factIds[0]].timestamp : '',
    };
    acc[category][tier].push({ ...checkResult });

    const checkResultsTier = checkResultsByTier[tier];
    if (checkResult.result) {
      checkResultsTier.success++;
    } else {
      checkResultsTier.failure++;
    }

    checkResultsTier.value =
      (checkResultsTier.success /
        (checkResultsTier.success + checkResultsTier.failure)) *
      100;

    return acc;
  }, {} as Record<string, Record<string, CheckResult[]>>);

  const types = [...new Set(checkResults.map(({ check }) => check.type))];
  const checkResultRenderers = api.getCheckResultRenderers(types);

  const scores = Object.keys(checkResultsByTier)
    .reduce((acc, cur) => {
      return acc.concat({ tier: cur, ...checkResultsByTier[cur] });
    }, [] as { tier: string; order: number; success: number; failure: number; value: number }[])
    .sort((x, y) => {
      return x.order - y.order;
    });
  let currentScore = Tier.C;
  for (const s of scores) {
    if (s.value !== 100) {
      break;
    }

    currentScore = s.tier as Tier;
  }

  return (
    <Grid item xs={12}>
      <InfoCard
        title="Continuous Auditing"
        subheader={
          <Grid container spacing={0} alignContent="center" alignItems="center">
            <HeaderTopTypography>Score: </HeaderTopTypography>
            <LetterAvatar value={currentScore} />
          </Grid>
        }
      >
        <EmptyGrid container spacing={0}>
          <CategoryTopRightHeaderGrid container item xs={2} />
          <EmptyGrid container item xs={10}>
            <CategoryTopHeaderGrid item xs={4}>
              <HeaderTopTypography>{Tier.B}</HeaderTopTypography>
              <LinearProgressWithLabel
                value={checkResultsByTier[Tier.B].value}
              />
            </CategoryTopHeaderGrid>
            <CategoryTopHeaderGrid item xs={4}>
              <HeaderTopTypography>{Tier.A}</HeaderTopTypography>
              <LinearProgressWithLabel
                value={checkResultsByTier[Tier.A].value}
              />
            </CategoryTopHeaderGrid>
            <CategoryTopHeaderGrid item xs={4}>
              <HeaderTopTypography>{Tier.S}</HeaderTopTypography>
              <LinearProgressWithLabel
                value={checkResultsByTier[Tier.S].value}
              />
            </CategoryTopHeaderGrid>
          </EmptyGrid>
        </EmptyGrid>

        {Object.keys(checkResultsByCategory)
          .sort()
          .map((category, i) => (
            <EmptyGrid container spacing={0} key={i}>
              <EmptyGrid container item xs={2}>
                <CategoryRightHeaderGrid item xs={12}>
                  <HeaderRightTypography>
                    {category as Category}
                  </HeaderRightTypography>
                </CategoryRightHeaderGrid>
              </EmptyGrid>
              <EmptyGrid container item xs={10}>
                <CategoryValueGrid item xs={4}>
                  {categoryValueItems(
                    checkResultRenderers,
                    checkResultsByCategory[category][Tier.B],
                  )}
                </CategoryValueGrid>
                <CategoryValueGrid item xs={4}>
                  {categoryValueItems(
                    checkResultRenderers,
                    checkResultsByCategory[category][Tier.A],
                  )}
                </CategoryValueGrid>
                <CategoryValueGrid item xs={4}>
                  {categoryValueItems(
                    checkResultRenderers,
                    checkResultsByCategory[category][Tier.S],
                  )}
                </CategoryValueGrid>
              </EmptyGrid>
            </EmptyGrid>
          ))}
      </InfoCard>
    </Grid>
  );
};

export const ScorecardMatrixInfo = (props: { checkResults: CheckResult[] }) => {
  const { checkResults } = props;
  const { entity } = useEntity();
  const api = useApi(techInsightsApiRef);
  const {
    value: facts,
    loading,
    error,
  } = useAsync(async () => {
    const ids = [
      ...new Set(
        checkResults.reduce((acc, cur) => {
          return acc.concat(...cur.check.factIds);
        }, [] as string[]),
      ),
    ];
    return await api.getFacts(getCompoundEntityRef(entity), ids);
  }, [api, entity]);

  if (!checkResults.length) {
    return <Alert severity="warning">No checks have any data yet.</Alert>;
  }

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ErrorPanel error={error} />;
  }

  return infoCard(api, checkResults, facts!);
};
