import { useCallback, useMemo, useState } from 'react';
import ChatHistoryList from './ChatHistoryList';
import SearchRecentHistory from './SearchRecentHistory';
import NoRecentHistory from './NoRecentHistory';
import {
  useGetChatSessionListQuery,
  useLazyGetChatMessagesQuery,
  useLazyGetChatSessionListQuery,
} from '@/store/api/agenticKubeApi';
import useListSettings from '@/lib/hooks/useListSettings';
import { ListViews } from '@/types/list';
import { PaginationState } from '@/lib/hooks/useCursorPaginator';
import { ChatSession, UIChatMessage } from '@/types/chat/types';
import InfiniteScrollContainer from '../InfiniteScrollContainer';
import LoaderLine from '../svgs/LoaderLine';
import useAIActivePanelMenuListener from '@/lib/hooks/useAIActivePanelMenuListener';
import { AI_PANEL_TYPES, setActivePanelMenu } from '@/signals/drawers/ai-panel';
import { initChatMessages, setChatMessagesLoading, setChatSessionID } from '@/signals/chat/messages';
import { changeActiveAgent } from '@/signals/chat/agents';
import { CustomToast } from '../CustomToast';
import { PromptSenderTypes } from '@/types/chat';
import { changeSelectedNodes } from '@/signals/visualiation/misc';
import { usePathname, useParams } from 'next/navigation';
import { restoreTableSelectionsFromContexts } from '@/lib/chat/restoreTableSelections';
import { getUniqueId } from '@/lib/utils';

const RecentChatHistory = () => {
  const pathname = usePathname();
  const { id: clusterId } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState<PaginationState | undefined>(undefined);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  const { settings } = useListSettings(ListViews.CHAT_SESSION_LIST);
  const {
    data,
    isLoading: isLoadingInitialChatSessionList,
    refetch: refetchChatSessionList,
  } = useGetChatSessionListQuery(
    {
      pagination: {
        pageSize: settings.rowNumber,
      },
      sort: {
        createdAt: 'desc',
      },
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  //* NOTE: This is used to fetch all the chat sessions to get the total number of chat sessions
  //  This is not efficient but this is temporary workaround before BE provide filtering by title
  const { data: allChatSessionsData, isLoading: isLoadingAllChatSessionsData } = useGetChatSessionListQuery(
    {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const [getChatMessages] = useLazyGetChatMessagesQuery();

  useAIActivePanelMenuListener(activePanelMenu => {
    if (activePanelMenu === AI_PANEL_TYPES.history) {
      refetchChatSessionList();
    }
  });

  const [getMoreChatSessionList, { isLoading: isLoadingMoreChatSessionList }] = useLazyGetChatSessionListQuery();

  const nextCursor = useMemo(() => {
    if (typeof pagination === 'undefined') {
      return data?.pagination?.nextCursor;
    }

    return pagination?.nextCursor;
  }, [data?.pagination?.nextCursor, pagination]);

  const isLoading = useMemo(() => {
    return isLoadingInitialChatSessionList || isLoadingMoreChatSessionList;
  }, [isLoadingInitialChatSessionList, isLoadingMoreChatSessionList]);

  const enabledFetchNextPage = useMemo(() => {
    if (searchQuery) {
      return false;
    }

    return !!nextCursor && !isLoading;
  }, [nextCursor, isLoading, searchQuery]);

  const loadNextPage = useCallback(() => {
    if (!nextCursor || isLoading) {
      return;
    }

    getMoreChatSessionList({
      pagination: {
        nextCursor: nextCursor,
        pageSize: settings.rowNumber,
      },
      sort: {
        createdAt: 'desc',
      },
    }).then(res => {
      setChatSessions(prev => {
        const existingItems = new Set(prev.map(el => el.id));
        const newItems = (res.data?.items || []).filter(el => !existingItems.has(el.id));
        return [...prev, ...newItems];
      });
      setPagination({
        nextCursor: res.data?.pagination?.nextCursor || '',
        prevCursor: res.data?.pagination?.prevCursor || '',
        pageSize: settings.rowNumber,
      });
    });
  }, [getMoreChatSessionList, nextCursor, isLoading, settings]);

  const chatSessionList = useMemo(() => [...(data?.items || []), ...chatSessions], [data?.items, chatSessions]);

  const onSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const filteredChatHistory = useMemo(() => {
    // When search query is present, we display the data from allChatSessionsData
    if (searchQuery) {
      return allChatSessionsData?.items?.filter(el => el.title.toLowerCase().includes(searchQuery.toLowerCase())) || [];
    }

    return chatSessionList;
  }, [chatSessionList, searchQuery, allChatSessionsData]);

  const onSelectChatSession = useCallback(
    (chatSession: ChatSession) => {
      initChatMessages([], true);
      setChatSessionID(chatSession.id);
      setChatMessagesLoading(true);
      getChatMessages({
        filter: { chatSessionID: chatSession.id },
        sort: {
          createdAt: 'asc',
        },
      })
        .then(res => {
          const messages = res.data?.items || [];
          const uiChatMessages: UIChatMessage[] = messages.map(el => ({
            id: getUniqueId(),
            agent: el.agent,
            text: el.message,
            sender: el.sender,
            timestamp: el.createdAt,
          }));

          const latestHumanMessage = [...messages].reverse().find(el => el.sender === PromptSenderTypes.human);
          const lastSelectedObjects = Array.isArray(latestHumanMessage?.contexts?.selectedObjects)
            ? latestHumanMessage.contexts.selectedObjects
            : [];
          const isVisualizationPage = pathname?.includes('/visualization');

          if (isVisualizationPage) {
            changeSelectedNodes(lastSelectedObjects.map(el => el.id) || []);
          } else if (clusterId) {
            restoreTableSelectionsFromContexts(clusterId, lastSelectedObjects);
          }

          initChatMessages(uiChatMessages, true); // Mark as loaded from history

          // Set the last message's agent type as the active agent
          const activeAgent = uiChatMessages[uiChatMessages.length - 1]?.agent || '';
          changeActiveAgent(activeAgent);
          setActivePanelMenu(AI_PANEL_TYPES.assistant);
        })
        .catch(() => {
          CustomToast({
            type: 'error',
            message: 'Failed to load chat history',
          });
        })
        .finally(() => {
          setChatMessagesLoading(false);
        });
    },
    [getChatMessages, pathname]
  );

  return (
    <div className="relative h-full flex flex-col px-4">
      <div className="sticky top-0 z-10 bg-white pb-4">
        <SearchRecentHistory
          disabled={isLoadingAllChatSessionsData}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
      </div>

      {isLoadingInitialChatSessionList ? (
        <div className="w-full h-full flex items-center justify-center">
          <LoaderLine className="animate-spin" />
        </div>
      ) : filteredChatHistory.length > 0 ? (
        <InfiniteScrollContainer
          enabledFetchNextPage={enabledFetchNextPage}
          enabledInfiniteScroll={true}
          onFetchNextPage={loadNextPage}
          threshold={200}
          className="mb-4 scroll-container"
        >
          <div>
            <ChatHistoryList onClick={onSelectChatSession} chatSessions={filteredChatHistory} />
            {isLoadingMoreChatSessionList && (
              <div className="flex items-center justify-center my-4">
                <LoaderLine className="animate-spin" />
              </div>
            )}
          </div>
        </InfiniteScrollContainer>
      ) : (
        <NoRecentHistory />
      )}
    </div>
  );
};

export default RecentChatHistory;
