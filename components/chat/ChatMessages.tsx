'use client';
import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { ArrowDown } from 'lucide-react';
import { Suggestion, UIChatMessage } from '../../types/chat/types';
import ChatMessage from './ChatMessage';
import { useElementHeight } from '../../lib/hooks/useElementHeight';
import { safeJsonParse, escapeControlCharacters } from '@/lib/utils/json';
import EmptyMessages from '../AgentPanel/EmptyMessages';
import SectionSeparator from '../SectionSeperator';
import { AgentConfig } from '@/constants/agents';

const BASE_HEIGHT = 270;

interface ChatMessagesProps {
  messages: UIChatMessage[];
  builtInAgentConfig: AgentConfig[];
  customAgentConfig: AgentConfig[];
  onTroubleshoot: (parsedSuggestion: Suggestion) => void;
  onPullRequest: (parsedSuggestion: Suggestion) => void;
  onUpgradePlan: (parsedSuggestion?: Suggestion) => void;
  onSubmit?: (message: string) => void;
  selectedNodeCardHeight?: number;
  upgradeCardHeight?: number;
  chatInputHeight?: number;
  gitopsNotificationHeight?: number;
}

export const parseSuggestionObject = (suggestion: unknown): Suggestion | null => {
  if (!suggestion) return null;
  try {
    if (typeof suggestion === 'string') {
      const cleanedString = escapeControlCharacters(suggestion);
      const result = safeJsonParse<Suggestion>(cleanedString);
      return typeof result === 'string' ? null : result;
    }
    if (typeof suggestion === 'object') return suggestion as Suggestion;
    return null;
  } catch (err) {
    console.error('Failed to parse suggestion object:', err);
    return null;
  }
};

const ChatMessages = ({
  messages,
  onTroubleshoot,
  onPullRequest,
  onUpgradePlan,
  onSubmit,
  builtInAgentConfig,
  customAgentConfig,
  selectedNodeCardHeight = 0,
  upgradeCardHeight = 0,
  chatInputHeight = 90,
  gitopsNotificationHeight = 0,
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [clickedButtonIds, setClickedButtonIds] = React.useState<Set<string>>(new Set());
  const [issueCardHeight, setIssueCardElement] = useElementHeight();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const heightCalculations = useMemo(
    () => ({
      baseHeight: BASE_HEIGHT,
      totalHeight: BASE_HEIGHT + selectedNodeCardHeight + gitopsNotificationHeight,
      totalHeightWithIssue: BASE_HEIGHT + selectedNodeCardHeight + issueCardHeight + gitopsNotificationHeight,
      totalHeightWithUpgradeCard: BASE_HEIGHT + selectedNodeCardHeight + upgradeCardHeight + gitopsNotificationHeight,
    }),
    [selectedNodeCardHeight, issueCardHeight, upgradeCardHeight, gitopsNotificationHeight]
  );

  const findScrollableParent = useCallback((element: HTMLElement): HTMLElement | null => {
    if (!element || element === document.body) return null;
    const { overflow, overflowY } = getComputedStyle(element);
    if (overflow === 'auto' || overflow === 'scroll' || overflowY === 'auto' || overflowY === 'scroll') {
      return element;
    }
    return findScrollableParent(element.parentElement!);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [messages.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollableContainer = findScrollableParent(container) || container;

    const checkScrollPosition = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollableContainer;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShowScrollButton(!isAtBottom);
    };

    // Check immediately on mount and when messages change
    checkScrollPosition();

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        checkScrollPosition();
      }, 100);
    };

    scrollableContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollableContainer.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [messages, findScrollableParent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClick = useCallback(
    (type: 'troubleshoot' | 'pullRequest' | 'upgradePlan', parsedSuggestion: Suggestion, messageId: string) => {
      if (type === 'troubleshoot') onTroubleshoot(parsedSuggestion);
      else if (type === 'pullRequest') onPullRequest(parsedSuggestion);
      else if (type === 'upgradePlan') onUpgradePlan(parsedSuggestion);
      setClickedButtonIds(prev => new Set(prev).add(messageId));
    },
    [onTroubleshoot, onPullRequest, onUpgradePlan]
  );

  const enrichedMessages = useMemo(() => {
    const isUpgradeTab = upgradeCardHeight > 0;

    return messages.map((msg, index) => {
      const isLastMessage = index === messages.length - 1;
      const isPrevIssueCard = index > 0 && messages[index - 1]?.issue;

      // Use message ID if available (UUID from backend), fallback to index-based for backwards compatibility
      const messageId = msg.id || `fallback-${index}`;
      const isButtonClicked = clickedButtonIds.has(messageId);

      let totalHeight = heightCalculations.totalHeight;
      if (isPrevIssueCard) {
        totalHeight = heightCalculations.totalHeightWithIssue;
      } else if (isUpgradeTab) {
        totalHeight = heightCalculations.totalHeightWithUpgradeCard;
      }

      return {
        msg,
        index,
        messageId,
        isLastMessage,
        totalHeight,
        isButtonClicked,
        key: `${messageId}-${msg.streaming}`,
      };
    });
  }, [messages, clickedButtonIds, upgradeCardHeight, heightCalculations]);

  if (messages.length === 0) {
    return <EmptyMessages onSubmit={onSubmit} />;
  }

  return (
    <div className="relative">
      <div ref={containerRef} className="min-h-full flex flex-col justify-end gap-2 w-full">
        {enrichedMessages.map(
          ({ msg, index, messageId, isLastMessage, totalHeight, isButtonClicked, key }, arrayIndex) => {
            const prevMsg = arrayIndex > 0 ? enrichedMessages[arrayIndex - 1].msg : null;
            const showDivider = prevMsg && prevMsg.agent !== msg.agent;

            return (
              <React.Fragment key={key}>
                {showDivider && (
                  <SectionSeparator
                    builtInAgentConfig={builtInAgentConfig}
                    customAgentConfig={customAgentConfig}
                    agentName={msg.agent}
                    labelColor="text-secondary-500"
                    separatorColor="bg-secondary-500"
                  />
                )}

                <ChatMessage
                  message={msg}
                  messageId={messageId}
                  index={index}
                  isLastMessage={isLastMessage}
                  totalHeight={totalHeight}
                  isButtonClicked={isButtonClicked}
                  onIssueCardRef={setIssueCardElement}
                  onButtonClick={handleClick}
                />
              </React.Fragment>
            );
          }
        )}
        <div ref={messagesEndRef} />
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          style={{
            bottom: `${chatInputHeight + gitopsNotificationHeight + 16}px`,
            transition: 'bottom 0.2s ease-out',
          }}
          className="fixed left-1/2 -translate-x-1/2 bg-secondary-400 hover:bg-secondary-500 text-white p-2 rounded-full shadow-2xl transition-colors z-[9999] flex items-center justify-center border-2 border-white"
          aria-label="Scroll to bottom"
        >
          <ArrowDown size={20} className="text-white font-bold" />
        </button>
      )}
    </div>
  );
};

export default ChatMessages;
