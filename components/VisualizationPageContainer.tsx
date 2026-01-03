'use client';
import React from 'react';
import useResizeVisualizationCanvas from '@/lib/hooks/useResizeVisualizationCanvas';
import VisualizationFilters from '@/app/(root)/visualization/VisualizationFilters';
import { cn } from '@/lib/utils';
import AgentPanelChatDrawer from './AgentPanel/AgentPanelChatDrawer';

export type VisualizationPageContainerProps = {
  children: React.ReactNode;
  visualizationClassName?: string;
};

const VisualizationPageContainer = ({ children, visualizationClassName }: VisualizationPageContainerProps) => {
  const { computedHeight } = useResizeVisualizationCanvas();

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="min-h-[60px] bg-white w-full flex-shrink-0 overflow-x-auto">
        <VisualizationFilters />
      </div>
      <div
        style={{
          height: computedHeight,
        }}
        className={cn('flex pl-4 gap-4 flex-1 min-h-0')}
      >
        <div className={cn('flex-1', visualizationClassName)}>{children}</div>
        <AgentPanelChatDrawer />
      </div>
    </div>
  );
};

export default VisualizationPageContainer;
