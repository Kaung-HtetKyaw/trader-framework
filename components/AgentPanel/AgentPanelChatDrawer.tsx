'use client';
import Assistant from './Assistant';
import DialogPanel from './DialogPanel';
import EventsPanelContent from '../visualization/Events/EventsPanelContent';
import RecentChatHistory from '@/components/RecentChatHistory';
import { AI_PANEL_TYPES } from '@/signals/drawers/ai-panel';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { AGENTS, DEFAULT_AGENT_COLOR } from '@/constants/agents';
import { useGetCustomAgentsQuery } from '@/store/api/agentApi';
import DefaultCustomAgentIcon from '../svgs/DefaultCustomAgentIcon';

const AgentPanelChatDrawer = () => {
  const { data: customAgentsData } = useGetCustomAgentsQuery();

  const builtInAgentConfig = useMemo(() => AGENTS, []);

  const customAgentConfig = useMemo(
    () =>
      customAgentsData?.items.map(item => ({
        name: item.name,
        label: item.name,
        defaultCommand: item.description || '',
        description: item.description || '',
        color: 'text-white',
        hexColor: DEFAULT_AGENT_COLOR,
        icon: DefaultCustomAgentIcon,
      })) || [],
    [customAgentsData]
  );

  const renderPanelContent = (activePanel: string) => {
    return (
      <div className="relative w-full h-full">
        <div
          id="assistant-panel"
          className={cn(
            'absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none invisible z-[-1]',
            (activePanel === AI_PANEL_TYPES.assistant || !activePanel) && 'opacity-100 pointer-events-auto visible z-0'
          )}
        >
          <Assistant builtInAgentConfig={builtInAgentConfig} customAgentConfig={customAgentConfig} />
        </div>
        <div
          id="events-panel"
          className={cn(
            'absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none invisible z-[-1]',
            activePanel === AI_PANEL_TYPES.events && 'opacity-100 pointer-events-auto visible z-0'
          )}
        >
          <EventsPanelContent />
        </div>
        <div
          id="history-panel"
          className={cn(
            'absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none invisible z-[-1]',
            activePanel === AI_PANEL_TYPES.history && 'opacity-100 pointer-events-auto visible z-0'
          )}
        >
          <RecentChatHistory />
        </div>
      </div>
    );
  };

  return <DialogPanel renderContent={renderPanelContent} />;
};

export default AgentPanelChatDrawer;
