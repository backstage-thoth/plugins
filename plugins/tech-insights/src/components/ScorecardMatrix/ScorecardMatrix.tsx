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
import useAsync from 'react-use/lib/useAsync';
import { ErrorPanel, Progress } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { ScorecardMatrixInfo } from '../ScorecardMatrixInfo';
import { techInsightsApiRef } from '../../api/TechInsightsApi';
import { useEntity } from '@backstage/plugin-catalog-react';
import { getCompoundEntityRef } from '@backstage/catalog-model';

export const ScorecardMatrix = () => {
  const api = useApi(techInsightsApiRef);
  const { entity } = useEntity();
  const { value, loading, error } = useAsync(
    async () => await api.runChecks(getCompoundEntityRef(entity)),
    [api, entity],
  );

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ErrorPanel error={error} />;
  }

  return (
    <ScorecardMatrixInfo checkResults={value || []} />
  );
};
