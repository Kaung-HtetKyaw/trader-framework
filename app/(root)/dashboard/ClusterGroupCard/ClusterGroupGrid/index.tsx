'use client';
import { cn, getHoverProps } from '@/lib/utils';
import { ClusterGroupWithStats } from '@/types/cluster';
import React, { useMemo } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ClusterTooltipContent from '../ClusterTooltipContent';
import { getClusterStatusByNumberOfUpgrades, getColorByClusterStatus } from '@/lib/status';
import { getClusterDetailsPath } from '@/app/(root)/clusters/urls';
import Link from 'next/link';

interface ClusterGroupGridProps {
  clusterGroupData: ClusterGroupWithStats;
}

const getGridDimensions = (total: number): { rows: number; columns: number } => {
  const MAX_ROWS = 3;
  let bestRows = 1;
  let bestCols = total;
  let bestDiff = Infinity;
  for (let rows = 1; rows <= Math.min(total, MAX_ROWS); rows++) {
    const cols = Math.ceil(total / rows);
    const diff = Math.abs(cols - rows);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestRows = rows;
      bestCols = cols;
    }
  }

  return { rows: bestRows, columns: bestCols };
};
const CluterGroupGrid = ({ clusterGroupData }: ClusterGroupGridProps) => {
  const clusters = clusterGroupData.clusters;
  const { columns } = useMemo(() => getGridDimensions(clusters.length), [clusters.length]);

  const rowChunks = useMemo(() => {
    const chunks: (typeof clusters)[] = [];
    for (let i = 0; i < clusters.length; i += columns) {
      chunks.push(clusters.slice(i, i + columns));
    }
    return chunks;
  }, [clusters, columns]);

  return (
    <TooltipProvider delayDuration={0}>
      <div className={cn('flex flex-col gap-1 rounded w-full h-24')} style={{ overflow: 'hidden' }}>
        {rowChunks.map((rowClusters, rowIndex) => {
          return (
            <div
              key={rowIndex}
              className="grid gap-1 w-full flex-1"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${rowClusters.length}, 1fr)`,
              }}
            >
              {rowClusters.map((cluster, index) => {
                const color = getColorByClusterStatus(
                  getClusterStatusByNumberOfUpgrades(cluster.stats?.numberOfUpgrades || 0)
                );

                return (
                  <Tooltip key={cluster.id ?? index}>
                    <TooltipTrigger asChild>
                      <Link href={getClusterDetailsPath(cluster.id)}>
                        <div
                          className={cn('rounded-md w-full h-full cursor-pointer transition-colors duration-300')}
                          style={{
                            backgroundColor: color.color,
                          }}
                          {...getHoverProps({ color: color.color, hoverColor: color.hover })}
                          role="button"
                        />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={6} className="bg-white rounded-md shadow-md px-3 py-2">
                      <ClusterTooltipContent cluster={cluster} />
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default CluterGroupGrid;
