'use client';

import ConnectClusterModal from '@/components/modals/ConnectClusterModal';
import React from 'react';
import Can from '@/lib/authorization/casl/Can';
import { EditClusterIcon } from '@/components/svgs/EditCluster';

export type NoVisualizationConnectedProps = {
  hasClusters: boolean;
};

const NoVisualizationConnected = ({ hasClusters }: NoVisualizationConnectedProps) => {
  return (
    <Can do="all" on="clusters">
      <div className="flex flex-col gap-12 w-[420px] h-[282px] items-center justify-center">
        <div className="flex flex-col justify-start items-center gap-4">
          <EditClusterIcon className="w-16 h-16 text-text-400 stroke-[0.5]" />

          <div className="flex flex-col justify-start items-center gap-5 w-[420px]">
            <div className="flex flex-col justify-start items-center gap-2 w-full">
              <div className="w-full text-center text-[18px] font-medium leading-[21.6px] text-text-400 break-words">
                Select Cluster for Visualization
              </div>
              <span className="text-[14px] font-normal leading-[16.8px] text-text-400 text-center">
                To visualize your cluster, please select a cluster in the filter on top. If no cluster is connected yet,
                please do so first.
              </span>
            </div>
          </div>
        </div>
        {!hasClusters && <ConnectClusterModal />}
      </div>
    </Can>
  );
};

export default NoVisualizationConnected;
