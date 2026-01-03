import MoreMenuVerticalLineIcon from './svgs/MoreMenuVerticalLineIcon';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from './ui/dropdown-menu';
import DeleteBinIcon from './svgs/DeleteBinIcon';
import { useRouter } from 'next/navigation';
import DeleteClusterModal from './modals/DeleteClusterModal';
import { useCallback, useState } from 'react';
import { CLUSTER_DETAILS_LIST_PATH, getClusterDetailsPath } from '@/app/(root)/clusters/urls';
import { useAbility } from '@/lib/authorization/casl/AbilityProvider';
import EyeIcon from './svgs/EyeIcon';

export type ClusterRowActionMenuProps = {
  id: string;
};
const ClusterRowActionMenu = (props: ClusterRowActionMenuProps) => {
  const { id } = props;
  const router = useRouter();
  const ability = useAbility();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const onSuccessDeleteCluster = useCallback(() => {
    router.push(CLUSTER_DETAILS_LIST_PATH);
  }, [router]);

  const onViewCluster = (e: Event) => {
    e.stopPropagation();
    router.push(getClusterDetailsPath(id));
  };

  const onDeleteCluster = (e: Event) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger onClick={e => e.stopPropagation()} asChild>
          <button className="min-w-6 h-6 focus:outline-none focus:ring-0 focus-visible:ring-0">
            <MoreMenuVerticalLineIcon className="w-6 h-6" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="left"
          align="start"
          className={`bg-white shadow-md rounded-sm border border-text-50 p-2`}
        >
          {ability.can('list', 'clusters') && (
            <DropdownMenuItem
              key="view"
              onSelect={onViewCluster}
              className="hover:text-secondary-950 hover:bg-primary-50 cursor-pointer flex items-center gap-2"
            >
              <EyeIcon className="w-6 h-6" />
              <span>View Cluster</span>
            </DropdownMenuItem>
          )}

          {ability.can('delete', 'clusters') && (
            <DropdownMenuItem
              key="delete"
              onSelect={onDeleteCluster}
              className="hover:text-secondary-950 hover:bg-error-50 cursor-pointer flex items-center gap-2"
            >
              <DeleteBinIcon className="w-6 h-6" />
              <span className="text-error-500">Remove Cluster</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteClusterModal
        id={id}
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onSuccess={onSuccessDeleteCluster}
        renderTrigger={() => <div />}
      />
    </>
  );
};

export default ClusterRowActionMenu;
