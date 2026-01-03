import { ClusterStatusEnum } from '@/types/cluster';
import { getColorByClusterStatus } from '@/lib/status';
import React from 'react';
import { noop } from '@/lib/utils';

type StatusBadgeProps = {
  count: number;
  status: ClusterStatusEnum;
  onClick?: () => void;
};

const SquareStatusBadge = ({ count, status, onClick = noop }: StatusBadgeProps) => {
  const color = getColorByClusterStatus(status);

  return (
    <div className={`h-4 flex items-center gap-1 cursor-pointer`} onClick={onClick}>
      <div style={{ backgroundColor: color.color }} className="w-[9px] h-4 rounded" />
      <div className="text-text-950 text-sm font-normal leading-[16.8px]">{count}</div>
    </div>
  );
};

export default SquareStatusBadge;
