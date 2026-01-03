'use client';

import React from 'react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import redPolygonIcon from '@/public/icons//Polygon-red.svg';
import SquareStatusBadge from '@/components/SquareStatusBadge';
import { CLUSTER_STATUSES } from '@/lib/config';
import { capitalize } from 'lodash';
import { ClusterGroupWithStats } from '@/types/cluster';
import Link from 'next/link';
import { CLUSTER_DETAILS_LIST_PATH } from '@/app/(root)/clusters/urls';
import { ClusterGroupIcon } from '@/components/svgs/ClusterGroupIcon';
import { BugIcon } from '@/components/svgs/BugIcon';

interface ClusterGroupInfoProps {
  clusterGroupData: ClusterGroupWithStats;
}

const ClusterGroupInfo = ({ clusterGroupData }: ClusterGroupInfoProps) => {
  return (
    <div className="w-full bg-white rounded-xl flex flex-col justify-center items-start gap-4 inline-flex">
      <div className="w-full flex justify-start items-center gap-8">
        <div className="flex-1 flex justify-start items-center gap-3">
          <Link
            className="flex-1 flex gap-3 justify-start items-center"
            href={`${CLUSTER_DETAILS_LIST_PATH}?group=${encodeURIComponent(clusterGroupData.name || '')}`}
          >
            <div className="w-12 h-12 px-1 flex flex-col justify-center items-center gap-1 bg-text-50 rounded-lg shrink-0">
              <ClusterGroupIcon className="w-6 h-6 text-text-950" />
            </div>

            <div className="flex-1 self-stretch flex flex-col justify-center items-start gap-1">
              <span
                style={{ overflowWrap: 'anywhere' }}
                className="text-text-950 text-sm font-semibold leading-[16.8px] cursor-pointer line-clamp-3"
              >
                {capitalize(clusterGroupData.name)}
              </span>

              <div className="flex justify-start items-start gap-1">
                <div className="text-text-500 text-xs font-normal leading-[15.6px]">Cluster Group</div>
              </div>
            </div>
          </Link>

          <div className="flex h-8 items-center">
            <Separator orientation="vertical" className="bg-text-200" />
          </div>

          <div className="flex justify-start items-center gap-3">
            <div className="relative w-9 h-9">
              <Image src={redPolygonIcon} alt="polygon background" className="w-full h-full object-contain" />
              <BugIcon className="w-4 h-4 absolute inset-0 m-auto text-text-50" />
            </div>
            <div className="flex flex-col justify-center items-start">
              <div className="text-text-950 text-sm font-normal leading-[16.8px]">
                {clusterGroupData.noOfClustersNeedsUpgrades}{' '}
                {clusterGroupData.noOfClustersNeedsUpgrades <= 1 ? 'Cluster' : 'Clusters'}
              </div>
              <div className="text-text-500 text-[10px] font-normal leading-[13px]">
                {clusterGroupData.noOfClustersNeedsUpgrades <= 1 ? 'Need Upgrade!' : 'Need Upgrades!'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-9 px-4 bg-text-50 rounded-lg flex items-center gap-4">
        <div className="rounded-lg flex items-center gap-4">
          <div className="flex flex-col justify-center text-text-950 text-sm font-normal leading-[16.8px]">
            Clusters
          </div>

          <div className="flex justify-start items-center gap-6">
            <Link
              href={`${CLUSTER_DETAILS_LIST_PATH}?group=${encodeURIComponent(clusterGroupData.name || '')}&status=${CLUSTER_STATUSES.HEALTHY}`}
            >
              <SquareStatusBadge count={clusterGroupData.healthy} status={CLUSTER_STATUSES.HEALTHY} />
            </Link>
            <Link
              href={`${CLUSTER_DETAILS_LIST_PATH}?group=${encodeURIComponent(clusterGroupData.name || '')}&status=${CLUSTER_STATUSES.AT_RISK}`}
            >
              <SquareStatusBadge count={clusterGroupData.atRisk} status={CLUSTER_STATUSES.AT_RISK} />
            </Link>
            <Link
              href={`${CLUSTER_DETAILS_LIST_PATH}?group=${encodeURIComponent(clusterGroupData.name || '')}&status=${CLUSTER_STATUSES.UNHEALTHY}`}
            >
              <SquareStatusBadge count={clusterGroupData.unhealthy} status={CLUSTER_STATUSES.UNHEALTHY} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClusterGroupInfo;
