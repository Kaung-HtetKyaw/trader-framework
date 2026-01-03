import { signal } from '@preact/signals-react';
import { PromptAgentTypeEnum } from '@/types/chat';

type ChatAgentSignal = {
  activeAgent: PromptAgentTypeEnum | '';
};

const chatAgent = signal<ChatAgentSignal>({
  activeAgent: '',
});

const changeActiveAgent = (agent: PromptAgentTypeEnum | '') => {
  chatAgent.value = {
    ...chatAgent.value,
    activeAgent: agent,
  };
};

export { chatAgent, changeActiveAgent };
