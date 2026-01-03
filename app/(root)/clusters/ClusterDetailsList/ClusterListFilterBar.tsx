import { DropdownOption } from '@/components/Dropdown';
import { BaseButton } from '@/components/ui/base-button';
import { Cluster } from '@/types/cluster';
import { ClusterListFilterParams, ClusterListParams } from '@/types/cluster/list';
import { X } from 'lucide-react';
import useInterdependentFilters from '@/lib/hooks/useInterdependentFilters';
import MultiSelectFilterDropdown from '@/components/MultiSelectFilterDropdown';
import { capitalize } from 'lodash/fp';
import { ClusterGroupIcon } from '@/components/svgs/ClusterGroupIcon';
import { useMemo } from 'react';

export type ClusterListFilterBarProps = {
  initialClusters: Cluster[];
  params: ClusterListFilterParams;
  tagOptions: DropdownOption[];
  statusOptions: DropdownOption[];
  changeParam: (key: keyof ClusterListParams, value: string | string[]) => void;
  resetParams: () => void;
};

const ClusterListFilterBar = (props: ClusterListFilterBarProps) => {
  const { changeParam, resetParams, initialClusters, tagOptions, statusOptions, params } = props;

  const { getFilterSummary, getAvailableValuesForFilter, applyFilter, toggleFilter, showClearFilters, onClearFilters } =
    useInterdependentFilters({
      initialNodes: initialClusters.map(cluster => ({
        ...cluster,
        group: cluster.group,
        status: cluster.stats?.status,
      })),
      params,
      filters: {
        group: {
          options: tagOptions,
          getter: (node: Cluster) => node.group || '',
        },
        status: {
          options: statusOptions,
          getter: (node: Cluster) => node.stats?.status || '',
        },
      },
      onApplyFilters: changeParam,
      onClearFilters: resetParams,
      transformLabel: (label: string) => capitalize(label).split('_').join(' '),
    });

  const shouldShowClearFilters = useMemo(() => {
    // this is to specifically handle the pre-applied group filter from dashboard
    const appliedOnlyOnGroup = getAvailableValuesForFilter('group').length === 1 && params?.group?.length === 1;
    return showClearFilters && !appliedOnlyOnGroup;
  }, [showClearFilters, params, getAvailableValuesForFilter]);

  return (
    <div className="bg-white flex flex-row items-center justify-between px-4 py-[0.875rem] mb-[0.875rem]">
      <div className="flex flex-row items-center gap-3">
        <p className="body-1 font-semibold">Filters</p>

        <div className="flex flex-row items-center gap-2">
          <MultiSelectFilterDropdown
            onApplyFilters={() => applyFilter('group')}
            label={'Cluster Group'}
            type="interdependent"
            filterSummary={getFilterSummary('group')}
            availableOptions={getAvailableValuesForFilter('group')}
            onToggleFilter={value => toggleFilter('group', value)}
            icon={<ClusterGroupIcon className="w-5 h-5 text-secondary-500" />}
          />

          <MultiSelectFilterDropdown
            onApplyFilters={() => applyFilter('status')}
            label={'Status'}
            type="interdependent"
            filterSummary={getFilterSummary('status')}
            availableOptions={getAvailableValuesForFilter('status')}
            onToggleFilter={value => toggleFilter('status', value)}
          />
        </div>
      </div>

      {shouldShowClearFilters && (
        <BaseButton className="text-text-950 body-1 font-normal" variant="text" onClick={onClearFilters}>
          <X size={18} />
          <span>Clear Filters</span>
        </BaseButton>
      )}
    </div>
  );
};

export default ClusterListFilterBar;
