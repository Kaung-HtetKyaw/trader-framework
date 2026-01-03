import { Plus } from 'lucide-react';
import React, { useMemo } from 'react';
import { AssistantIcon } from '@/components/svgs/AssistantIcon';
import { EventIcon } from '@/components/svgs/EventIcon';
import { ActiveAIPanelTypeEnum, AIPanel, AIPanelTypeEnum } from '@/signals/drawers/ai-panel';
import ClockLineIcon from '@/components/svgs/ClockLineIcon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PanelSidebarProps {
  onPanelChange?: (panelId: ActiveAIPanelTypeEnum) => void;
  activePanel?: string;
  hasSelectedObjects?: boolean;
  hasMessages?: boolean;
  onOpenPanel?: () => void;
  isChatLoading?: boolean;
}

type PanelSidebarItem = {
  id: AIPanelTypeEnum;
  label: string;
  requiresSelection: boolean;
  icon: (activePanel: string, isDisabled: boolean) => React.ReactNode;
};

export const AI_PANEL_SIDEBAR_WIDTH = 80;

const PanelSidebar = ({
  onPanelChange,
  activePanel = '',
  hasSelectedObjects = false,
  hasMessages = false,
  onOpenPanel,
  isChatLoading = false,
}: PanelSidebarProps) => {
  const isPanelOpen = AIPanel.value.isAIPanelOpen;
  const isPlusEnabled = hasSelectedObjects && (!isPanelOpen || hasMessages) && !isChatLoading;
  const sidebarItems: PanelSidebarItem[] = useMemo(
    () => [
      {
        id: 'assistant',
        label: 'Assistant',
        requiresSelection: true,
        icon: (activePanel: string, isDisabled: boolean) => (
          <AssistantIcon
            className={`w-5 h-5 ${isDisabled ? 'text-text-300' : activePanel === 'assistant' ? 'text-text-50' : 'text-primary-950'}`}
          />
        ),
      },
      {
        id: 'events',
        label: 'Events',
        requiresSelection: true,
        icon: (activePanel: string, isDisabled: boolean) => (
          <EventIcon
            className={`w-5 h-5 ${isDisabled ? 'text-text-300' : activePanel === 'events' ? 'text-text-50' : 'text-primary-950'}`}
          />
        ),
      },
      {
        id: 'history',
        label: 'Recent',
        requiresSelection: false,
        icon: (activePanel: string) => (
          <ClockLineIcon
            className={`w-5 h-5  ${activePanel === 'history' ? '!text-text-50 stroke-[1px]' : '!text-primary-950 stroke-[0.5px]'}`}
          />
        ),
      },
    ],
    []
  );

  return (
    <TooltipProvider delayDuration={100}>
      <div
        style={{ width: `${AI_PANEL_SIDEBAR_WIDTH}px` }}
        className="flex flex-col justify-between flex-shrink-0 bg-text-50 border-l-[1px] border-l-text-200 h-full"
      >
        <div>
          {sidebarItems.map(item => {
            const isDisabled = item.requiresSelection && !hasSelectedObjects;
            return (
              <div
                key={item.id}
                onClick={() => !isDisabled && onPanelChange?.(item.id)}
                className={`p-2 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div
                  className={`
                  flex flex-col items-center justify-center p-3 rounded-lg transition-colors duration-200
                  ${
                    isDisabled
                      ? 'text-text-300 opacity-50'
                      : activePanel === item.id
                        ? 'text-text-50 bg-primary-950'
                        : 'text-primary-950 hover:bg-text-100'
                  }
                `}
                >
                  <div className="mb-1">{item.icon(activePanel, isDisabled)}</div>
                  <span className="text-xs font-medium text-center">{item.label}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-4 pb-5">
          {isPanelOpen && !isPlusEnabled ? (
            <div
              onClick={() => isPlusEnabled && onOpenPanel?.()}
              className={`flex items-center justify-center p-3 rounded-lg transition-colors duration-200 ${isPlusEnabled ? 'cursor-pointer text-text-50 bg-secondary-500 hover:bg-secondary-600' : 'cursor-not-allowed text-text-300 bg-text-200 opacity-50'}`}
            >
              <Plus className="w-5 h-5" />
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={() => isPlusEnabled && onOpenPanel?.()}
                  className={`flex items-center justify-center p-3 rounded-lg transition-colors duration-200 ${isPlusEnabled ? 'cursor-pointer text-text-50 bg-secondary-500 hover:bg-secondary-600' : 'cursor-not-allowed text-text-300 bg-text-200 opacity-50'}`}
                >
                  <Plus className="w-5 h-5" />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={8}
                className="text-xs font-medium bg-white text-secondary-400 rounded-md shadow-md px-3 py-2"
              >
                {isPlusEnabled ? 'New Chat' : 'Select objects to start a new chat'}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PanelSidebar;
