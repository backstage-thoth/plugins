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
import { InfoCard, Progress } from '@backstage/core-components';
import {
  Category,
  Metadata,
  Tier,
} from '@backstage-thoth/plugin-tech-insights-common';
import { useApi } from '@backstage/core-plugin-api';
import { TechInsightsApi, techInsightsApiRef } from '../../api';
import { CheckResultRenderer } from '../CheckResultRenderer';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { JsonValue } from '@backstage/types';
import { MaturityAccordionBooleanCheck } from '../MaturityAccordionBooleanCheck';

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
  checkResultsByCategory: Record<
    string,
    {
      checkResult: CheckResult;
      results: { result: JsonValue; service: CompoundEntityRef }[];
    }
  >,
) => {
  return Object.keys(checkResultsByCategory || []).map(checkId => {
    const checkResult = checkResultsByCategory[checkId].checkResult;
    const component = checkResultRenderers
      .find(({ type }) => type === checkResult.check.type)
      ?.component(checkResult);

    return component ? (
      <React.Fragment key={checkResult.check.id}>
        <MaturityAccordionBooleanCheck
          checkResult={checkResultsByCategory[checkId]}
        />
      </React.Fragment>
    ) : (
      <Alert severity="error">Unknown type.</Alert>
    );
  });
};

const useStyles = (props: { value: string; backgroundColor?: string }) =>
  makeStyles(theme => {
    let color = theme.palette.error.main;
    if (props.value === Tier.S) {
      color = theme.palette.success.main;
    } else if (props.value === Tier.A) {
      color = theme.palette.info.main;
    } else if (props.value === Tier.B) {
      color = theme.palette.warning.main;
    }

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
  checkResultsByComponent: {
    compoundEntityRef: CompoundEntityRef;
    checkResults: CheckResult[];
  }[],
) => {
  const checkResultsByCategory: Record<
    string,
    Record<
      string,
      Record<
        string,
        {
          checkResult: CheckResult;
          results: { result: JsonValue; service: CompoundEntityRef }[];
        }
      >
    >
  > = {};
  let types: string[] = [];
  const checksMetadata = api.getChecksMetadata();
  const checkResultsByTier: Record<
    string,
    { order: number; success: number; failure: number; value: number }
  > = {
    C: { order: 0, success: 0, failure: 0, value: 100 },
    B: { order: 1, success: 0, failure: 0, value: 0 },
    A: { order: 2, success: 0, failure: 0, value: 0 },
    S: { order: 3, success: 0, failure: 0, value: 0 },
  };
  for (const checkResultByComponent of checkResultsByComponent) {
    for (const checkResult of checkResultByComponent.checkResults) {
      const metadata: Metadata = checksMetadata[checkResult.check.id];
      if (!metadata) {
        continue;
      }

      const category: string = metadata?.category;
      if (!checkResultsByCategory[category]) {
        checkResultsByCategory[category] = {};
      }

      const tier: string = metadata?.tier;
      if (!checkResultsByCategory[category][tier]) {
        checkResultsByCategory[category][tier] = {};
      }

      const checkId: string = checkResult.check.id;
      if (!checkResultsByCategory[category][tier][checkId]) {
        checkResultsByCategory[category][tier][checkId] = {
          checkResult: checkResult,
          results: [],
        };
      }

      checkResultsByCategory[category][tier][checkId].results.push({
        result: checkResult.result,
        service: checkResultByComponent.compoundEntityRef,
      });

      types = [...new Set(types.concat(checkResult.check.type))];

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
    }
  }

  const checkResultRenderers = api.getCheckResultRenderers(types);

  return (
    <Grid item xs={12}>
      <InfoCard title="Details">
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
          .map(category => (
            <EmptyGrid key={category} container spacing={0}>
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

export const MaturityMatrix = (props: {
  checkResultsByComponent:
    | {
        compoundEntityRef: CompoundEntityRef;
        checkResults: CheckResult[];
      }[]
    | undefined;
}) => {
  const { checkResultsByComponent } = props;
  const api = useApi(techInsightsApiRef);
  if (!checkResultsByComponent?.length) {
    return <Alert severity="warning">No checks have any data yet.</Alert>;
  }

  return infoCard(api, checkResultsByComponent);
};
