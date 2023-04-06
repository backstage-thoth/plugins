import { Tier } from '@backstage-thoth/plugin-tech-insights-common';
import { Theme } from '@material-ui/core/styles';

export const getTierColors = (theme: Theme) => ({
  [Tier.S]: theme.palette.success.main,
  [Tier.A]: theme.palette.info.main,
  [Tier.B]: theme.palette.warning.main,
  [Tier.C]: theme.palette.error.main,
});
