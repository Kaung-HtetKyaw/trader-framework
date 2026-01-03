import React from 'react';
import Container from '@/components/Container';

const UpgradePlanSkeleton = () => {
  return (
    <div className="w-full flex flex-col px-4 overflow-y-auto h-[calc(100vh-24rem)]">
      <div className="flex justify-end items-center gap-3 mb-4">
        <div className="h-9 w-32 bg-text-100 rounded animate-pulse" />
        <div className="h-9 w-36 bg-text-100 rounded animate-pulse" />
      </div>

      <div className="flex flex-col gap-6">
        <SectionSkeleton
          title="1. API deprecations"
          description="Ensure that all K8s YAML you're deploying are conformant with the next K8s version"
          itemCount={2}
        />
        <SectionSkeleton
          title="2. Add-on incompatibilities"
          description="Ensure all known third-party add-ons are supported on the next K8s version"
          itemCount={2}
        />

        <SectionSkeleton
          title="3. Add-on mutual incompatibilities"
          description="Ensure all known third-party add-ons are supported on the next K8s version"
          itemCount={2}
        />
      </div>
    </div>
  );
};

const SectionSkeleton = ({ title, description, itemCount }: { title: string; description: string; itemCount: number }) => {
  return (
    <Container className="flex flex-col gap-4 p-0 h-full">
      <div className="flex flex-col gap-3">
        <p className="body-1 font-bold">{title}</p>
        <p className="body-2">{description}</p>
      </div>
      <Container className="body-2 h-full flex flex-col border-[0.5px] border-text-200 rounded-sm gap-6 bg-white">
        {Array.from({ length: itemCount }).map((_, index) => (
          <ItemSkeleton key={index} isLast={index === itemCount - 1} />
        ))}
      </Container>
    </Container>
  );
};


const ItemSkeleton = ({ isLast }: { isLast: boolean }) => {
  return (
    <div className={`flex flex-col gap-2 pb-4 ${!isLast ? 'border-b-text-200 border-b-[0.5px]' : ''}`}>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-3">
          <div className="w-[1.125rem] h-[1.125rem] bg-text-100 rounded animate-pulse" />
          <div className="h-5 bg-text-100 rounded w-64 animate-pulse" />
        </div>
        <div className="h-6 w-28 bg-text-100 rounded animate-pulse" />
      </div>
      <div className="flex flex-row items-center justify-between ml-9">
        <div className="px-0 flex gap-3 items-center bg-transparent rounded-sm">
          <div className="h-6 w-32 bg-text-100 rounded-sm animate-pulse" />
          <div className="bg-text-100 rounded-sm p-[3px]">
            <div className="w-4 h-4 bg-text-100 rounded animate-pulse" />
          </div>
          <div className="h-6 w-32 bg-text-100 rounded-sm animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default UpgradePlanSkeleton;
