import { DeprecatedAPIDetail, MatchedComponent } from './api';
import { PromptNodeContext } from '@/types/chat';

// Agent Payload Types
export interface AgentDeprecatedAPIItem extends DeprecatedAPIDetail {
  clusterID: string;
}

export interface AgentAddonCompatibilityItem extends Omit<MatchedComponent, 'mutualInCompatibles'> {
  clusterID: string;
}

export interface AgentMutualIncompatibilityItem {
  name: string;
  mutuallyIncompatibleComponent: string;
  currentVersion: string;
  minMutualVersion: string;
  maxMutualVersion: string;
  clusterID: string;
}

// Chat Context for Upgrade Agent
export interface UpgradePlanAgentRequest {
  chatSessionID: string;
  input: string;
  selectedObjects: PromptNodeContext[];
  selectedDeprecatedAPIs?: AgentDeprecatedAPIItem[];
  selectedAddonCompatibilities?: AgentAddonCompatibilityItem[];
  selectedMutualIncompatibilities?: AgentMutualIncompatibilityItem[];
}
