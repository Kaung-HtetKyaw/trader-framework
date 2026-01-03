import React, { useEffect, useRef, useState } from 'react';
import { ChatInputIcon } from '../svgs/ChatInputIcon';
import { useSignals } from '@preact/signals-react/runtime';
import { chatAgent } from '@/signals/chat/agents';
import { AgentPicker } from './AgentPicker';
import { AgentConfig } from '@/constants/agents';

interface ChatInputProps {
  builtInAgentConfig: AgentConfig[];
  customAgentConfig: AgentConfig[];
  onSubmit: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = (props: ChatInputProps) => {
  useSignals();
  const { builtInAgentConfig, customAgentConfig, onSubmit, disabled } = props;
  const [value, setValue] = useState('');
  const activeAgent = chatAgent.value.activeAgent;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled && value.trim()) {
        onSubmit(value.trim());
        setValue('');
      }
    }
  };

  const handleSubmit = () => {
    if (!disabled && value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 80)}px`;
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-2 pt-2 pb-2 bg-white">
      <div className="flex items-end gap-3">
        <div className="relative flex-1 bg-white rounded-lg border shadow-sm">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={activeAgent ? 'Type to ask the Kube Agents' : 'Please select an agent first'}
            disabled={!activeAgent}
            rows={1}
            style={{
              height: 'auto',
              minHeight: '40px',
              maxHeight: '80px',
              overflowY: textareaRef.current && textareaRef.current.scrollHeight > 80 ? 'auto' : 'hidden',
              resize: 'none',
            }}
            className="w-full px-4 py-3 pr-12 bg-transparent border-none outline-none text-[14px] font-normal placeholder-gray-400 resize-none hide-scrollbar disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            onClick={handleSubmit}
            disabled={disabled || !value.trim()}
            className="absolute right-2 bottom-2 p-2 rounded-full hover:bg-secondary-100 disabled:hover:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            <ChatInputIcon
              className={`w-4 h-4 ${disabled || !value.trim() ? 'text-gray-400' : 'text-secondary-500'}`}
            />
          </button>
        </div>
        <AgentPicker builtInAgentConfig={builtInAgentConfig} customAgentConfig={customAgentConfig} />
      </div>
    </div>
  );
};

export default ChatInput;
