import config from '@/lib/config';
import { getReduxBaseQueryWithErrorHandling } from '@/lib/redux/baseQuery';
import { createApi, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import {
  AgentTypes,
  BuiltInAgentListResponse,
  CustomAgentListResponse,
  UpdateCustomInstructionData,
  UpdateAgentPayload,
  CreateAgentPayload,
  GeneratePromptData,
  GenerateRequestPayload,
  CustomAgentApiResponse,
  BuiltInAgentApiResponse,
  CreateCustomAgentResponse,
} from '@/types/agent';
import { BaseApiResponse } from '@/types';
import { transformApiErrorResponse } from '@/lib/utils/error';

export const agentApi = createApi({
  reducerPath: 'agentApi',
  baseQuery: getReduxBaseQueryWithErrorHandling(),
  tagTypes: ['agents'],
  endpoints: builder => ({
    getBuiltInAgents: builder.query<BuiltInAgentApiResponse[], void>({
      query: () => ({
        url: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/builtInAgent.list`,
        method: 'POST',
        body: {},
        notifyOnError: true,
      }),
      transformResponse: (response: BuiltInAgentListResponse) =>
        response.items.map(item => ({ ...item, type: AgentTypes.builtIn })),
      providesTags: ['agents'],
    }),
    getCustomAgents: builder.query<CustomAgentListResponse, void>({
      query: () => ({
        url: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/agent.custom.list`,
        method: 'POST',
        body: {},
        notifyOnError: true,
      }),
      providesTags: ['agents'],
    }),
    getCustomAgentDetails: builder.query<CustomAgentApiResponse, { id: string }>({
      query: ({ id }) => ({
        url: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/agent.custom.find`,
        method: 'POST',
        body: { agentID: id },
        notifyOnError: true,
      }),
      providesTags: ['agents'],
    }),
    updateCustomInstruction: builder.mutation<BaseApiResponse<null>, UpdateCustomInstructionData>({
      query: data => ({
        url: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/builtInAgent.instruction.custom`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['agents'],
      transformErrorResponse: (response: FetchBaseQueryError) =>
        transformApiErrorResponse(response, 'Failed to update custom instruction'),
    }),
    createAgent: builder.mutation<CreateCustomAgentResponse, CreateAgentPayload>({
      query: data => ({
        url: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/agent.custom.create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['agents'],
      transformErrorResponse: (response: FetchBaseQueryError) =>
        transformApiErrorResponse(response, 'Failed to create custom agent'),
    }),
    updateAgent: builder.mutation<null, UpdateAgentPayload>({
      query: data => ({
        url: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/agent.custom.update`,
        method: 'POST',
        body: data,
      }),
      transformErrorResponse: (response: FetchBaseQueryError) =>
        transformApiErrorResponse(response, 'Failed to update custom agent'),
    }),
    generatePrompt: builder.mutation<GeneratePromptData, GenerateRequestPayload>({
      query: data => ({
        url: `${config.NEXT_PUBLIC_BIFROST_API_BASE_URL}/agent.prompt.suggest`,
        method: 'POST',
        body: data,
      }),
      transformErrorResponse: (response: FetchBaseQueryError) =>
        transformApiErrorResponse(response, 'Failed to generate prompt'),
    }),
  }),
});

export const {
  useGetBuiltInAgentsQuery,
  useGetCustomAgentsQuery,
  useUpdateCustomInstructionMutation,
  useGetCustomAgentDetailsQuery,
  useCreateAgentMutation,
  useGeneratePromptMutation,
  useUpdateAgentMutation,
} = agentApi;
