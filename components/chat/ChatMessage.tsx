'use client';
import React, { memo, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { Suggestion, UIChatMessage } from '../../types/chat/types';
import MarkdownOutput from './MarkdownOutput';
import IssueCard from '../AgentPanel/Diagnose/IssueCard';
import PullRequestCard from '../AgentPanel/PullRequest/PullRequestCard';
import UpgradePlanCard from '../AgentPanel/Upgrade/UpgradePlanCard';
import ChatButton from '../AgentPanel/ChatButton';
import { parseSuggestionObject } from './ChatMessages';
import { format, isToday } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface ChatMessageProps {
  message: UIChatMessage;
  messageId: string;
  index: number;
  isLastMessage: boolean;
  totalHeight: number;
  isButtonClicked: boolean;
  onIssueCardRef: (element: HTMLDivElement | null) => void;
  onButtonClick: (type: 'troubleshoot' | 'pullRequest' | 'upgradePlan', parsedSuggestion: Suggestion, messageId: string) => void;
}

const ChatMessage = memo(
  ({
    message: msg,
    messageId,
    index,
    isLastMessage,
    totalHeight,
    isButtonClicked,
    onIssueCardRef,
    onButtonClick,
  }: ChatMessageProps) => {
    const isThinking = useMemo(
      () => msg.sender !== 'human' && msg.streaming && !msg.text?.length,
      [msg.sender, msg.streaming, msg.text?.length]
    );
    const parsedSuggestion = useMemo(() => parseSuggestionObject(msg.suggestion), [msg.suggestion]);

    // Show skeleton when:
    // 1. Message is from AI and still streaming (button will appear soon)
    // 2. Message has suggestion data but it failed to parse
    const showButtonSkeleton = useMemo(() => {
      return msg.sender !== 'human' && (
        msg.streaming || // streaming - button might appear
        (!!msg.suggestion && !parsedSuggestion) // has suggestion but failed to parse
      );
    }, [msg.sender, msg.streaming, msg.suggestion, parsedSuggestion]);
    if (msg.issue) {
      return (
        <IssueCard
          key={index}
          title={msg.issue?.title}
          description={msg.issue?.description}
          onRefChange={onIssueCardRef}
        />
      );
    }

    if (msg.pullRequest) {
      return <PullRequestCard key={index} title={msg.pullRequest?.title} description={msg.pullRequest?.description} />;
    }

    if (msg.upgradePlan) {
      return <UpgradePlanCard key={index} title={msg.upgradePlan?.title} description={msg.upgradePlan?.description} />;
    }

    return (
      <div
        className={`max-w-[80%] break-words justify-start
        ${msg.sender === 'human' ? 'self-end' : 'self-start'}
      `}
        style={msg.sender !== 'human' && isLastMessage ? { minHeight: `calc(100vh - ${totalHeight}px)` } : undefined}
      >
        {isThinking ? (
          <div className="flex items-center space-x-2" aria-live="polite">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Thinking...</span>
          </div>
        ) : msg.sender !== 'human' ? (
          <div className="text-sm px-4 py-2 rounded-lg bg-gray-100 text-gray-800">
            <MarkdownOutput content={msg.text || ''} />

            {showButtonSkeleton && (
              <div className="my-4 space-y-2">
                <Skeleton className="h-2 w-1/4 bg-gray-300" />
                <Skeleton className="h-2 w-1/4 bg-gray-300" />
              </div>
            )}

            {!showButtonSkeleton && parsedSuggestion?.action_name === 'create_issue_button' && (
              <div className="my-4">
                <ChatButton
                  title="Troubleshoot"
                  onClick={() => onButtonClick('troubleshoot', parsedSuggestion, messageId)}
                  disabled={isButtonClicked}
                />
              </div>
            )}
            {!showButtonSkeleton && parsedSuggestion?.action_name === 'create_pull_request_button' && (
              <div className="my-4">
                <ChatButton
                  title="Create Pull Request"
                  onClick={() => onButtonClick('pullRequest', parsedSuggestion, messageId)}
                  disabled={isButtonClicked}
                />
              </div>
            )}
            {!showButtonSkeleton && parsedSuggestion?.action_name === 'upgrade_plan_button' && (
              <div className="my-4">
                <ChatButton
                  title="Upgrade Plan"
                  onClick={() => onButtonClick('upgradePlan', parsedSuggestion, messageId)}
                  disabled={isButtonClicked}
                />
              </div>
            )}
            {msg.timestamp && (
              <div className="text-xs text-gray-500 mt-1">
                {isToday(new Date(msg.timestamp))
                  ? format(new Date(msg.timestamp), 'h:mm a')
                  : format(new Date(msg.timestamp), 'MMM d, yyyy • h:mm a')}
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm px-4 py-2 rounded-lg bg-gray-100 text-gray-800">
            {msg.text || 'Empty message'}
            {msg.timestamp && (
              <div className="text-xs text-gray-500 mt-1">
                {isToday(new Date(msg.timestamp))
                  ? format(new Date(msg.timestamp), 'h:mm a')
                  : format(new Date(msg.timestamp), 'MMM d, yyyy • h:mm a')}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
