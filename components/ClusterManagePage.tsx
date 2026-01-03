'use client';
import { BaseButton } from './ui/base-button';
import { useParams, useRouter } from 'next/navigation';
import DeleteClusterModal from './modals/DeleteClusterModal';
import { useCallback, useState } from 'react';
import { CLUSTER_DETAILS_LIST_PATH } from '@/app/(root)/clusters/urls';

const ClusterManagePage = () => {
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onSuccessDeleteCluster = useCallback(() => {
    router.push(CLUSTER_DETAILS_LIST_PATH);
  }, [router]);

  return (
    <div>
      <h3 className="mb-4 body-3 font-[600]">Danger Zone</h3>
      <p className="mb-3 body-3 font-[400]">Remove this cluster from Kubegrade.</p>
      <DeleteClusterModal
        id={id}
        open={open}
        onOpenChange={setOpen}
        onSuccess={onSuccessDeleteCluster}
        renderTrigger={() => (
          <BaseButton
            variant={'contained'}
            color="error"
            size="medium"
            type="button"
            className={'flex w-[120px] md:w-[156px] h-9 px-4 justify-center items-center gap-2 rounded-sm'}
          >
            Remove Cluster
          </BaseButton>
        )}
      />
    </div>
  );
};

export default ClusterManagePage;
