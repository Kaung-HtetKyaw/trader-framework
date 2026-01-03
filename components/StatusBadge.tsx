import config from '@/lib/config';
import { ClusterStatusEnum } from '@/types/cluster';
import { getColorByClusterStatus } from '@/lib/status';
import React from 'react';
import { getHoverProps, noop } from '@/lib/utils';

type StatusBadgeProps = {
  count: number;
  status: ClusterStatusEnum;
  onClick?: () => void;
};

const StatusBadge = ({ count, status, onClick = noop }: StatusBadgeProps) => {
  const { label } = config.CLUSTER_STATUS_BADGE_UI[status];

  const color = getColorByClusterStatus(status);

  return (
    <div
      className={`flex items-center space-x-2 cursor-pointer rounded-md px-3 py-2`}
      {...getHoverProps({ color: '#fff', hoverColor: color.light })}
      onClick={onClick}
    >
      <div className="relative w-9 h-9">
        <img src={color.polygon.image} alt={label} className="w-full h-full object-contain" />
        <span
          style={{ color: color.polygon.color }}
          className="absolute inset-0 flex items-center justify-center  font-normal text-sm"
        >
          {count}
        </span>
      </div>
      <span className="text-gray-800 text-sm font-normal">{label}</span>
    </div>
  );
};

export default StatusBadge;
