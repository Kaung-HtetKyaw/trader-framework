import { omit } from 'lodash';
import type { PromptNodeContext } from '@/types/chat';
import type {
  UpgradePlanAgentRequest,
  SelectedDeprecatedAPIItem,
  SelectedAddonCompatibilityItem,
  SelectedAddonMutualIncompatibilityItem,
} from '@/types/upgradePlan';

// Re-export the agent request type as UpgradePlanChatContext for backward compatibility
export type UpgradePlanChatContext = UpgradePlanAgentRequest;

export const buildUpgradePlanChatContext = (
  chatSessionID: string,
  userText: string,
  selectedObjects: PromptNodeContext[],
  selectedDeprecatedAPIs?: SelectedDeprecatedAPIItem[],
  selectedAddonCompatibilities?: SelectedAddonCompatibilityItem[],
  selectedMutualIncompatibilities?: SelectedAddonMutualIncompatibilityItem[]
): UpgradePlanChatContext => {
  return {
    chatSessionID,
    input: userText,
    selectedObjects,
    ...(selectedDeprecatedAPIs?.length && {
      selectedDeprecatedAPIs: selectedDeprecatedAPIs.map(item => omit(item, 'selectionId'))
    }),
    ...(selectedAddonCompatibilities?.length && {
      selectedUpgradeableComponent: selectedAddonCompatibilities.map(item => omit(item, 'selectionId'))
    }),
    ...(selectedMutualIncompatibilities?.length && {
      selectedMutualIncompatibilities: selectedMutualIncompatibilities.map(item => omit(item, 'selectionId'))
    }),
  };
};
