import React, { RefObject, useCallback, useMemo, useRef, useState } from 'react';
import { DropdownOption } from '@/components/Dropdown';
import { VisualizationListFilterParams } from '@/types/visualization/list';
import TwoPaneGroupClusterDropdown from '@/components/TwoPaneGroupClusterDropdown';
import MultiSelectFilterDropdown from '@/components/MultiSelectFilterDropdown';
import SelectedFiltersDisplay from './SelectedFiltersDisplay';
import ResetButton from './ResetButton';
import ConsolidatedFilterDropdown from './ConsolidatedFilterDropdown';
import { CustomToast } from '@/components/CustomToast';
import { useResizeObserver } from '@/lib/hooks/useResizeObserver';
import usePersistVisualizationFilters from '@/lib/hooks/usePersistVisualizationFilters';
import { useParams, usePathname } from 'next/navigation';
import { ChangeMultipleParamsFn } from '@/lib/hooks/useQueryParams';
import Divider from '@/components/Divider';
import { misc, resetZoomedInNamespaces, resetLoadingNamespaces } from '@/signals/visualiation/misc';
import { useSignals } from '@preact/signals-react/runtime';
import usePersistSelectedCluster from '@/lib/hooks/usePersistSelectedCluster';
import useVisualizationFilters from '@/lib/hooks/useVisualizationFilters';
import { stringifyQs } from '@/lib/utils';

export type ClusterDetails = {
  groupID?: string;
  clusterID: string;
  namespace?: string;
};

export const VISUALIZATION_FILTER_BAR_MARGIN_Y = 14;

export type VisualizationFilterBarProps = {
  params: VisualizationListFilterParams;
  changeMultipleParams: ChangeMultipleParamsFn<VisualizationListFilterParams>;
  resetParams: () => void;
  initialData: ClusterDetails[];
  groupOptions: DropdownOption[];
  clusterOptions: DropdownOption[];
  isFetching: boolean;
  onSelectGroup: (groupId: string) => void;
  onSelectCluster: (clusterId: string) => void;
  selectedGroupId?: string;
  selectedClusterId?: string;
  namespaceOptions: DropdownOption[];
  clusterWideObjectOptions: DropdownOption[];
  objectKindOptions: DropdownOption[];
};

