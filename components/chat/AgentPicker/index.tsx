import React, { useState, useMemo, useCallback } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import StackedLayersIcon from '@/components/svgs/StackedLayersIcon';
import { AgentConfig } from '@/constants/agents';
import { chatAgent, changeActiveAgent } from '@/signals/chat/agents';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { PromptAgentTypeEnum } from '@/types/chat';
import SearchLineIcon from '@/components/svgs/SearchLineIcon';
import { ChevronDown } from 'lucide-react';
import { setChatMessagesLoading } from '@/signals/chat/messages';
import AgentItem from './AgentItem';

export type AgentPickerProps = {
  builtInAgentConfig: AgentConfig[];
  customAgentConfig: AgentConfig[];
};

export const AgentPicker = (props: AgentPickerProps) => {
  useSignals();
  const { builtInAgentConfig, customAgentConfig: customAgents } = props;
  const activeAgent = chatAgent.value.activeAgent;
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);

  const builtInAgents = useMemo(
    () => builtInAgentConfig.filter(agent => agent.label.toLowerCase().includes(searchQuery.toLowerCase())),
    [builtInAgentConfig, searchQuery]
  );

  const filteredAgents = useMemo(() => [...builtInAgents, ...customAgents], [builtInAgents, customAgents]);

  const agentsGroups = useMemo(() => {
    return [
      { label: 'Build-in Agents', agents: builtInAgents },
      { label: 'Custom Agents', agents: customAgents },
    ].filter(group => group.agents.length > 0);
  }, [builtInAgents, customAgents]);

  const currentAgent = useMemo(
    () => (activeAgent ? filteredAgents.find(agent => agent.name === activeAgent) : null),
    [activeAgent, filteredAgents]
  );

  const handleAgentSelect = useCallback((agentId: PromptAgentTypeEnum) => {
    setOpen(false);
    setTimeout(() => {
      changeActiveAgent(agentId);
      setChatMessagesLoading(false);
    }, 200);
  }, []);

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 text-sm font-medium text-text-950 h-[51px] hover:bg-gray-100 rounded-lg transition-colors border shadow-sm bg-white min-h-[40px]">
          {currentAgent ? (
            <>
              {(() => {
                const IconComponent = currentAgent.icon;
                return (
                  <div
                    className="flex items-center justify-center w-6 h-6 rounded-lg"
                    style={{ backgroundColor: currentAgent.hexColor }}
                  >
                    <IconComponent className={`w-3 h-3 ${currentAgent.color}`} />
                  </div>
                );
              })()}
              <span className="capitalize">{currentAgent.label}</span>
              <ChevronDown className="ml-auto w-4 h-4 text-text-500" />
            </>
          ) : (
            <>
              <StackedLayersIcon className="w-4 h-4 text-secondary-500" />
              <span>Choose Agent</span>
              <ChevronDown className="ml-auto w-4 h-4 text-text-500" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="end"
        sideOffset={16}
        className="w-72 h-[360px] bg-white rounded-lg shadow-lg border border-text-100 p-0 flex flex-col"
      >
        <div className="p-3 border-text-100">
          <div className="relative">
            <SearchLineIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-500" />
            <Input
              type="text"
              placeholder="Search Agents"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-text-100 rounded-lg focus:outline-none"
            />
          </div>
        </div>

        <div
          className={`overflow-y-auto overflow-x-hidden p-2 flex-1 scrollbar-hide ${filteredAgents.length === 0 ? 'flex items-center justify-center' : ''}`}
          style={{
            overscrollBehavior: 'contain',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          onWheel={e => e.stopPropagation()}
        >
          {filteredAgents.length === 0 ? (
            <div className="text-center">
              <div className="text-sm text-text-500 px-2 py-1 font-semibold">No agent could be found</div>
              <div className="text-sm text-text-500 px-2 py-1 font-normal">
                Please search for a different agent name or keyword
              </div>
            </div>
          ) : (
            <div className="space-y-1 flex flex-col gap-4">
              {agentsGroups.map(agentGroup => (
                <div key={agentGroup.label} className="flex flex-col gap-1">
                  <span className="body-1 text-text-700 font-normal">{agentGroup.label}</span>

                  <div>
                    {agentGroup.agents.map(agent => (
                      <AgentItem key={agent.name} agent={agent} handleSelect={handleAgentSelect} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
