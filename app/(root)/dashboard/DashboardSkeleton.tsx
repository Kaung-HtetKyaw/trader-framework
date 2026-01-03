import React from 'react';
import { ClusterGroupIcon } from '@/components/svgs/ClusterGroupIcon';
import { BugIcon } from '@/components/svgs/BugIcon';
import { PolygonIcon } from '@/components/svgs/PolygonIcon';
import { Separator } from '@/components/ui/separator';

const DashboardSkeleton = () => {
  return (
    <div className="flex justify-center px-4 flex-col gap-2 w-full pb-6">
      {[1, 2, 3, 4].map(index => (
        <div key={index} className="relative w-full bg-white rounded-lg shadow-sm mt-4 p-4 sm:p-6 flex min-h-[128px]">
          <div className="absolute top-3 right-3 z-10">
            <div className="w-6 h-6 bg-text-200 rounded animate-pulse" />
          </div>

          <div className="flex flex-col md:flex-row gap-8 w-full">
            <section className="w-full md:w-[50%] xl:w-[50%] min-h-[96px]">
              <div className="w-full bg-white rounded-xl flex flex-col justify-center items-start gap-4">
                <div className="w-full flex justify-between items-center gap-8">
                  <div className="flex justify-start items-center gap-3">
                    <div className="flex gap-3 justify-start items-center">
                      <div className="w-12 h-12 px-1 flex flex-col justify-center items-center gap-1 bg-text-50 rounded-lg shrink-0 opacity-50">
                        <ClusterGroupIcon className="w-6 h-6 text-text-950" />
                      </div>
                      <div className="flex flex-col justify-center items-start gap-1">
                        <div className="h-4 bg-text-200 rounded w-32 animate-pulse" />
                        <div className="h-3 bg-text-200 rounded w-24 animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-8 items-center">
                      <Separator orientation="vertical" className="bg-text-200" />
                    </div>

                    <div className="flex justify-start items-center gap-3">
                      <div className="relative w-9 h-9">
                        <PolygonIcon className="w-full h-full text-text-200" />
                        <BugIcon className="w-4 h-4 absolute inset-0 m-auto text-text-50" />
                      </div>
                      <div className="flex flex-col justify-center items-start gap-1">
                        <div className="h-4 bg-text-200 rounded w-20 animate-pulse" />
                        <div className="h-3 bg-text-200 rounded w-24 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full h-9 px-4 bg-text-50 rounded-lg flex items-center gap-4">
                  <div className="h-4 bg-text-200 rounded w-16 animate-pulse" />
                  <div className="flex justify-start items-center gap-6">
                    <div className="h-6 w-6 bg-text-200 rounded animate-pulse" />
                    <div className="h-6 w-6 bg-text-200 rounded animate-pulse" />
                    <div className="h-6 w-6 bg-text-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </section>

            <section className="w-full md:w-[50%] xl:w-[50%] min-h-[96px] pr-0 md:pr-4">
              <div className="flex flex-col gap-1 rounded w-full h-24">
                {[1, 2, 3].map(row => (
                  <div key={row} className="grid gap-1 w-full flex-1" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    {[1, 2, 3, 4].map(col => (
                      <div key={col} className="rounded-md w-full h-full bg-text-200 animate-pulse" />
                    ))}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardSkeleton;
