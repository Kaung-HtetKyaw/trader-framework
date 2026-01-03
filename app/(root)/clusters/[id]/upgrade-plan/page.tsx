'use client';

import AddonCompatibilities from './AddonCompatibilities';
import AddonMutualInCompatibilities from './AddonMutualIncompatibilities';
import DeprecatedAPI from './DeprecatedAPI';
import UpgradePlanSkeleton from './UpgradePlanSkeleton';
import { DeprecatedAPIDetail, MatchedComponent, MutualIncompatibilityEntry } from '@/types/upgradePlan';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { compareVersions, getNextK8sMinorVersion } from '@/lib/utils';
import { useGetClusterDeprecatedAPIQuery, useGetInCompatibilitiesQuery } from '@/store/api/clusterApi';
import { BaseButton } from '@/components/ui/base-button';
import { getUpgradePlanSelectionCount } from '@/signals/upgradePlan/selection';
import { useSignals } from '@preact/signals-react/runtime';
import { openAIPanel, setActivePanelMenu, AI_PANEL_TYPES } from '@/signals/drawers/ai-panel';
import { changeActiveAgent } from '@/signals/chat/agents';
import { PromptAgentTypes } from '@/types/chat';
import UpgradePlanSelectedItemsCounter from '@/components/UpgradePlan/UpgradePlanSelectedItemsCounter';
import { useChatHandlers } from '@/lib/hooks/chat/useChatStream';
import { setChatMessagesLoading, resetChatMessages } from '@/signals/chat/messages';

const UpgradePlanPage = () => {
  useSignals();
  const { id: clusterId } = useParams<{ id: string }>();

  const selectedCount = getUpgradePlanSelectionCount();
  const { handleChatSubmit } = useChatHandlers();

  const { data: deprecations = [], isLoading: isDeprecationLoading } = useGetClusterDeprecatedAPIQuery(
    { clusterID: clusterId as string },
    { skip: !clusterId }
  );

  const matchingDeprecatedAPI: DeprecatedAPIDetail[] = useMemo(() => {
    return deprecations.filter(item => {
      const nextVersion = getNextK8sMinorVersion(item.clusterK8SVersion);
      return compareVersions(item.deprecatedIn, nextVersion) <= 0 && compareVersions(nextVersion, item.removedIn) < 0;
    });
  }, [deprecations]);

  const { data: resolverData, isLoading: isResolverLoading } = useGetInCompatibilitiesQuery(
    { clusterID: clusterId as string },
    { skip: !clusterId }
  );

  const isLoading = isDeprecationLoading || isResolverLoading;
  if (isLoading) return <UpgradePlanSkeleton />;

  const addonCompatibilities =
    resolverData?.matchedComponents?.filter((component: MatchedComponent) => component.nextCompatible === false) ?? [];

  const mutualIncompatibilities: MutualIncompatibilityEntry[] =
    resolverData?.matchedComponents?.flatMap((component: MatchedComponent) => {
      const entries = Object.entries(component.mutualInCompatibles || {});
      return entries.map(([target, details]) => ({
        source: component.name,
        target,
        details,
      }));
    }) ?? [];

  const handlePlanUpgrade = () => {
    // Reset chat messages to start a new session
    resetChatMessages();

    // Set loading state before opening panel to show loader instead of empty state
    setChatMessagesLoading(true);

    openAIPanel();
    setActivePanelMenu(AI_PANEL_TYPES.assistant);
    changeActiveAgent(PromptAgentTypes.upgrader);
    handleChatSubmit('Plan an upgrade for the current selection');
  };

  return (
    <div className="w-full flex flex-col px-4">
      <div className="flex justify-end items-center gap-3 mb-4">
        <UpgradePlanSelectedItemsCounter />
        <BaseButton variant="contained" disabled={selectedCount === 0} onClick={handlePlanUpgrade}>
          Plan Upgrade
        </BaseButton>
      </div>
      <div className="flex flex-col gap-6">
        <DeprecatedAPI matchingDeprecatedAPI={matchingDeprecatedAPI} />
        <AddonCompatibilities addonCompatibilities={addonCompatibilities} />
        <AddonMutualInCompatibilities mutualIncompatibilities={mutualIncompatibilities} />
      </div>
    </div>
  );
};

export default UpgradePlanPage;
