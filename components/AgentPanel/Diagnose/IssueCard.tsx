import React from 'react';
import MarkdownOutput from '@/components/chat/MarkdownOutput';

interface IssueCardProps {
  title?: string;
  description: string;
  onRefChange?: (element: HTMLDivElement | null) => void;
}

const IssueCard = ({ title, description, onRefChange }: IssueCardProps) => {
  return (
    <div ref={onRefChange} className="flex flex-col border border-text-200 rounded-lg bg-white p-[16px] w-full">
      <div className="flex items-center justify-between w-full mb-4">
        <span className="text-text-950 font-semibold text-sm">{title}</span>
      </div>
      <div className="text-text-950 text-sm leading-snug">
         <MarkdownOutput content={description} />
      </div>
    </div>
  );
};

export default IssueCard;