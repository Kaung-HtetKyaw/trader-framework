'use client';

import { ClusterGroupIcon } from '@/components/svgs/ClusterGroupIcon';
import { cn } from '@/lib/utils';
import { ClusterStatusEnum } from '@/types/cluster';

const getColor = (status: ClusterStatusEnum) => {
  return cn({
    'bg-primary-800': status === 'HEALTHY',
    'bg-warning-500': status === 'UNHEALTHY',
    'bg-error-600': status === 'AT_RISK',
  });
};

const ClusterGroupDetailsBanner = () => {
  return (
    <div className=" flex flex-col lg:flex-row justify-start lg:items-center gap-5 lg:gap-0 px-4 py-[1.125rem] bg-white rounded-md shadow-sm">
      <div className="px-6 border-r-none lg:border-r-thin border-r-solid border-r-text-200 flex flex-row gap-2 items-center">
        <div className="w-[2rem] flex justify-center items-center h-[2rem] p-1 rounded-[6px] bg-text-50 ">
          <ClusterGroupIcon className="w-6 h-6 text-text-950" />
        </div>

        <p className="body-1 font-bold text-text-950 ">Production Testing</p>

        <span className="px-2 py-1 bg-text-50 font-bold text-secondary-950 rounded-[0.375rem] ">
          36
        </span>
      </div>

      <div className="px-6 border-r-none lg:border-r-thin border-r-solid border-r-text-200 flex flex-row gap-2 items-center">
        <div
          className={cn(
            getColor('HEALTHY'),
            'w-[2rem] flex justify-center items-center h-[2rem] p-1 rounded-[6px] '
          )}
        >
          <span className="body-2 text-white">28</span>
        </div>

        <p className="body-1 text-text-950 ">Healthy</p>
      </div>

      <div className="px-6 border-r-none lg:border-r-thin border-r-solid border-r-text-200 flex flex-row gap-2 items-center">
        <div
          className={cn(
            getColor('UNHEALTHY'),
            'w-[2rem] flex justify-center items-center h-[2rem] p-1 rounded-[6px] '
          )}
        >
          <span className="body-2 text-white">2</span>
        </div>

        <p className="body-1 text-text-950 ">Unhealthy</p>
      </div>

      <div className="px-6 border-r-none lg:border-r-thin border-r-solid border-r-text-200 flex flex-row gap-2 items-center">
        <div
          className={cn(
            getColor('AT_RISK'),
            'w-[2rem] flex justify-center items-center h-[2rem] p-1 rounded-[6px] '
          )}
        >
          <span className="body-2 text-white">6</span>
        </div>

        <p className="body-1 text-text-950 ">At Risk</p>
      </div>
    </div>
  );
};

export default ClusterGroupDetailsBanner;
