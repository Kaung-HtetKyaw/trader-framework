'use client';
import React from 'react';
import { Cluster, ClusterStatusEnum } from '@/types/cluster';
import { getColorByClusterStatus } from '@/lib/status';

interface Props {
  cluster: Cluster;
}

const ClusterTooltipContent = ({ cluster }: Props) => {
  const upgradeColor = getColorByClusterStatus(cluster.stats?.status as ClusterStatusEnum);

  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 mt-[2px]">
        <img src="/icons/simpleicons.svg" alt="Cluster Icon" width={24} height={24} />
      </div>
      <div className="flex flex-col text-sm leading-tight">
        <span className="font-semibold text-text-950">{cluster.name}</span>
        <div className="flex items-center gap-2 text-xs mt-0.5">
          <span className="font-normal text-text-950">{cluster.version}</span>
          <span className="font-notmal" style={{ color: upgradeColor.dark }}>
            Upgrades: {cluster.stats?.numberOfUpgrades}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClusterTooltipContent;
