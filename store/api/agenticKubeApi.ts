import config from '@/lib/config';
import { getReduxBaseQueryWithErrorHandling } from '@/lib/redux/baseQuery';
import { ChatHistoryRequest, ChatHistoryResponse, ChatMessage, PromptRequest, PromptResponse } from '@/types/chat';
import { ChatMessageListRequest, ChatSessionListRequest } from '@/types/chat/list';
import { ChatSession } from '@/types/chat/types';
import { ListResponse } from '@/types/list';
import { createApi } from '@reduxjs/toolkit/query/react';

export const agenticKubeApiUrls = {
  sessionNew: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/chat.session.new`,
  sessionList: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/chat.session.list`,
  messageList: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/chat.message.list`,
  assistantPrompt: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/chat.assistant.prompt`,
  // TODO: add other agent types here
};

export const agenticKubeApi = createApi({
  reducerPath: 'agenticKubeApi',
  baseQuery: getReduxBaseQueryWithErrorHandling(),
  endpoints: builder => ({
    sendPrompt: builder.mutation<PromptResponse, PromptRequest>({
      query: ({ input }) => ({
        url: agenticKubeApiUrls.assistantPrompt,
        method: 'POST',
        body: { input },
      }),
    }),
    createChatSession: builder.mutation<{ chatSessionID: string }, void>({
      query: () => ({
        url: agenticKubeApiUrls.sessionNew,
        method: 'POST',
        body: {},
      }),
    }),
    getChatSessionList: builder.query<ListResponse<ChatSession>, ChatSessionListRequest>({
      query: params => ({
        url: agenticKubeApiUrls.sessionList,
        method: 'POST',
        body: params,
        notifyOnError: true,
      }),
    }),
    getChatMessages: builder.query<ListResponse<ChatMessage>, ChatMessageListRequest>({
      query: params => ({
        url: agenticKubeApiUrls.messageList,
        method: 'POST',
        body: params,
        notifyOnError: true,
      }),
    }),
    getChatHistory: builder.query<ChatHistoryResponse, ChatHistoryRequest>({
      query: params => ({
        url: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/chat.TroubleShootingHistory`,
        method: 'POST',
        body: params,
      }),
    }),
    getTroubleShootingHistory: builder.query<ChatHistoryResponse, ChatHistoryRequest>({
      query: params => ({
        url: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/chat.TroubleShootingHistory`,
        method: 'POST',
        body: params,
      }),
    }),
    getPullRequestHistory: builder.query<ChatHistoryResponse, ChatHistoryRequest>({
      query: params => ({
        url: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/chat.PullRequestHistory`,
        method: 'POST',
        body: params,
      }),
    }),
  }),
});

export const {
  useSendPromptMutation,
  useCreateChatSessionMutation,
  useGetChatHistoryQuery,
  useLazyGetChatHistoryQuery,
  useGetTroubleShootingHistoryQuery,
  useLazyGetTroubleShootingHistoryQuery,
  useGetPullRequestHistoryQuery,
  useLazyGetPullRequestHistoryQuery,
  useGetChatSessionListQuery,
  useLazyGetChatSessionListQuery,
  useGetChatMessagesQuery,
  useLazyGetChatMessagesQuery,
} = agenticKubeApi;
