import { AgentConfig } from '@/constants/agents';
import { chatAgent } from '@/signals/chat/agents';
import { PromptAgentTypeEnum } from '@/types/chat';
import { useSignals } from '@preact/signals-react/runtime';
import { useMemo } from 'react';

export type AgentItemProps = {
  agent: AgentConfig;
  handleSelect: (agentName: PromptAgentTypeEnum) => void;
};

const AgentItem = (props: AgentItemProps) => {
  useSignals();
  const { agent, handleSelect } = props;
  const activeAgent = chatAgent.value.activeAgent;

  const IconComponent = useMemo(() => agent.icon, [agent.icon]);

  return (
    <button
      key={agent.name}
      onClick={() => handleSelect(agent.name)}
      className={`w-full flex items-start gap-3 p-2 rounded-lg transition-colors ${
        activeAgent === agent.name ? 'bg-primary-950 border border-primary-950' : 'hover:bg-primary-50'
      }`}
    >
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
        style={{ backgroundColor: agent.hexColor }}
      >
        <IconComponent className={`w-4 h-4 ${agent.color}`} />
      </div>
      <div className="flex-1 text-left">
        <div
          className={`capitalize font-medium text-sm ${activeAgent === agent.name ? 'text-white' : 'text-text-950'}`}
        >
          {agent.label}
        </div>
        <div className={`text-xs line-clamp-3 mt-0.5 ${activeAgent === agent.name ? 'text-white' : 'text-text-500'}`}>
          {agent.defaultCommand}
        </div>
      </div>
    </button>
  );
};

export default AgentItem;
