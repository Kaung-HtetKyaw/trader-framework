import { VisualizationListFilterParams } from '@/types/visualization/list';
import useLocalStorage from './useLocalStorage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChangeMultipleParamsFn, MultiParamsOptions } from './useQueryParams';
import { omit } from 'lodash/fp';

export type UsePersistVisualizationFiltersProps = {
  clusterID: string;
  params: VisualizationListFilterParams;
  onChangeParams: ChangeMultipleParamsFn<VisualizationListFilterParams>;
};

export type PersistedVisualizationFilters = {
  [clusterID: string]: VisualizationListFilterParams;
};

export const VISUALIZATION_FILTERS_LOCAL_STORAGE_KEY = 'visualizationFilters';

export const getPersistedFilters = (clusterId: string) => {
  if (typeof window === 'undefined') return {};

  const persistedFilters = localStorage.getItem(VISUALIZATION_FILTERS_LOCAL_STORAGE_KEY);

  if (!persistedFilters) return {};

  try {
    const parsedFilters = JSON.parse(persistedFilters) as Record<string, VisualizationListFilterParams>;
    return parsedFilters[clusterId] || {};
  } catch {
    return {};
  }
};

/**
 * Hook that persists visualization filters per cluster in localStorage
 * and automatically syncs them with URL query parameters
 */
// TODO: Revisit this once BE filters are more sophisticated. Filtering will happen on FE since BE filters are not as sophisticated enough as FE filters. This will fetch all results and filter out on FE which is not efficient.
const usePersistVisualizationFilters = (props: UsePersistVisualizationFiltersProps) => {
  const { clusterID, params, onChangeParams } = props;
  const [alreadySetInParams, setAlreadySetInParams] = useState(false);
  const [allVisualizationFilters, setAllVisualizationFilters] = useLocalStorage<PersistedVisualizationFilters>(
    VISUALIZATION_FILTERS_LOCAL_STORAGE_KEY,
    {}
  );

  const visualizationFilters = useMemo(
    () => allVisualizationFilters[clusterID] || {},
    [clusterID, allVisualizationFilters]
  );

  const onChangeVisualizationFilters = useCallback(
    (filters: VisualizationListFilterParams, options?: { replace: boolean }) => {
      if (!clusterID) {
        return;
      }

      const normalizedFilters = omit(['group'], filters);

      setAllVisualizationFilters(prev => ({
        ...prev,
        [clusterID]: options?.replace ? normalizedFilters : { ...visualizationFilters, ...normalizedFilters },
      }));
    },
    [clusterID, visualizationFilters, setAllVisualizationFilters]
  );

  // We uses useEffect here because it will be easier to update the local storage state automatically when the params change instead of manually having to call onChangeVisualizationFilters in everywhere
  useEffect(() => {
    onChangeVisualizationFilters(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    // If clusterID is not set (when user go from visualization details page to visualization base page), we don't need to set the params
    if (!clusterID) {
      setAlreadySetInParams(false);
      return;
    }
    if (alreadySetInParams) return;

    const params = Object.entries(visualizationFilters).reduce((acc, cur) => {
      const [key, value] = cur;
      if (!!value) {
        return {
          ...acc,
          [key]: { value },
        };
      }

      return acc;
    }, {} as MultiParamsOptions<VisualizationListFilterParams>);

    onChangeParams(params);
    setAlreadySetInParams(true);
  }, [alreadySetInParams, onChangeParams, visualizationFilters, clusterID]);
};

export default usePersistVisualizationFilters;
