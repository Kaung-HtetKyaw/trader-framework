import ClusterGroupOptionSelection from './ClusterGroupOptionSelection';
import { Cluster } from '@/types/cluster';
import { BaseButton } from '@/components/ui/base-button';
import Can from '@/lib/authorization/casl/Can';
import { AddIcon } from '@/components/svgs/AddIcon';

export type EditClusterGroupModalFormProps = {
  cluster: Cluster;
  onOpenChange: (open: boolean) => void;
  onCreateNewGroup: () => void;
};

const EditClusterGroupModalForm = ({ cluster, onOpenChange, onCreateNewGroup }: EditClusterGroupModalFormProps) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row justify-between items-start">
        <div className="flex flex-col gap-1">
          <h3 className="body-1 font-bold">Assign cluster group</h3>
          <p className="body-2 ">Assign an existing or create a new cluster group.</p>
        </div>

        <Can do="create" on="cluster_groups">
          <BaseButton size="small" className="px-2" onClick={onCreateNewGroup}>
            <span className="text-white body-2">Create New</span>
            <AddIcon className="w-4 h-4 text-text-50" />
          </BaseButton>
        </Can>
      </div>

      <ClusterGroupOptionSelection cluster={cluster} onOpenChange={onOpenChange} />
    </div>
  );
};

export default EditClusterGroupModalForm;
