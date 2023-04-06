import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  makeStyles,
  Typography,
  Grid,
} from '@material-ui/core';
import React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { JsonValue } from '@backstage/types';

const useStyles = makeStyles(theme => ({
  cardContent: {
    backgroundColor: theme.palette.background.default,
  },
  neutral: {
    position: 'relative',
    '&:after': {
      pointerEvents: 'none',
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      boxShadow: `inset 4px 0px 0px ${theme.palette.warning.main}`,
    },
  },
  failed: {
    position: 'relative',
    '&:after': {
      pointerEvents: 'none',
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      boxShadow: `inset 4px 0px 0px ${theme.palette.error.main}`,
    },
  },
  success: {
    position: 'relative',
    '&:after': {
      pointerEvents: 'none',
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      boxShadow: `inset 4px 0px 0px ${theme.palette.success.main}`,
    },
  },
  summaryLabel: {
    fontSize: '14px',
  },
  detailsValue: {
    fontSize: '12px',
    overflow: 'hidden',
    wordBreak: 'break-word',
  },
  subDetailsLabel: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    fontSize: '11px',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    marginRight: '5px',
  },
  subDetailsValue: {
    fontSize: '11px',
    overflow: 'hidden',
    wordBreak: 'break-word',
  },
}));

export const MaturityAccordionBooleanCheck = (props: {
  checkResult: {
    checkResult: CheckResult;
    results: { result: JsonValue; service: CompoundEntityRef }[];
  };
}) => {
  const classes = useStyles();
  const value =
    (props.checkResult.results.reduce((acc, cur) => {
      return acc + (cur.result ? 1 : 0);
    }, 0) /
      props.checkResult.results.length) *
    100;

  let className = classes.neutral;
  if (value < 50) {
    className = classes.failed;
  } else if (value === 100) {
    className = classes.success;
  }

  return (
    <Accordion className={className} TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Grid
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography className={classes.summaryLabel}>
            {props.checkResult.checkResult.check.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            value,
          )}%`}</Typography>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid>
          <Typography variant="body2" className={classes.detailsValue}>
            {props.checkResult.checkResult.check.description}
          </Typography>
          {value < 100 && (
            <Grid style={{ paddingTop: '5px' }}>
              <Typography
                display="inline"
                variant="h2"
                className={classes.subDetailsLabel}
              >
                Affected:
              </Typography>
              {props.checkResult.results.map(
                (r, i) =>
                  !r.result && (
                    <Typography
                      key={i}
                      variant="body2"
                      color="textSecondary"
                      style={{ padding: '2px' }}
                    >
                      {r.service.name}
                    </Typography>
                  ),
              )}
            </Grid>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
