'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, usePathname } from 'next/navigation';
import { postSSE } from '@/lib/chat/streamWithFetchEventSource';
import { useMarkdownStreamBuffer } from '@/lib/hooks/chat/useMarkdownStreamBuffer';
import {
  buildChatContext,
  buildTableSelectionContext,
  buildUpgradePlanChatContext,
  UpgradePlanChatContext,
} from '@/lib/chat';
import config from '@/lib/config';
import type { Suggestion } from '@/types/chat/types';
import { getUniqueId } from '@/lib/utils';
import { selectedNodesArray } from '@/signals/visualiation/misc';
import { chatAgent, changeActiveAgent } from '@/signals/chat/agents';
import { CustomToast } from '@/components/CustomToast';
import { nodes } from '@/signals/visualiation/nodes';
import {
  chatMessages as chatMessagesSignal,
  setChatMessages,
  updateLastChatMessage,
  filterChatMessages,
  setChatSessionID,
  setChatMessagesLoading,
} from '@/signals/chat/messages';
import { useSignals } from '@preact/signals-react/runtime';
import { useCreateChatSessionMutation } from '@/store/api/agenticKubeApi';
import { getAvailableObjects, getSelectedObjectIds } from '@/signals/tables/selection';
import { PromptAgentTypeEnum, PromptAgentTypes, PromptNodeContext } from '@/types/chat';
import { upgradePlanSelectionSignal } from '@/signals/upgradePlan/selection';

type BaseChatRequest = {
  chatSessionID: string;
  input: string;
  selectedObjects: PromptNodeContext[];
};

type ChatRequest = BaseChatRequest | UpgradePlanChatContext;