const VisualizationFilterBar = ({
  initialData,
  groupOptions,
  clusterOptions,
  params,
  changeMultipleParams,
  onSelectGroup,
  onSelectCluster,
  selectedGroupId,
  selectedClusterId,
  namespaceOptions,
  clusterWideObjectOptions,
  objectKindOptions,
}: VisualizationFilterBarProps) => {
  useSignals();
  const filtersRef = useRef<HTMLDivElement>(null);
  const resetButtonRef = useRef<HTMLDivElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const [maxDisplayedFilters, setMaxDisplayedFilters] = useState(0);
  const { id: clusterID } = useParams<{ id: string }>();
  const pathname = usePathname();
  const { setSelectedCluster } = usePersistSelectedCluster();
  const {
    selectedClusterWideObjects,
    selectedNamespaces,
    selectedObjectKinds,
    hasFiltersApplied,
    namespaceFilterContext,
    clusterWideFilterContext,
    objectKindFilterContext,
    handleNamespacesChange,
    handleClusterWideObjectsChange,
    handleObjectKindsChange,
    resetFilters,
    onApplyFilters,
    areFiltersChanged,
  } = useVisualizationFilters({
    namespaceOptions,
    clusterWideObjectOptions,
    objectKindOptions,
  });

  usePersistVisualizationFilters({ clusterID, params, onChangeParams: changeMultipleParams });

  // Optimize clustersByGroup: build a lookup for clusterOptions for O(1) access
  const clusterOptionMap = useMemo(() => {
    const map: Record<string, DropdownOption> = {};
    clusterOptions.forEach(opt => {
      map[opt.value] = opt;
    });
    return map;
  }, [clusterOptions]);

  const clustersByGroup = useMemo(() => {
    const map: Record<string, DropdownOption[]> = {};
    initialData.forEach(item => {
      if (!item.groupID) return;
      if (!map[item.groupID]) map[item.groupID] = [];
      const clusterOption = clusterOptionMap[item.clusterID];
      if (clusterOption && !map[item.groupID].some(c => c.value === clusterOption.value)) {
        map[item.groupID].push(clusterOption);
      }
    });
    return map;
  }, [initialData, clusterOptionMap]);

  const showSelectedFilters = useMemo(() => {
    if (
      !params.namespace &&
      !params.clusterWideObject &&
      !params.kind &&
      !params.excludedClusterWideObject &&
      !params.excludedNamespace &&
      !params.excludedKind
    )
      return false;

    return true;
  }, [params]);

  const onResetAll = useCallback(() => {
    resetFilters();
    // TODO: This is a temporary solution since resetting params is instant but the rendering is not
    setTimeout(() => {
      misc.value.fitView();
    }, 750);

    CustomToast({
      type: 'success',
      message: 'The filters are reset successfully!',
    });
  }, [resetFilters]);

  const getFiltersRightPos = useCallback(() => {
    if (!filtersRef.current) return 0;
    return filtersRef.current.getBoundingClientRect().right;
  }, []);

  const getResetButtonLeftPos = useCallback(() => {
    if (!resetButtonRef.current) return 0;
    return resetButtonRef.current.getBoundingClientRect().left;
  }, []);

  // Get the maximum number of filters that can be displayed in the filter bar based on the available space
  const getMaxDisplayedFilters = useCallback(() => {
    const filtersRightPos = getFiltersRightPos();
    const resetButtonLeftPos = getResetButtonLeftPos();
    const availableSpace = resetButtonLeftPos - filtersRightPos - 50;

    const count = Math.floor(availableSpace / 150);
    return count;
  }, [getFiltersRightPos, getResetButtonLeftPos]);

  const onResizeFilterBar = useCallback(() => {
    const maxDisplayedFilters = getMaxDisplayedFilters();

    setMaxDisplayedFilters(maxDisplayedFilters);
  }, [getMaxDisplayedFilters]);

  useResizeObserver({
    ref: filterBarRef as RefObject<HTMLElement>,
    onResize: onResizeFilterBar,
  });

  const handleChangeCluster = useCallback(
    (id: string) => {
      onSelectCluster(id);
      setSelectedCluster(id);
      resetZoomedInNamespaces();
      resetLoadingNamespaces();
    },
    [setSelectedCluster, onSelectCluster]
  );

  const handleOpenChangeClusterGroup = useCallback(
    (open: boolean) => {
      const alreadyAtBaseVisualizationPage = pathname.includes('/visualization') && pathname.split('/').length === 2;

      if (open || alreadyAtBaseVisualizationPage) {
        return;
      }

      const group = groupOptions.find(g => g.value === selectedGroupId);

      if (!group) {
        return;
      }

      const cluster = initialData.find(c => c.groupID === selectedGroupId);

      if (cluster) {
        return;
      }

      const url = `/visualization?${stringifyQs({ group: selectedGroupId })}`;
      setSelectedCluster('');
      // NOTE: override every router states across application to make sure that user gets redirected to the base visualization page
      window.location.href = url;
    },
    [groupOptions, selectedGroupId, pathname, initialData, setSelectedCluster]
  );

  const handleApplyNamespaceFilters = useCallback(
    (closeDropdown: () => void) => {
      closeDropdown();
      onApplyFilters('namespace');
    },
    [onApplyFilters]
  );

  const handleApplyClusterWideObjectsFilters = useCallback(
    (closeDropdown: () => void) => {
      onApplyFilters('clusterWideObject');
      closeDropdown();
    },
    [onApplyFilters]
  );

  const handleApplyObjectKindFilters = useCallback(
    (closeDropdown: () => void) => {
      onApplyFilters('objectKind');
      closeDropdown();
    },
    [onApplyFilters]
  );

  return (
    <div
      ref={filterBarRef}
      style={{
        marginBottom: `${VISUALIZATION_FILTER_BAR_MARGIN_Y}px`,
      }}
      className="bg-white flex flex-row items-center justify-between px-4 py-[0.875rem] min-w-max"
    >
      <div className="flex flex-row items-center gap-3">
        <div ref={filtersRef} className="flex flex-row items-center gap-2 flex-shrink-0">
          <TwoPaneGroupClusterDropdown
            groupOptions={groupOptions}
            clusterOptions={clusterOptions}
            clustersByGroup={clustersByGroup}
            selectedGroupId={selectedGroupId}
            selectedClusterId={selectedClusterId}
            onSelectGroup={onSelectGroup}
            onSelectCluster={handleChangeCluster}
            onOpenChange={handleOpenChangeClusterGroup}
            disabled={misc.value.isLoading}
          />
          <Divider type="vertical" className="h-[24px] mx-4" />

          {/* show all filters individually */}
          <div className="hidden xl:flex xl:flex-row xl:items-center xl:gap-2">
            <MultiSelectFilterDropdown
              type="base"
              label={'Object Kind'}
              options={objectKindOptions}
              selectedValues={selectedObjectKinds}
              onChange={handleObjectKindsChange}
              showCounts={false}
              disabled={!selectedClusterId || misc.value.isLoading}
              maxLabelLength={35}
              submitType="apply"
              onApplyFilters={handleApplyObjectKindFilters}
              applyDisabled={!areFiltersChanged.objectKind}
            />
            <MultiSelectFilterDropdown
              type="base"
              label={'Cluster Wide Objects'}
              options={clusterWideObjectOptions}
              selectedValues={selectedClusterWideObjects}
              onChange={handleClusterWideObjectsChange}
              showCounts={false}
              disabled={!selectedClusterId || misc.value.isLoading}
              maxLabelLength={35}
              submitType="apply"
              onApplyFilters={handleApplyClusterWideObjectsFilters}
              applyDisabled={!areFiltersChanged.clusterWideObject}
            />
            <MultiSelectFilterDropdown
              type="base"
              label={'Namespace'}
              options={namespaceOptions}
              selectedValues={selectedNamespaces}
              onChange={handleNamespacesChange}
              showCounts={false}
              disabled={!selectedClusterId || misc.value.isLoading}
              maxLabelLength={35}
              submitType="apply"
              onApplyFilters={handleApplyNamespaceFilters}
              applyDisabled={!areFiltersChanged.namespace}
            />
          </div>

          {/* Object Kind + Consolidated Filter  */}
          <div className="flex xl:hidden flex-row items-center gap-2">
            <MultiSelectFilterDropdown
              type="base"
              label={'Object Kind'}
              options={objectKindOptions}
              selectedValues={selectedObjectKinds}
              onChange={handleObjectKindsChange}
              showCounts={false}
              disabled={!selectedClusterId || misc.value.isLoading}
              maxLabelLength={35}
              submitType="apply"
              onApplyFilters={handleApplyObjectKindFilters}
              applyDisabled={!areFiltersChanged.objectKind}
            />
            <ConsolidatedFilterDropdown
              clusterWideObjectOptions={clusterWideObjectOptions}
              selectedClusterWideObjects={selectedClusterWideObjects}
              onClusterWideObjectsChange={handleClusterWideObjectsChange}
              namespaceOptions={namespaceOptions}
              selectedNamespaces={selectedNamespaces}
              onNamespacesChange={handleNamespacesChange}
              disabled={!selectedClusterId || misc.value.isLoading}
              onApplyClusterWideObjects={handleApplyClusterWideObjectsFilters}
              onApplyNamespaces={handleApplyNamespaceFilters}
              clusterWideApplyDisabled={!areFiltersChanged.clusterWideObject}
              namespaceApplyDisabled={!areFiltersChanged.namespace}
            />
          </div>
        </div>
        {showSelectedFilters && (
          <SelectedFiltersDisplay
            namespace={namespaceFilterContext}
            clusterWideObject={clusterWideFilterContext}
            objectKind={objectKindFilterContext}
            max={maxDisplayedFilters}
            disabled={!selectedClusterId || misc.value.isLoading}
          />
        )}
      </div>

      <div ref={resetButtonRef}>
        {hasFiltersApplied && !misc.value.isLoading && (
          <ResetButton disabled={misc.value.isLoading} onResetAll={onResetAll} />
        )}
      </div>
    </div>
  );
};

export default VisualizationFilterBar;
