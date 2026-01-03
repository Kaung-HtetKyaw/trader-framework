'use client';

import CreateNewGroupModal from '@/components/modals/CreateNewGroup';
import { AddIcon } from '@/components/svgs/AddIcon';
import ClusterGroupTable from '@/components/tables/ClusterGroupTable';
import { BaseButton } from '@/components/ui/base-button';
import Can from '@/lib/authorization/casl/Can';

const ClusterGroupsPage = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row items-center justify-between">
        <h1 className="body-1 font-bold">Cluster Group Management</h1>

        <Can do="create" on="cluster_groups">
          <CreateNewGroupModal
            renderTrigger={() => (
              <BaseButton size="small" className="w-fit flex flex-row items-center gap-1">
                <span className="text-white body-2">Create New Group</span>
                <AddIcon className="w-4 h-4 text-text-50" />
              </BaseButton>
            )}
          />
        </Can>
      </div>

      <ClusterGroupTable />
    </div>
  );
};

export default ClusterGroupsPage;
