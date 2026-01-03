import { VisualizationListFilterParams } from '@/types/visualization/list';
import { DropdownOption } from '@/components/Dropdown';
import { useCallback, useMemo, useState } from 'react';
import useQueryParams from '../useQueryParams';
import { SelectedFilterContext } from '@/app/(root)/visualization/VisualizationFilters/SelectedFiltersDisplay';
import {
  getInitialSelectedClusterWideObjects,
  getInitialSelectedNamespaces,
  getInitialSelectedObjectKinds,
} from './helpers';
import useStateFromProps from '../useStateFromProps';
import { applyRepositionSimulation, misc } from '@/signals/visualiation/misc';

export type UseVisualizationFiltersProps = {
  namespaceOptions: DropdownOption[];
  clusterWideObjectOptions: DropdownOption[];
  objectKindOptions: DropdownOption[];
};

const useVisualizationFilters = (props: UseVisualizationFiltersProps) => {
  const { namespaceOptions, clusterWideObjectOptions, objectKindOptions } = props;
  const { params, changeMultipleParams, resetParams } = useQueryParams<VisualizationListFilterParams>({
    listKeys: [
      'group',
      'cluster',
      'namespace',
      'clusterWideObject',
      'kind',
      'excludedClusterWideObject',
      'excludedNamespace',
      'excludedKind',
    ],
  });
  const [areFiltersChanged, setAreFiltersChanged] = useState<{
    objectKind: boolean;
    namespace: boolean;
    clusterWideObject: boolean;
  }>({ objectKind: false, namespace: false, clusterWideObject: false });
  const [selectedObjectKinds, setSelectedObjectKinds] = useStateFromProps<string[]>(
    getInitialSelectedObjectKinds(objectKindOptions, params)
  );
  const [selectedClusterWideObjects, setSelectedClusterWideObjects] = useStateFromProps<string[]>(
    getInitialSelectedClusterWideObjects(clusterWideObjectOptions, params)
  );
  const [selectedNamespaces, setSelectedNamespaces] = useStateFromProps<string[]>(
    getInitialSelectedNamespaces(namespaceOptions, params)
  );

  const hasFiltersApplied = useMemo(() => {
    return (
      !!params.namespace ||
      !!params.excludedNamespace ||
      !!params.clusterWideObject ||
      !!params.kind ||
      !!params.allNamespaces ||
      !!params.allClusterWideObjects ||
      !!params.excludedClusterWideObject ||
      !!params.allKinds ||
      !!params.excludedKind
    );
  }, [params]);

  const areFiltersSameAsOptions = useCallback((arrayOne: string[], arrayTwo: string[]) => {
    return arrayOne.length === arrayTwo.length && arrayOne.every(el => arrayTwo.includes(el));
  }, []);

  const handleObjectKindsChange = useCallback(
    (values: string[]) => {
      setSelectedObjectKinds(values);
      setAreFiltersChanged(prev => ({ ...prev, objectKind: true }));
    },
    [setSelectedObjectKinds, setAreFiltersChanged]
  );

  const handleNamespacesChange = useCallback(
    (values: string[]) => {
      setSelectedNamespaces(values);
      setAreFiltersChanged(prev => ({ ...prev, namespace: true }));
    },
    [setSelectedNamespaces, setAreFiltersChanged]
  );

  const handleClusterWideObjectsChange = useCallback(
    (values: string[]) => {
      setSelectedClusterWideObjects(values);
      setAreFiltersChanged(prev => ({ ...prev, clusterWideObject: true }));
    },
    [setSelectedClusterWideObjects, setAreFiltersChanged]
  );

  const onApplyObjectKindFilters = useCallback(
    (values: string[]) => {
      const isSelectedAll = areFiltersSameAsOptions(
        values,
        objectKindOptions.map(el => el.value)
      );
      setAreFiltersChanged(prev => ({ ...prev, objectKind: false }));

      if (isSelectedAll) {
        changeMultipleParams({
          kind: { remove: true },
          excludedKind: { remove: true },
          allKinds: { value: 'true' },
        });

        return;
      }

      const unselectedItems = objectKindOptions.filter(el => !values.includes(el.value)).map(el => el.value);

      changeMultipleParams({
        allKinds: { remove: true },
        ...(values.length > unselectedItems.length
          ? { excludedKind: { value: unselectedItems }, kind: { remove: true } }
          : { kind: { value: values }, excludedKind: { remove: true } }),
      });
    },
    [changeMultipleParams, objectKindOptions, areFiltersSameAsOptions, setAreFiltersChanged]
  );

  const onApplyNamespaceFilters = useCallback(
    (values: string[]) => {
      const isSelectedAll = areFiltersSameAsOptions(
        values,
        namespaceOptions.map(el => el.value)
      );
      setAreFiltersChanged(prev => ({ ...prev, namespace: false }));

      if (isSelectedAll) {
        changeMultipleParams({
          namespace: { remove: true },
          excludedNamespace: { remove: true },
          allNamespaces: { value: 'true' },
        });

        return;
      }

      const unselectedItems = namespaceOptions.filter(el => !values.includes(el.value)).map(el => el.value);

      changeMultipleParams({
        allNamespaces: { remove: true },
        ...(values.length > unselectedItems.length
          ? { excludedNamespace: { value: unselectedItems }, namespace: { remove: true } }
          : { namespace: { value: values }, excludedNamespace: { remove: true } }),
      });
    },
    [changeMultipleParams, namespaceOptions, areFiltersSameAsOptions, setAreFiltersChanged]
  );

  const onApplyClusterWideObjectsFilters = useCallback(
    (values: string[]) => {
      const isSelectedAll = areFiltersSameAsOptions(
        values,
        clusterWideObjectOptions.map(el => el.value)
      );
      setAreFiltersChanged(prev => ({ ...prev, clusterWideObject: false }));

      if (isSelectedAll) {
        changeMultipleParams({
          clusterWideObject: { remove: true },
          excludedClusterWideObject: { remove: true },
          allClusterWideObjects: { value: 'true' },
          kind: { remove: true },
          excludedKind: { remove: true },
          allKinds: { value: 'true' },
        });

        return;
      }

      const unselectedItems = clusterWideObjectOptions.filter(el => !values.includes(el.value)).map(el => el.value);

      changeMultipleParams({
        allClusterWideObjects: { remove: true },
        ...(values.length > unselectedItems.length
          ? { excludedClusterWideObject: { value: unselectedItems }, clusterWideObject: { remove: true } }
          : { clusterWideObject: { value: values }, excludedClusterWideObject: { remove: true } }),
      });
    },
    [changeMultipleParams, clusterWideObjectOptions, areFiltersSameAsOptions]
  );

  const onApplyFilters = useCallback(
    (type: 'objectKind' | 'namespace' | 'clusterWideObject') => {
      applyRepositionSimulation(misc.value.fitView);
      switch (type) {
        case 'objectKind':
          onApplyObjectKindFilters(selectedObjectKinds);
          break;
        case 'namespace':
          onApplyNamespaceFilters(selectedNamespaces);
          break;
        case 'clusterWideObject':
          onApplyClusterWideObjectsFilters(selectedClusterWideObjects);
          break;
        default:
          throw new Error(`Invalid filter type: ${type}`);
      }
    },
    [
      onApplyObjectKindFilters,
      onApplyNamespaceFilters,
      onApplyClusterWideObjectsFilters,
      selectedObjectKinds,
      selectedNamespaces,
      selectedClusterWideObjects,
    ]
  );

  const handleNamespaceRemove = useCallback(
    (values: string[]) => {
      onApplyNamespaceFilters(values);
      setSelectedNamespaces(values);
    },
    [onApplyNamespaceFilters, setSelectedNamespaces]
  );

  const handleClusterWideObjectRemove = useCallback(
    (values: string[]) => {
      onApplyClusterWideObjectsFilters(values);
      setSelectedClusterWideObjects(values);
    },
    [onApplyClusterWideObjectsFilters, setSelectedClusterWideObjects]
  );

  const handleObjectKindRemove = useCallback(
    (values: string[]) => {
      onApplyObjectKindFilters(values);
      setSelectedObjectKinds(values);
    },
    [onApplyObjectKindFilters, setSelectedObjectKinds]
  );

  const namespaceFilterContext: SelectedFilterContext = useMemo(() => {
    if (!!params.excludedNamespace) {
      return {
        items: namespaceOptions.filter(el => !params.excludedNamespace?.includes(el.value)).map(el => el.value),
        options: namespaceOptions,
        onChange: handleNamespaceRemove,
      };
    }

    return {
      items: params.namespace || [],
      options: namespaceOptions,
      onChange: handleNamespaceRemove,
    };
  }, [namespaceOptions, handleNamespaceRemove, params.excludedNamespace, params.namespace]);

  const clusterWideFilterContext: SelectedFilterContext = useMemo(() => {
    if (!!params.excludedClusterWideObject) {
      return {
        items: clusterWideObjectOptions
          .filter(el => !params.excludedClusterWideObject?.includes(el.value))
          .map(el => el.value),
        options: clusterWideObjectOptions,
        onChange: handleClusterWideObjectRemove,
      };
    }

    return {
      items: params.clusterWideObject || [],
      options: clusterWideObjectOptions,
      onChange: handleClusterWideObjectRemove,
    };
  }, [
    clusterWideObjectOptions,
    handleClusterWideObjectRemove,
    params.excludedClusterWideObject,
    params.clusterWideObject,
  ]);

  const objectKindFilterContext: SelectedFilterContext = useMemo(() => {
    if (!!params.excludedKind) {
      return {
        items: selectedObjectKinds,
        options: objectKindOptions,
        onChange: handleObjectKindRemove,
      };
    }

    return {
      items: params.kind || [],
      options: objectKindOptions,
      onChange: handleObjectKindRemove,
    };
  }, [params.kind, objectKindOptions, handleObjectKindRemove, params.excludedKind, selectedObjectKinds]);

  const resetFilters = useCallback(() => {
    resetParams();
    setSelectedObjectKinds(objectKindOptions.map(el => el.value));
    setSelectedClusterWideObjects([]);
    setSelectedNamespaces(namespaceOptions.map(el => el.value));
    setAreFiltersChanged({ objectKind: false, namespace: false, clusterWideObject: false });
  }, [
    resetParams,
    objectKindOptions,
    namespaceOptions,
    setSelectedObjectKinds,
    setSelectedClusterWideObjects,
    setSelectedNamespaces,
    setAreFiltersChanged,
  ]);

  return {
    selectedClusterWideObjects,
    selectedNamespaces,
    selectedObjectKinds,
    hasFiltersApplied,
    handleNamespacesChange,
    handleClusterWideObjectsChange,
    handleObjectKindsChange,
    resetFilters,
    namespaceFilterContext,
    clusterWideFilterContext,
    objectKindFilterContext,
    onApplyFilters,
    areFiltersChanged,
  };
};

export default useVisualizationFilters;
