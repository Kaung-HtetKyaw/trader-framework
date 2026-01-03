import React, { useCallback, useState } from 'react';
import { AGENTS } from '@/constants/agents';
import { PromptAgentTypes, PromptAgentTypeEnum } from '@/types/chat';
import { chatMessages, setChatMessagesLoading } from '@/signals/chat/messages';
import { changeActiveAgent } from '@/signals/chat/agents';
import { useSignals } from '@preact/signals-react/runtime';
import LoaderLine from '@/components/svgs/LoaderLine';

// Filter out Pull Request from empty messages - it's triggered via suggestions
const DISPLAY_AGENTS = AGENTS.filter(agent => agent.name !== PromptAgentTypes.git);

interface EmptyMessagesProps {
  onSubmit?: (message: string) => void;
}

const EmptyMessages = ({ onSubmit }: EmptyMessagesProps) => {
  useSignals();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAgentClick = useCallback((agentName: PromptAgentTypeEnum, defaultCommand: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    changeActiveAgent(agentName);
    setChatMessagesLoading(false);

    if (onSubmit) {
      onSubmit(defaultCommand);
    }
  }, [onSubmit, isSubmitting]);

  if (chatMessages.value.loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoaderLine className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-8">
      <h2 className="text-xl font-semibold text-text-950 mb-2">Ask the Kubegrade Agents</h2>
      <p className="text-sm text-text-600 mb-8 text-center max-w-md">
        Start chatting with the Assistant to route to dedicated Agents for specific tasks you want them to execute
      </p>

      <div className="grid grid-cols-3 gap-4 w-full max-w-3xl">
        {DISPLAY_AGENTS.map(agent => {
          const IconComponent = agent.icon;
          return (
            <div
              key={agent.name}
              onClick={() => handleAgentClick(agent.name, agent.defaultCommand)}
              className={`relative flex flex-col items-start p-4 border border-text-100 rounded-lg transition-all bg-white shadow-sm ${
                isSubmitting
                  ? 'cursor-not-allowed opacity-60 pointer-events-none'
                  : 'cursor-pointer hover:border-primary-400 hover:shadow-sm'
              }`}
            >
              <div
                className="flex items-center justify-center w-9 h-9 rounded-lg mb-3"
                style={{ backgroundColor: agent.hexColor }}
              >
                <IconComponent className={`w-4 h-4 ${agent.color}`} />
              </div>
              <p className="text-sm text-text-950 font-medium">{agent.defaultCommand}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmptyMessages;
