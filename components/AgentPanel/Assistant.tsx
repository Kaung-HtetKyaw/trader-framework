import React, { useState, useEffect, useMemo } from 'react';
import SelectedNodeCard from './SelectedNodeCard';
import SelectedTableItemsCard from './SelectedTableItemsCard';
import { useElementHeight } from '@/lib/hooks/useElementHeight';
import Chat from '@/components/chat';
import { useChatHandlers } from '@/lib/hooks/chat/useChatStream';
import ChatMessages from '@/components/chat/ChatMessages';
import UpgradeCard from './Upgrade/UpgradeCard';
import { chatAgent } from '@/signals/chat/agents';
import { chatMessages as chatMessagesSignal } from '@/signals/chat/messages';
import { useSignals } from '@preact/signals-react/runtime';
import { useParams, useRouter } from 'next/navigation';
import { PromptAgentTypes } from '@/types/chat';
import InfoCard from '@/components/InfoCard';
import { INFO_TYPE } from '@/constants';
import { useContextualSelection } from '@/lib/hooks/useContextualSelection';
import { GITOPS_INTEGRATION_SETTINGS_PATH } from '@/app/(root)/settings/urls';
import { useListGitProviderQuery } from '@/store/api/gitOpsApi';
import { GitProviders } from '@/types/gitOps';
import { AgentConfig } from '@/constants/agents';

export type AssistantProps = {
  builtInAgentConfig: AgentConfig[];
  customAgentConfig: AgentConfig[];
};

const Assistant = (props: AssistantProps) => {
  const { builtInAgentConfig, customAgentConfig } = props;
  useSignals();
  const router = useRouter();
  const { id: clusterID } = useParams<{ id: string }>();
  const activeAgent = chatAgent.value.activeAgent;
  const { isVisualizationPage } = useContextualSelection();

  const [isGitopsNotificationClosed, setIsGitopsNotificationClosed] = useState(false);
  const [hasSessionChatMessage, setHasSessionChatMessage] = useState(false);
  const [previousAgent, setPreviousAgent] = useState(activeAgent);

  const handleOpenSettings = () => {
    router.push(GITOPS_INTEGRATION_SETTINGS_PATH);
  };

  const { data, isLoading: isGitopsLoading } = useListGitProviderQuery({});

  const githubProvider = useMemo(
    () => data?.items?.find(provider => provider.name === GitProviders.github) || null,
    [data]
  );

  const azureDevOpsProvider = useMemo(
    () => data?.items?.find(provider => provider.name === GitProviders.azure) || null,
    [data]
  );

  // Show notification if credentials or repositories are missing
  const showGitopsNotification = useMemo(() => {
    if (isGitopsLoading) {
      return false;
    }

    const githubCredentialExists =
      !!githubProvider &&
      githubProvider.personalAccessTokens &&
      githubProvider.personalAccessTokens.length > 0 &&
      githubProvider.repositories &&
      githubProvider.repositories.length > 0;
    const azureDevOpsCredentialExists =
      !!azureDevOpsProvider &&
      azureDevOpsProvider.personalAccessTokens &&
      azureDevOpsProvider.personalAccessTokens.length > 0 &&
      azureDevOpsProvider.repositories &&
      azureDevOpsProvider.repositories.length > 0;
    const shouldShow = !githubCredentialExists && !azureDevOpsCredentialExists && !isGitopsNotificationClosed;

    return shouldShow;
  }, [githubProvider, azureDevOpsProvider, isGitopsNotificationClosed, isGitopsLoading]);

  const [selectedNodeCardHeight, setSelectedNodeCardElement] = useElementHeight();
  const [upgradeCardHeight, setUpgradeCardElement] = useElementHeight();
  const [chatInputHeight, setChatInputElement] = useElementHeight();
  const [gitopsNotificationHeight, setGitopsNotificationElement] = useElementHeight();

  const { chatMessages, isLoading, handleChatSubmit, handlePullRequest, handleTroubleshoot, handleUpgradePlan } =
    useChatHandlers();

  useEffect(() => {
    if (activeAgent !== previousAgent) {
      setPreviousAgent(activeAgent);
      setHasSessionChatMessage(false);
      setIsGitopsNotificationClosed(false);
    }
  }, [activeAgent, previousAgent]);

  const loadedFromHistory = chatMessagesSignal.value.loadedFromHistory;

  useEffect(() => {
    const hasMessages = chatMessages.length > 0;
    const isPRAgent = activeAgent === PromptAgentTypes.git;

    // For PR agent, keep notification visible even after messages
    if (isPRAgent) {
      return;
    }

    // When messages are loaded from history, keep notification open
    if (loadedFromHistory && hasMessages) {
      setHasSessionChatMessage(true);
      setIsGitopsNotificationClosed(false);
    }

    // Standard flow for new messages (not from history)
    if (!hasMessages) {
      setHasSessionChatMessage(false);
      setIsGitopsNotificationClosed(false);
    } else if (hasMessages && !hasSessionChatMessage) {
      setHasSessionChatMessage(true);
      setIsGitopsNotificationClosed(true);
    }
  }, [chatMessages.length, hasSessionChatMessage, activeAgent, loadedFromHistory]);

  return (
    <div className="w-full h-full flex flex-col px-3">
      <div className="sticky top-0 z-10 bg-background pt-1">
        <div className="flex flex-col gap-4 w-full overflow-visible">
          {isVisualizationPage ? (
            <SelectedNodeCard onRefChange={setSelectedNodeCardElement} />
          ) : (
            <SelectedTableItemsCard onRefChange={setSelectedNodeCardElement} />
          )}
          {activeAgent === PromptAgentTypes.upgrader && (
            <UpgradeCard
              description="Expand the upgrade plan to explore available Kubernetes version upgrades, see which APIs are deprecated, and review addon compatibility details before proceeding."
              upgradeOnNodeId={clusterID}
              onRefChange={setUpgradeCardElement}
              showSelectedOnly={!isVisualizationPage}
            />
          )}
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 pt-2">
        <ChatMessages
          messages={chatMessages}
          builtInAgentConfig={builtInAgentConfig}
          customAgentConfig={customAgentConfig}
          onTroubleshoot={handleTroubleshoot}
          onPullRequest={handlePullRequest}
          onUpgradePlan={handleUpgradePlan}
          onSubmit={handleChatSubmit}
          selectedNodeCardHeight={selectedNodeCardHeight}
          upgradeCardHeight={upgradeCardHeight}
          chatInputHeight={chatInputHeight}
          gitopsNotificationHeight={gitopsNotificationHeight}
        />
      </div>
      <div className="sticky bottom-0 bg-background pb-2 z-10">
        {showGitopsNotification && (
          <div className="mb-2" ref={setGitopsNotificationElement}>
            <InfoCard
              type={INFO_TYPE.info}
              title="GitOps integration not configured!"
              content="Configure your GitOps connection and IaC repositories to enable pull requests. You can still chat with the Assistant and other agents without connecting."
              onClose={activeAgent === PromptAgentTypes.git ? undefined : () => setIsGitopsNotificationClosed(true)}
              button={{
                label: 'Open Settings',
                onClick: handleOpenSettings,
              }}
            />
          </div>
        )}
        <div ref={setChatInputElement}>
          <Chat
            builtInAgentConfig={builtInAgentConfig}
            customAgentConfig={customAgentConfig}
            onSubmit={handleChatSubmit}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Assistant;
