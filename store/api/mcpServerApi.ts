import config from '@/lib/config';
import { getReduxBaseQueryWithErrorHandling } from '@/lib/redux/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import { MCPServerListResponse, MCPServer } from '@/types/mcpServer';
import {
  RegisterMCPClientPayload,
  AddMCPClientPayload,
  RegisterMCPClientResponse,
  RemoveMCPClientPayload,
} from '@/types/agent/mcp';

export const mcpServerApi = createApi({
  reducerPath: 'mcpServerApi',
  baseQuery: getReduxBaseQueryWithErrorHandling(),
  tagTypes: ['mcpServers', 'agents'],
  endpoints: builder => ({
    getListMCPServers: builder.query<MCPServer[], void>({
      query: () => ({
        url: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/mcpserver.list`,
        method: 'POST',
        body: {},
        notifyOnError: true,
      }),
      transformResponse: (response: MCPServerListResponse) => response.items,
      providesTags: ['mcpServers'],
    }),
    registerMCPClient: builder.mutation<RegisterMCPClientResponse, RegisterMCPClientPayload<Record<string, unknown>>>({
      query: payload => ({
        url: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/mcpserver.client.register`,
        method: 'POST',
        body: payload,
        notifyOnError: true,
      }),
    }),
    addMCPClientToAgent: builder.mutation<void, AddMCPClientPayload>({
      query: payload => ({
        url: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/agent.custom.mcpclient.add`,
        method: 'POST',
        body: payload,
        notifyOnError: true,
      }),
      invalidatesTags: ['agents', 'mcpServers'],
    }),
    removeMCPClientFromAgent: builder.mutation<void, RemoveMCPClientPayload>({
      query: payload => ({
        url: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/agent.custom.mcpclient.remove`,
        method: 'POST',
        body: payload,
        notifyOnError: true,
      }),
      invalidatesTags: ['agents', 'mcpServers'],
    }),
  }),
});

export const {
  useGetListMCPServersQuery,
  useRegisterMCPClientMutation,
  useAddMCPClientToAgentMutation,
  useRemoveMCPClientFromAgentMutation,
} = mcpServerApi;
