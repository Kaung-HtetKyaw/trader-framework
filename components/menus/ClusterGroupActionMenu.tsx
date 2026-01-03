'use client';

import React, { useState } from 'react';
import BaseActionMenu, { ActionMenuItem } from '@/components/menus/BaseActionMenu';
import { ClusterGroupWithStats } from '@/types/cluster';
import { useRouter } from 'next/navigation';
import { CLUSTER_DETAILS_LIST_PATH } from '@/app/(root)/clusters/urls';
import DeleteClusterGroupModal from '../modals/DeleteClusterGroupModal';
import { DeleteDataIcon } from '@/components/svgs/DeleteDataIcon';
import { ViewIcon } from '@/components/svgs/ViewIcon';
import { MenuTriggerIcon } from '@/components/svgs/MenuTriggerIcon';

type ClusterGroupActionMenuProps = {
  clusterGroupData: ClusterGroupWithStats;
  className?: string;
};

const ClusterGroupActionMenu: React.FC<ClusterGroupActionMenuProps> = ({ clusterGroupData, className }) => {
  const router = useRouter();
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const isDefaultGroup = clusterGroupData.name.toLowerCase() === 'default';
  const menuItems: ActionMenuItem[] = [
    {
      label: 'View Group',
      icon: ViewIcon,
      onSelect: () =>
        router.push(`${CLUSTER_DETAILS_LIST_PATH}?group=${encodeURIComponent(clusterGroupData.name || '')}`),
    },
    ...(!isDefaultGroup
      ? [
          {
            label: 'Remove Group',
            icon: DeleteDataIcon,
            onSelect: () => setDeleteOpen(true),
          },
        ]
      : []),
  ];

  return (
    <>
      <BaseActionMenu items={menuItems} className={className} triggerIcon={MenuTriggerIcon} iconSize={24} />
      <DeleteClusterGroupModal group={clusterGroupData} open={isDeleteOpen} onOpenChange={setDeleteOpen} />
    </>
  );
};

export default ClusterGroupActionMenu;
