import useK8sObjectQuery from './useK8sObjectQuery';
import { useEffect, useState } from 'react';
import { getSelectedObjectsByKind, initAvailableObjects, SelectedObject } from '@/signals/tables/selection';
import { ObjectQueryProps, QueryDataMap, QueryResultMap } from './types';

export type UseGetK8sObjectWithSelectionSyncProps<T extends ObjectQueryProps = ObjectQueryProps> = {
  objectQueryOptions: T;
  transformData: (data: QueryDataMap[T['type']]) => SelectedObject[];
};

/**
 * This hook is used to get the result of the object query, sync the available objects and the row selection.
 * @param props - The props for the hook.
 * @param props.objectQueryOptions - The options for the object query.
 * @param props.transformData - The function to transform the data.
 * @returns The result of the query and the row selection.
 * @returns The result of the query and the row selection.
 */
const useGetK8sObjectWithSelectionSync = <T extends ObjectQueryProps>(
  props: UseGetK8sObjectWithSelectionSyncProps<T>
): { result: QueryResultMap[T['type']]; selection: Record<string, boolean> } => {
  const { objectQueryOptions, transformData } = props;
  const queryResult = useK8sObjectQuery(objectQueryOptions);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(() => {
    const selectedIds = getSelectedObjectsByKind(objectQueryOptions.type);
    return selectedIds.reduce((acc, id) => ({ ...acc, [id]: true }), {});
  });

  // Initialize the available objects for the signal states
  useEffect(() => {
    initAvailableObjects(objectQueryOptions.type, transformData((queryResult?.data as QueryDataMap[T['type']]) || []));
  }, [transformData, objectQueryOptions, queryResult.data]);

  // Initialize the row selection for the signal states
  useEffect(() => {
    const newSelection = getSelectedObjectsByKind(objectQueryOptions.type).reduce(
      (acc, id) => ({ ...acc, [id]: true }),
      {}
    );
    setRowSelection(newSelection);
  }, [objectQueryOptions.type]);

  return { result: queryResult, selection: rowSelection };
};

export default useGetK8sObjectWithSelectionSync;
