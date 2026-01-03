'use client';

import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { CLUSTER_DETAILS_LIST_PATH } from '@/app/(root)/clusters/urls';
import { useMemo } from 'react';
import { ConnectClusterIcon } from './svgs/ConnectClusterIcon';

const ClusterConnectButton = () => {
  const pathname = usePathname();

  const shouldAddConnect = useMemo(() => {
    return pathname === CLUSTER_DETAILS_LIST_PATH;
  }, [pathname]);

  if (!shouldAddConnect) return null;

  return (
    <div className="flex flex-row mb-3 h-12 items-center bg-secondary-50 justify-end px-4">
      <Button className="flex flex-row justify-center items-center h-9 bg-secondary-500 text-white rounded-m">
        <span>Connect Cluster</span>
        <ConnectClusterIcon className="w-4 h-4 ml-2 text-text-50" />
      </Button>
    </div>
  );
};

export default ClusterConnectButton;
