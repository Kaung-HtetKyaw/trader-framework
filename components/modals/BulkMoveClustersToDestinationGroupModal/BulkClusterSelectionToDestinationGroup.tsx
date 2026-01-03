import SingleSelectFilterDropdown from '@/components/SingleSelectFilterDropdown';
import ClusterSelectionTable from '@/components/tables/ClusterSelectionTable';
import useStateFromProps from '@/lib/hooks/useStateFromProps';
import { ClusterGroupWithStats, Cluster } from '@/types/cluster';
import { useMemo } from 'react';
import ModalActionButton from '../ModalActionButton';
import { ArrowRightIcon } from '@/components/svgs/ArrowRightIcon';
import { cn, truncateString } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';

export type BulkClusterSelectionToDestinationGroup = {
  /** destination group */
  group: ClusterGroupWithStats;
  /** filtered clusters for selected source group */
  clusters: Cluster[];
  /** source groups for dropdown */
  clusterGroups: ClusterGroupWithStats[];
  isLoading: boolean;
  onMove: (clusterIDs: string[]) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  selectedSourceGroupId?: string;
  onSelectSourceGroup?: (id: string) => void;
};

const BulkClusterSelectionToDestinationGroup = (props: BulkClusterSelectionToDestinationGroup) => {
  const {
    group,
    clusters,
    clusterGroups,
    isLoading,
    onMove,
    onCancel,
    isSubmitting,
    selectedSourceGroupId,
    onSelectSourceGroup,
  } = props;
  const [selectedClusterIDs, setSelectedClusterIDs] = useStateFromProps<string[]>([]);

  const availableOptions = useMemo(
    () =>
      clusterGroups?.map((clusterGroup, index) => ({
        label: truncateString(clusterGroup.name, 30),
        value: clusterGroup.id,
        checked: selectedSourceGroupId ? selectedSourceGroupId === clusterGroup.id : index === 0,
      })) ?? [],
    [clusterGroups, selectedSourceGroupId]
  );

  const selectedGroupOption = availableOptions.find(opt => opt.value === selectedSourceGroupId) || availableOptions[0];

  const onToggleSelectCluster = (clusterID: string) => {
    setSelectedClusterIDs(prev => {
      if (prev.includes(clusterID)) {
        return prev.filter(id => id !== clusterID);
      }
      return [...prev, clusterID];
    });
  };

  const onToggleSelectAllClusters = () => {
    setSelectedClusterIDs(prev => (prev.length === clusters.length ? [] : clusters.map(cluster => cluster.id)));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center justify-between gap-4 ">
        <div className="w-[17.143rem] flex justify-center items-center gap-2 body-1 rounded-sm h-9">
          <SingleSelectFilterDropdown
            type="interdependent"
            label="Cluster Group"
            filterSummary={selectedGroupOption?.label}
            availableOptions={availableOptions}
            onSelectOption={item => onSelectSourceGroup?.(item.value)}
            filterSummaryClassName="truncate block w-[120px]"
            menuContentClassName="h-[250px] overflow-y-auto scroll-container"
          />
        </div>

        <div className="bg-text-50 rounded-sm p-[3px]">
          <ArrowRightIcon className="w-4 h-4 text-secondary-500" />
        </div>
        <div className="w-[17.143rem] flex justify-center items-center gap-2 body-1 bg-text-50 rounded-sm h-9">
          <span className="text-text-400 font-[600]">Destination Group: </span>
          <span className="text-text-950 truncate block w-[100px]">{group.name}</span>
        </div>
      </div>

      <ClusterSelectionTable
        clusters={clusters}
        isLoading={isLoading}
        selectedClusterIDs={selectedClusterIDs}
        onToggleSelectCluster={onToggleSelectCluster}
        onToggleSelectAllClusters={onToggleSelectAllClusters}
      />

      <div className="flex justify-center items-center gap-4 pt-2">
        <ModalActionButton action="cancel" onClick={onCancel}>
          Cancel
        </ModalActionButton>

        <ModalActionButton
          action="submit"
          onClick={() => onMove(selectedClusterIDs)}
          disabled={!clusters.length || !selectedClusterIDs.length}
          className={cn(isSubmitting && 'opacity-75 cursor-not-allowed')}
        >
          {isSubmitting ? (
            <LoadingSpinner className="w-full gap-2">
              <p>Moving...</p>
            </LoadingSpinner>
          ) : (
            <span>Move</span>
          )}
        </ModalActionButton>
      </div>
    </div>
  );
};

export default BulkClusterSelectionToDestinationGroup;
