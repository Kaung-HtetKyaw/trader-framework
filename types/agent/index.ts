import { PromptAgentTypeEnum } from '@/types/chat';
import type { AGENT_LABELS } from '@/constants/agents';
import { CustomAgentRegisteredMCPClient, RegisteredMCPClientPayload } from './mcp';

export const AgentTypes = { builtIn: 'builtIn', custom: 'custom' } as const;
export type AgentTypeEnum = keyof typeof AgentTypes;

// API Response Types
export interface BuiltInAgentApiResponse {
  organizationID: string;
  name: PromptAgentTypeEnum;
  description?: string;
  builtInInstruction: string;
  customInstruction: string;
  ownedBy: string;
  updatedBy: string | null;
  updatedAt: string;
}

export interface BuiltInAgentListResponse {
  items: BuiltInAgentApiResponse[];
}

export interface UpdateCustomInstructionData {
  agentName: string;
  instruction: string;
}

// Picks only the fields we need from API response and adds UI-specific fields
export interface Agent
  extends Pick<
    BuiltInAgentApiResponse,
    'name' | 'description' | 'builtInInstruction' | 'customInstruction' | 'updatedAt' | 'ownedBy'
  > {
  label: (typeof AGENT_LABELS)[keyof typeof AGENT_LABELS]; // Display label from constants
  icon: React.ComponentType<{ className?: string }>;
  hexColor: string;
}

export type CustomAgent = Omit<Agent, 'name' | 'builtInInstruction' | 'customInstruction'> & {
  id: string;
  name: string;
  mcpClientConfigs?: CustomAgentRegisteredMCPClient[];
  instruction?: string;
};

export type CustomAgentApiResponse = {
  agentID: string;
  name: string;
  organizationID: string;
  mcpClientConfigs: CustomAgentRegisteredMCPClient[];
  description?: string;
  instruction?: string;
  createdBy: string;
  updatedBy: string | null;
  updatedAt: string;
};

export interface CustomAgentListResponse {
  items: CustomAgentApiResponse[];
}

export type CreateCustomAgentResponse = {
  agentID: string;
};

export type CreateAgentPayload = {
  name: string;
  description?: string;
  instruction?: string;
  registeredMCPClients?: RegisteredMCPClientPayload[];
  // TODO: add icon, color, etc. after Custom Agent Avatar customization is confirmed
};

export type UpdateAgentPayload = {
  agentID: string;
  name?: string;
  description?: string;
  instruction?: string;
};

export type GenerateRequestPayload = {
  input: string;
};

export type GeneratePromptData = {
  output: string;
};
