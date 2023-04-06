import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import {
  Content,
  ErrorPanel,
  PageWithHeader,
  Progress,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { techInsightsApiRef } from '../../api/TechInsightsApi';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { getCompoundEntityRef } from '@backstage/catalog-model';
import { MaturityMatrix } from '../MaturityMatrix';
import { Grid } from '@material-ui/core';
import { MaturityCategoryBreakdown } from '../MaturityCategoryBreakdown';
import { MaturityOverview } from '../MaturityOverview';

export const MaturityPage = () => {
  const api = useApi(techInsightsApiRef);
  const catalogApi = useApi(catalogApiRef);

  const { value, loading, error } = useAsync(async () => {
    const checks = [];
    for await (const entity of (
      await catalogApi.getEntities({ filter: { kind: ['Component'] } })
    ).items) {
      const compoundEntityRef = getCompoundEntityRef(entity);
      const entityChecks = await api.runChecks(compoundEntityRef);
      checks.push({
        compoundEntityRef: compoundEntityRef,
        checkResults: entityChecks,
      });
    }

    return checks;
  }, [api, catalogApi]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ErrorPanel error={error} />;
  }

  return (
    <PageWithHeader
      themeId="maturity"
      title="Maturity"
      subtitle="Continous auditing for service maturity"
      pageTitleOverride="APIs"
    >
      <Content>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={4}>
            <MaturityOverview checkResultsByComponent={value} />
          </Grid>
          <Grid item xs={8}>
            <MaturityCategoryBreakdown checkResultsByComponent={value} />
          </Grid>
          <Grid item xs={12}>
            <MaturityMatrix checkResultsByComponent={value} />
          </Grid>
        </Grid>
      </Content>
    </PageWithHeader>
  );
};
