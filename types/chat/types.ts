import { PromptAgentTypeEnum, PromptSenderTypeEnum } from '.';

export interface Suggestion {
  action_name: 'create_issue_button' | 'create_pull_request_button' | 'upgrade_plan_button';
  title: string;
  description: string;
  detail?: string;
  suggesting_prompt: string;
}

// Represents a chat message in the UI with frontend-specific properties
export type UIChatMessage = {
  id?: string;
  agent: PromptAgentTypeEnum;
  sender: PromptSenderTypeEnum;
  text: string;
  streaming?: boolean;
  suggestion?: Suggestion;
  issue?: { title: string; description: string };
  pullRequest?: { title: string; description: string };
  upgradePlan?: { title: string; description: string };
  timestamp?: string;
};

export type ChatSession = {
  id: string;
  userAccountID: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
};
