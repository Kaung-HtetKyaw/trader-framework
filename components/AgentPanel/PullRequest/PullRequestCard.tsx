'use client';
import { GithubIcon } from '@/components/svgs/GithubIcon';
import React from 'react';

type pullRequestCardProps = {
  title: string;
  description: string;
};
const PullRequestCard = ({ title, description }: pullRequestCardProps) => {
  return (
    <div className="flex flex-col border border-text-200 rounded-lg bg-white p-[16px] w-full gap-2">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <GithubIcon className="w-6 h-6 text-error-500" />
          <span className="text-text-950 font-semibold px-2 py-1 rounded-r-lg text-sm">{title}</span>
        </div>
      </div>
      <div className="text-text-950 text-[12px] leading-snug">{description}</div>
    </div>
  );
};

export default PullRequestCard;