export const useChatHandlers = () => {
  useSignals();
  const { data: session } = useSession();
  const { id: clusterID } = useParams<{ id: string }>();
  const pathname = usePathname();
  const allNodes = nodes.value;
  const selectedNodes = selectedNodesArray.value;
  const { renderedContent, handleIncomingChunk, resetBuffers, finalize, flush } = useMarkdownStreamBuffer();

  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const [createChatSession] = useCreateChatSessionMutation();

  // Helper function to build context based on current page
  const buildContextInput = (userText: string) => {
    const isVisualizationPage = pathname?.includes('/visualization');

    if (isVisualizationPage) {
      return buildChatContext(clusterID, userText, selectedNodes, allNodes);
    } else {
      // Cluster info page - use table selections
      const availableObjects = getAvailableObjects();
      const selectedObjectIds = getSelectedObjectIds();
      const selectedObjects = availableObjects.filter(object => selectedObjectIds.includes(object.id));

      return buildTableSelectionContext(clusterID, userText, selectedObjects);
    }
  };

  const handleChatSubmit = async (userText: string, e?: React.FormEvent) => {
    e?.preventDefault();
    const currentAgent = chatAgent.value.activeAgent;
    if (!currentAgent) {
      return;
    }
    resetBuffers();

    const contextInput = buildContextInput(userText);

    if (!chatMessagesSignal.value.chatSessionID) {
      try {
        const result = await createChatSession().unwrap();
        setChatSessionID(result.chatSessionID);
      } catch (error) {
        console.error(error);
        CustomToast({ type: 'error', message: 'Failed to create chat session' });
        return;
      }
    }

    const endpointMap: Record<PromptAgentTypeEnum, string> = {
      [PromptAgentTypes.assistant]: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/chat.assistant.prompt`,
      [PromptAgentTypes.git]: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/chat.git.prompt`,
      [PromptAgentTypes.inspector]: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/chat.inspector.prompt`,
      [PromptAgentTypes.upgrader]: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/chat.upgrader.prompt`,
    };

    const endpoint = endpointMap[currentAgent];

    setChatMessages([
      ...chatMessagesSignal.value.messages,
      { id: getUniqueId(), agent: currentAgent, text: userText, sender: 'human', timestamp: new Date().toISOString() },
      { id: getUniqueId(), agent: currentAgent, text: '', sender: '', streaming: true, timestamp: new Date().toISOString() },
    ]);

    setIsLoading(true);

    abortRef.current?.abort();
    const ctl = new AbortController();
    abortRef.current = ctl;

    // Build request body based on agent type
    const chatSessionID = chatMessagesSignal.value.chatSessionID || '';
    let requestBody: ChatRequest;

    if (currentAgent === PromptAgentTypes.upgrader && clusterID) {
      // For upgrader agent, include upgrade plan selections
      const upgradePlanSelections = upgradePlanSelectionSignal.value;
      requestBody = buildUpgradePlanChatContext(
        chatSessionID,
        contextInput.input,
        contextInput.selectedObjects,
        upgradePlanSelections.deprecatedAPI,
        upgradePlanSelections.addonCompatibility,
        upgradePlanSelections.addonMutualIncompatibility
      );
    } else {
      // For other agents, use base request
      requestBody = {
        chatSessionID,
        input: contextInput.input,
        selectedObjects: contextInput.selectedObjects,
      };
    }

    await postSSE({
      url: endpoint,
      body: requestBody,
      token: session?.user?.accessToken,
      signal: ctl.signal,
      onChunk: handleIncomingChunk,
      onEvent: (event, payload) => {
        if (event === 'system.warning') {
          const message = payload?.m || payload?.message || 'System warning occurred';
          CustomToast({ type: 'error', message });
          return;
        }

        if (event !== 'llm.suggested') return;

        const last = chatMessagesSignal.value.messages[chatMessagesSignal.value.messages.length - 1];
        if (last?.sender !== 'human') {
          updateLastChatMessage({ suggestion: payload });
        }
      },
      onDone: () => {
        finalize();
        setIsLoading(false);
        setChatMessagesLoading(false);

        const last = chatMessagesSignal.value.messages[chatMessagesSignal.value.messages.length - 1];
        if (last?.sender !== 'human') {
          updateLastChatMessage({ streaming: false });
        }
      },
      onError: error => {
        flush();
        setIsLoading(false);
        setChatMessagesLoading(false);
        updateLastChatMessage({ text: 'API error occurred', streaming: false });
        CustomToast({ type: 'error', message: ` ${String(error)}` });
      },
    });
  };

  const handleTroubleshoot = useCallback(
    async (parsed: Suggestion) => {
      abortRef.current?.abort();
      setIsLoading(false);
      resetBuffers?.();

      const isAlreadyOnInspector = chatAgent.value.activeAgent === PromptAgentTypes.inspector;

      if (!isAlreadyOnInspector) {
        changeActiveAgent(PromptAgentTypes.inspector);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setIsLoading(true);

      setChatMessages([
        ...chatMessagesSignal.value.messages,
        {
          id: getUniqueId(),
          agent: PromptAgentTypes.inspector,
          sender: '',
          text: '',
          streaming: false,
          issue: { title: parsed.title, description: parsed.description || 'No description' },
        },
        {
          id: getUniqueId(),
          agent: PromptAgentTypes.inspector,
          sender: '',
          text: '',
          streaming: true,
          timestamp: new Date().toISOString(),
        },
      ]);

      const ctl = new AbortController();
      abortRef.current = ctl;
      const clickingTroubleshootPrompt = parsed.suggesting_prompt;

      if (!chatMessagesSignal.value.chatSessionID) {
        try {
          const result = await createChatSession().unwrap();
          setChatSessionID(result.chatSessionID);
        } catch (error) {
          console.error(error);
          CustomToast({ type: 'error', message: 'Failed to create chat session' });
          setIsLoading(false);
          return;
        }
      }

      const contextInput = buildContextInput(clickingTroubleshootPrompt);

      try {
        await postSSE({
          url: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/chat.inspector.system.prompt`,
          body: {
            chatSessionID: chatMessagesSignal.value.chatSessionID,
            input: clickingTroubleshootPrompt,
            selectedObjects: contextInput.selectedObjects,
          },
          token: session?.user?.accessToken,
          signal: ctl.signal,
          onChunk: handleIncomingChunk,
          onEvent: (event, payload) => {
            if (event === 'system.warning') {
              const message = payload?.m || payload?.message || 'System warning occurred';
              CustomToast({ type: 'error', message });
              return;
            }

            if (event !== 'llm.suggested') return;
            const last = chatMessagesSignal.value.messages[chatMessagesSignal.value.messages.length - 1];
            if (last?.sender !== 'human') {
              updateLastChatMessage({ suggestion: payload });
            }
          },
          onDone: () => {
            if (!ctl.signal.aborted) {
              finalize();
              setIsLoading(false);

              const last = chatMessagesSignal.value.messages[chatMessagesSignal.value.messages.length - 1];
              if (last?.sender !== 'human') {
                updateLastChatMessage({ streaming: false });
              }
            }
          },
          onError: error => {
            if (!ctl.signal.aborted) {
              flush();
              setIsLoading(false);
              updateLastChatMessage({ text: 'API error occurred', streaming: false });
              CustomToast({ type: 'error', message: ` ${String(error)}` });
            }
          },
        });
      } finally {
        setIsLoading(false);
      }
    },
    [session?.user?.accessToken, handleIncomingChunk, finalize, flush, resetBuffers, pathname, createChatSession]
  );

  const handlePullRequest = useCallback(
    async (parsed: Suggestion) => {
      abortRef.current?.abort();
      setIsLoading(false);
      resetBuffers?.();

      const isAlreadyOnGit = chatAgent.value.activeAgent === PromptAgentTypes.git;

      if (!isAlreadyOnGit) {
        changeActiveAgent(PromptAgentTypes.git);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setIsLoading(true);

      // Always add pull request card with title/description
      setChatMessages([
        ...chatMessagesSignal.value.messages,
        {
          id: getUniqueId(),
          agent: PromptAgentTypes.git,
          sender: '',
          text: '',
          streaming: false,
          pullRequest: { title: parsed.title, description: parsed.description || 'No description' },
        },
        {
          id: getUniqueId(),
          agent: PromptAgentTypes.git,
          sender: '',
          text: '',
          streaming: true,
          timestamp: new Date().toISOString(),
        },
      ]);

      const ctl = new AbortController();
      abortRef.current = ctl;
      const clickingPRButtonPrompt = parsed.suggesting_prompt;

      // Create session if needed
      if (!chatMessagesSignal.value.chatSessionID) {
        try {
          const result = await createChatSession().unwrap();
          setChatSessionID(result.chatSessionID);
        } catch (error) {
          console.error(error);
          CustomToast({ type: 'error', message: 'Failed to create chat session' });
          setIsLoading(false);
          return;
        }
      }

      const contextInput = buildContextInput(clickingPRButtonPrompt);

      try {
        await postSSE({
          url: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/chat.git.system.prompt`,
          body: {
            chatSessionID: chatMessagesSignal.value.chatSessionID,
            input: clickingPRButtonPrompt,
            selectedObjects: contextInput.selectedObjects,
          },
          token: session?.user?.accessToken,
          signal: ctl.signal,
          onChunk: handleIncomingChunk,
          onEvent: (event, payload) => {
            if (event === 'system.warning') {
              const message = payload?.m || payload?.message || 'System warning occurred';
              CustomToast({ type: 'error', message });
              return;
            }

            if (event !== 'llm.suggested') return;

            const last = chatMessagesSignal.value.messages[chatMessagesSignal.value.messages.length - 1];
            if (last?.sender !== 'human') {
              updateLastChatMessage({ suggestion: payload });
            }
          },
          onDone: () => {
            if (!ctl.signal.aborted) {
              finalize();
              setIsLoading(false);

              const last = chatMessagesSignal.value.messages[chatMessagesSignal.value.messages.length - 1];
              if (last?.sender !== 'human') {
                updateLastChatMessage({ streaming: false });
              }
            }
          },
          onError: error => {
            if (!ctl.signal.aborted) {
              flush();
              setIsLoading(false);
              updateLastChatMessage({ text: 'API error occurred', streaming: false });
              CustomToast({ type: 'error', message: ` ${String(error)}` });
            }
          },
        });
      } finally {
        setIsLoading(false);
      }
    },
    [session?.user?.accessToken, handleIncomingChunk, finalize, flush, resetBuffers, pathname, createChatSession]
  );

  const resetUpgradeTab = () => {
    abortRef.current?.abort();
    resetBuffers?.();
    filterChatMessages(m => m.agent !== PromptAgentTypes.upgrader);
    setIsLoading(false);
  };

  const handleUpgradePlan = useCallback(
    async (parsed?: Suggestion) => {
      const isVisualizationPage = pathname?.includes('/visualization');

      // If no suggestion, use previous toggle behavior
      if (!parsed) {
        // If already on upgrader agent, just stop streaming without deleting history
        if (chatAgent.value.activeAgent === PromptAgentTypes.upgrader) {
          abortRef.current?.abort();
          setIsLoading(false);
          resetBuffers?.();
          return;
        }

        // Only cleanup and switch if coming from a different agent
        abortRef.current?.abort();
        setIsLoading(false);
        filterChatMessages(m => m.agent !== PromptAgentTypes.upgrader);
        resetBuffers?.();
        changeActiveAgent(PromptAgentTypes.upgrader);
        return;
      }

      // If on visualization page with suggestion but NOT on upgrader agent, just toggle
      if (isVisualizationPage && chatAgent.value.activeAgent !== PromptAgentTypes.upgrader) {
        abortRef.current?.abort();
        setIsLoading(false);
        filterChatMessages(m => m.agent !== PromptAgentTypes.upgrader);
        resetBuffers?.();
        changeActiveAgent(PromptAgentTypes.upgrader);
        return;
      }

      // If on visualization page + already on upgrader agent, check if upgrade plan items are selected
      if (isVisualizationPage && chatAgent.value.activeAgent === PromptAgentTypes.upgrader) {
        const upgradePlanSelections = upgradePlanSelectionSignal.value;
        const hasSelections =
          upgradePlanSelections.deprecatedAPI.length > 0 ||
          upgradePlanSelections.addonCompatibility.length > 0 ||
          upgradePlanSelections.addonMutualIncompatibility.length > 0;

        if (!hasSelections) {
          CustomToast({ type: 'error', message: 'Please select items from the upgrade plan' });
          return;
        }
      }

      // New flow: With suggestion AND (on cluster info page OR on visualization page + already on upgrader agent with selections)
      abortRef.current?.abort();
      setIsLoading(false);
      resetBuffers?.();

      const isAlreadyOnUpgrader = chatAgent.value.activeAgent === PromptAgentTypes.upgrader;

      if (!isAlreadyOnUpgrader) {
        changeActiveAgent(PromptAgentTypes.upgrader);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setIsLoading(true);

      // Always add upgrade plan card with title/description
      setChatMessages([
        ...chatMessagesSignal.value.messages,
        {
          id: getUniqueId(),
          agent: PromptAgentTypes.upgrader,
          sender: '',
          text: '',
          streaming: false,
          upgradePlan: { title: parsed.title, description: parsed.description || 'No description' },
        },
        {
          id: getUniqueId(),
          agent: PromptAgentTypes.upgrader,
          sender: '',
          text: '',
          streaming: true,
          timestamp: new Date().toISOString(),
        },
      ]);

      const ctl = new AbortController();
      abortRef.current = ctl;
      const clickingUpgradePlanPrompt = parsed.suggesting_prompt;

      if (!chatMessagesSignal.value.chatSessionID) {
        try {
          const result = await createChatSession().unwrap();
          setChatSessionID(result.chatSessionID);
        } catch (error) {
          console.error(error);
          CustomToast({ type: 'error', message: 'Failed to create chat session' });
          setIsLoading(false);
          return;
        }
      }

      const contextInput = buildContextInput(clickingUpgradePlanPrompt);

      // Build request body with upgrade plan selections
      const upgradePlanSelections = upgradePlanSelectionSignal.value;
      const requestBody = buildUpgradePlanChatContext(
        chatMessagesSignal.value.chatSessionID || '',
        clickingUpgradePlanPrompt,
        contextInput.selectedObjects,
        upgradePlanSelections.deprecatedAPI,
        upgradePlanSelections.addonCompatibility,
        upgradePlanSelections.addonMutualIncompatibility
      );

      try {
        await postSSE({
          url: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/chat.upgrader.system.prompt`,
          body: requestBody,
          token: session?.user?.accessToken,
          signal: ctl.signal,
          onChunk: handleIncomingChunk,
          onEvent: (event, payload) => {
            if (event === 'system.warning') {
              const message = payload?.m || payload?.message || 'System warning occurred';
              CustomToast({ type: 'error', message });
              return;
            }

            if (event !== 'llm.suggested') return;
            const last = chatMessagesSignal.value.messages[chatMessagesSignal.value.messages.length - 1];
            if (last?.sender !== 'human') {
              updateLastChatMessage({ suggestion: payload });
            }
          },
          onDone: () => {
            if (!ctl.signal.aborted) {
              finalize();
              setIsLoading(false);

              const last = chatMessagesSignal.value.messages[chatMessagesSignal.value.messages.length - 1];
              if (last?.sender !== 'human') {
                updateLastChatMessage({ streaming: false });
              }
            }
          },
          onError: error => {
            if (!ctl.signal.aborted) {
              flush();
              setIsLoading(false);
              updateLastChatMessage({ text: 'API error occurred', streaming: false });
              CustomToast({ type: 'error', message: ` ${String(error)}` });
            }
          },
        });
      } finally {
        setIsLoading(false);
      }
    },
    [session?.user?.accessToken, handleIncomingChunk, finalize, flush, resetBuffers, pathname, createChatSession]
  );

  useEffect(() => {
    if (!renderedContent) return;

    const last = chatMessagesSignal.value.messages[chatMessagesSignal.value.messages.length - 1];
    if (last?.sender !== 'human') {
      updateLastChatMessage({ text: renderedContent });
    }
  }, [renderedContent]);

  useEffect(() => () => abortRef.current?.abort(), []);

  return {
    chatMessages: chatMessagesSignal.value.messages,
    isLoading,
    handleChatSubmit,
    handlePullRequest,
    handleTroubleshoot,
    handleUpgradePlan,
    resetUpgradeTab,
  };
};
