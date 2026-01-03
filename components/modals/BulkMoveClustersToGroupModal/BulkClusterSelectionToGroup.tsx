import SingleSelectFilterDropdown from '@/components/SingleSelectFilterDropdown';
import ClusterSelectionTable from '@/components/tables/ClusterSelectionTable';
import useStateFromProps from '@/lib/hooks/useStateFromProps';
import { ClusterGroupWithStats, Cluster, ClusterGroup } from '@/types/cluster';
import { useMemo, useState } from 'react';
import ModalActionButton from '../ModalActionButton';
import { ArrowRightIcon } from '@/components/svgs/ArrowRightIcon';
import LoadingSpinner from '@/components/LoadingSpinner';

export type BulkClusterSelectionToGroupProps = {
  group: ClusterGroupWithStats;
  clusters: Cluster[];
  clusterGroups: ClusterGroup[];
  isLoading: boolean;
  onMove: (clusterGroupID: string, clusterIDs: string[]) => void;
  onCancel: () => void;
  isSubmitting: boolean;
};

const BulkClusterSelectionToGroup = (props: BulkClusterSelectionToGroupProps) => {
  const { group, clusters, clusterGroups, isLoading, onMove, onCancel, isSubmitting } = props;

  const [selectedClusterIDs, setSelectedClusterIDs] = useState<string[]>([]);

  const [selectedClusterGroupID, setSelectedClusterGroupID] = useStateFromProps<string | null>(null);

  const availableOptions = useMemo(
    () =>
      clusterGroups
        ?.filter(clusterGroup => clusterGroup.id !== group.id)
        .map((clusterGroup, index) => ({
          label: clusterGroup.name,
          value: clusterGroup.id,
          checked: selectedClusterGroupID ? selectedClusterGroupID === clusterGroup.id : index === 0,
        })) ?? [],
    [clusterGroups, group, selectedClusterGroupID]
  );

  const selectedClusterGroup = useMemo(
    () => availableOptions?.find(cluster => cluster.value === selectedClusterGroupID) || availableOptions[0],
    [availableOptions, selectedClusterGroupID]
  );

  const onSelectClusterGroup = (clusterGroupID: string) => {
    setSelectedClusterGroupID(clusterGroupID);
  };

  const onToggleSelectCluster = (clusterID: string) => {
    setSelectedClusterIDs(prev => {
      if (prev.includes(clusterID)) {
        return prev.filter(id => id !== clusterID);
      }
      return [...prev, clusterID];
    });
  };

  const onToggleSelectAllClusters = () => {
    setSelectedClusterIDs(prev => (prev.length === clusters?.length ? [] : clusters?.map(cluster => cluster.id) || []));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center justify-between gap-4 ">
        <div className="w-[17.143rem] flex justify-center items-center gap-2 body-1 bg-text-50 rounded-sm h-9">
          <span className="text-text-400 font-[600]">Current Group: </span>
          <span className="text-text-950 truncate block w-[120px]">{group.name}</span>
        </div>

        <div className="bg-text-50 rounded-sm p-[3px]">
          <ArrowRightIcon className="w-4 h-4 text-secondary-500" />
        </div>

        <SingleSelectFilterDropdown
          type="interdependent"
          label="Cluster Group"
          filterSummary={selectedClusterGroup?.label}
          availableOptions={availableOptions}
          onSelectOption={item => onSelectClusterGroup(item.value)}
          filterSummaryClassName="truncate block w-[120px]"
          menuContentClassName="h-[250px] overflow-y-auto scroll-container"
        />
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
          onClick={() => onMove(selectedClusterGroup.value, selectedClusterIDs)}
          disabled={!clusters?.length || !selectedClusterIDs.length}
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

export default BulkClusterSelectionToGroup;
