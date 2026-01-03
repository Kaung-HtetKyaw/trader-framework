'use client';

import ConnectClusterModal from '@/components/modals/ConnectClusterModal';
import React from 'react';
import Can from '@/lib/authorization/casl/Can';
import { EmptyClusterIcon } from '@/components/svgs/EmptyClusterIcon';

const ConnectCluster = () => {
  return (
    <Can do="all" on="clusters">
      <div className="flex flex-col gap-12 w-[420px] h-[282px] items-center justify-center">
        <div className="flex flex-col justify-start items-center gap-4">
          <EmptyClusterIcon className="w-16 h-16 text-text-400" />

          <div className="flex flex-col justify-start items-center gap-5 w-[420px]">
            <div className="flex flex-col justify-start items-center gap-2 w-full">
              <div className="w-full text-center text-[18px] font-medium leading-[21.6px] text-text-400 break-words">
                No cluster connected yet!
              </div>
              <div className="w-full text-center text-[14px] font-normal leading-[16.8px] text-text-400 break-words">
                To view the cluster details, please connect a cluster first.
              </div>
            </div>
            <div className="w-full text-center px-2">
              <span className="text-[14px] font-normal leading-[16.8px] text-text-400">
                The connection process&nbsp;
              </span>
              <span className="text-[14px] font-bold leading-[16.8px] text-text-400">may take a few minutes</span>
              <span className="text-[14px] font-normal leading-[16.8px] text-text-400">
                &nbsp;to finish. If this takes longer than expected, please refresh, try again or contact support.
              </span>
            </div>
          </div>
        </div>
        <ConnectClusterModal />
      </div>
    </Can>
  );
};

export default ConnectCluster;
