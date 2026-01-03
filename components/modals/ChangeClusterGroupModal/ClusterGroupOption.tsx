'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import NotFoundMessage from '@/components/NotFoundMessage';
import { ClusterGroupWithStats } from '@/types/cluster';
import { ClusterGroupIcon } from '@/components/svgs/ClusterGroupIcon';

interface ClusterGroupOptionProps {
  clusterGroups: ClusterGroupWithStats[];
  selectedGroup: string;
  currentClusterGroupID: string;
  onChange: (value: string) => void;
}

const ClusterGroupOption = ({
  clusterGroups,
  selectedGroup,
  currentClusterGroupID,
  onChange,
}: ClusterGroupOptionProps) => {
  return (
    <div className="overflow-hidden flex flex-col gap-6">
      {clusterGroups.length ? (
        clusterGroups.map(clusterGroup => (
          <div
            onClick={() => onChange(clusterGroup.id)}
            key={clusterGroup.id}
            className={cn('flex items-center justify-between min-h-9 cursor-pointer')}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-text-50 rounded-sm">
                <ClusterGroupIcon className="!w-7 !h-7 text-text-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium body-1 truncate w-[180px] block">{clusterGroup.name}</span>
                  <Badge variant="outline" className="ml-2 inline-1 font-medium bg-text-50">
                    {clusterGroup.total}
                  </Badge>

                  {clusterGroup.id === currentClusterGroupID && (
                    <Badge className="bg-primary-950 text-white">Current</Badge>
                  )}
                </div>
                <p className="text-text-500 text-[10px]">Cluster Group</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <label htmlFor={clusterGroup.id} className="cursor-pointer">
                <input
                  type="radio"
                  id={clusterGroup.id}
                  name="cluster-group"
                  value={clusterGroup.id}
                  checked={selectedGroup === clusterGroup.id}
                  onChange={() => onChange(clusterGroup.id)}
                  className="sr-only"
                />
                <div
                  className={`h-[18px] w-[18px] rounded-full border-2 flex items-center justify-center ${
                    selectedGroup === clusterGroup.id ? 'border-blue-900' : 'border-gray-300'
                  }`}
                >
                  {selectedGroup === clusterGroup.id && <div className="h-[10px] w-[10px] rounded-full bg-blue-900" />}
                </div>
              </label>
            </div>
          </div>
        ))
      ) : (
        <NotFoundMessage label="cluster group" />
      )}
    </div>
  );
};

export default ClusterGroupOption;
