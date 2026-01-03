import React, { useMemo } from 'react';
import { Separator } from '@/components/ui/separator';
import type { AgentConfig } from '@/constants/agents';

interface SectionSeparatorProps {
  agentName: string;
  builtInAgentConfig: AgentConfig[];
  customAgentConfig: AgentConfig[];
  labelColor?: string;
  separatorColor?: string;
}

const SectionSeparator = (props: SectionSeparatorProps) => {
  const { agentName, builtInAgentConfig, customAgentConfig, separatorColor, labelColor = 'text-text-500' } = props;

  // Use separatorColor if provided, otherwise derive from labelColor by replacing 'text-' with 'bg-'
  const bgColor = separatorColor || labelColor?.replace('text-', 'bg-') || 'bg-text-500';

  const agentConfig = useMemo(() => {
    const builtInAgent = builtInAgentConfig.find(agent => agent.name === agentName);
    const customAgent = customAgentConfig.find(agent => agent.name === agentName);

    if (builtInAgent) {
      return builtInAgent;
    }

    return customAgent || null;
  }, [agentName, builtInAgentConfig, customAgentConfig]);

  const agentLabel = useMemo(() => {
    return agentConfig?.label || '';
  }, [agentConfig]);

  return (
    <div className="flex items-center gap-3 my-2">
      <Separator className={`flex-1 h-[0.5px] ${bgColor}`} />
      <span className={`flex items-center gap-2 text-sm font-semibold capitalize ${labelColor}`}>
        {agentConfig && (
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={{ backgroundColor: agentConfig.hexColor }}
          >
            <agentConfig.icon className={`w-3 h-3 ${agentConfig.color}`} />
          </div>
        )}
        {agentLabel}
      </span>
      <Separator className={`flex-1 h-[0.5px] ${bgColor}`} />
    </div>
  );
};

export default SectionSeparator;
