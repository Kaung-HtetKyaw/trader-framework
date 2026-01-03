import React from 'react';
import ChatInput from './ChatInput';
import { AgentConfig } from '@/constants/agents';

type ChatProps = {
  builtInAgentConfig: AgentConfig[];
  customAgentConfig: AgentConfig[];
  onSubmit: (message: string) => void;
  disabled?: boolean;
};

const Chat: React.FC<ChatProps> = ({ builtInAgentConfig, customAgentConfig, onSubmit, disabled }) => {
  return (
    <ChatInput
      builtInAgentConfig={builtInAgentConfig}
      customAgentConfig={customAgentConfig}
      onSubmit={onSubmit}
      disabled={disabled}
    />
  );
};

export default Chat;
