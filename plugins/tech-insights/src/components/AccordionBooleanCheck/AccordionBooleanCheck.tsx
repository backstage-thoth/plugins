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
import { DateTime } from 'luxon';

const useStyles = makeStyles(theme => ({
  cardContent: {
    backgroundColor: theme.palette.background.default,
  },
  neutral: {},
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

export const AccordionBooleanCheck = (props: { checkResult: CheckResult }) => {
  const metadataTimestamp = props.checkResult.check.metadata?.timestamp;
  const timestamp = metadataTimestamp
    ? DateTime.fromISO(metadataTimestamp).toRelative({locale:'en-US'})
    : 'unknown';

  const classes = useStyles();
  return (
    <Accordion
      className={props.checkResult.result ? classes.success : classes.failed}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.summaryLabel}>
          {props.checkResult.check.name}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid>
          <Typography variant="body2" className={classes.detailsValue}>
            {props.checkResult.check.description}
          </Typography>
          <Grid style={{ paddingTop: '5px' }}>
            <Typography
              display="inline"
              variant="h2"
              className={classes.subDetailsLabel}
            >
              Last Update:
            </Typography>
            <Typography
              display="inline"
              variant="body2"
              className={classes.subDetailsValue}
            >
              {timestamp}
            </Typography>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
