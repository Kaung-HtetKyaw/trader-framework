/* eslint-disable @typescript-eslint/no-explicit-any */
export type PromptRequest = {
  input: string;
};

export type PromptResponse = {
  output: string;
};

export type HistoryMessage = {
  id: string;
  message: string;
  sender: string;
  createdAt: string;
  action?: Record<string, any>;
};

export type ChatHistoryRequest = {
  pagination: {
    page: number;
    pageSize: number;
  };
};

export type ChatHistoryResponse = {
  items: HistoryMessage[];
  total: number;
  page: number;
  pageSize: number;
};

export type PromptNodeContext = {
  clusterID: string;
  id: string;
  namesapce: string;
  name: string;
  kind: string;
};

export const PromptAgentTypes = {
  assistant: 'assistant',
  upgrader: 'upgrader',
  inspector: 'inspector',
  git: 'git',
} as const;
export type PromptAgentTypeEnum = keyof typeof PromptAgentTypes | string;

export const PromptSenderTypes = {
  human: 'human',
} as const;
export type PromptSenderTypeEnum = 'human' | string;

export type ChatMessage = {
  chatSessionID: string;
  agent: PromptAgentTypeEnum;
  message: string;
  sender: PromptSenderTypeEnum;
  action: any;
  selectedObjects: PromptNodeContext[];
  contexts?: {
    selectedObjects: PromptNodeContext[];
    selectedDeprecatedAPIs?: any[] | null;
    selectedUpgradableComponents?: any[] | null;
    selectedMutualIncompatibilities?: any[] | null;
  };
  createdAt: string;
};

export const ChatAgentLabelMap = {
  [PromptAgentTypes.assistant]: 'Assistant',
  [PromptAgentTypes.upgrader]: 'Upgrade',
  [PromptAgentTypes.inspector]: 'Diagnose',
  [PromptAgentTypes.git]: 'Pull Request',
};
