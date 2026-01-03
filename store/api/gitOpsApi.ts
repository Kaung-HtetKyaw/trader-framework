import { createApi, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { BaseApiResponse } from '@/types';
import { getReduxBaseQueryWithErrorHandling } from '@/lib/redux/baseQuery';
import {
  AddAzureDevOpsPATData,
  AddAzureDevOpsRepoData,
  AddGithubPATData,
  AddGithubRepoData,
  AddPATResponse,
  DeletePATData,
  DeleteRepoData,
  GitProvider,
  UpdateAzureDevOpsPATData,
  UpdateGithubPATData,
  UpdateRepoData,
} from '@/types/gitOps';
import { transformApiErrorResponse } from '@/lib/utils/error';
import { ListResponse } from '@/types/list';

export const gitOpsApi = createApi({
  reducerPath: 'gitOpsApi',
  baseQuery: getReduxBaseQueryWithErrorHandling(),
  tagTypes: ['gitProvider', 'githubPAT', 'azureDevOpsPAT', 'githubRepos', 'azureDevOpsRepos'],

  endpoints: builder => ({
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    listGitProvider: builder.query<ListResponse<GitProvider>, {}>({
      query: () => ({
        url: '/gitProvider.list',
        method: 'POST',
        body: {},
        notifyOnError: true,
      }),
      providesTags: ['gitProvider'],
    }),
    addGithubPAT: builder.mutation<AddPATResponse, AddGithubPATData>({
      query: data => ({
        url: '/github.personalAccessToken.add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['gitProvider', 'githubPAT', 'azureDevOpsPAT', 'githubRepos', 'azureDevOpsRepos'],
      transformErrorResponse: (response: FetchBaseQueryError) =>
        transformApiErrorResponse(response, 'Failed to add Personal Access Token'),
    }),
    addAzureDevOpsPAT: builder.mutation<AddPATResponse, AddAzureDevOpsPATData>({
      query: data => ({
        url: '/azureDevOps.personalAccessToken.add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['gitProvider', 'azureDevOpsPAT', 'githubPAT', 'githubRepos', 'azureDevOpsRepos'],
      transformErrorResponse: (response: FetchBaseQueryError) =>
        transformApiErrorResponse(response, 'Failed to add Personal Access Token'),
    }),
    updateGithubPAT: builder.mutation<BaseApiResponse<null>, UpdateGithubPATData>({
      query: data => ({
        url: `/github.personalAccessToken.update`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['gitProvider', 'githubPAT', 'azureDevOpsPAT'],
      transformErrorResponse: (response: FetchBaseQueryError) =>
        transformApiErrorResponse(response, 'Failed to update Personal Access Token'),
    }),
    updateAzureDevOpsPAT: builder.mutation<BaseApiResponse<null>, UpdateAzureDevOpsPATData>({
      query: data => ({
        url: `/azureDevOps.personalAccessToken.update`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['gitProvider', 'azureDevOpsPAT', 'azureDevOpsRepos'],
      transformErrorResponse: (response: FetchBaseQueryError) =>
        transformApiErrorResponse(response, 'Failed to update Personal Access Token'),
    }),
    deletePAT: builder.mutation<BaseApiResponse<null>, DeletePATData>({
      query: ({ personalAccessTokenID }) => ({
        url: `/personalAccessToken.delete`,
        method: 'POST',
        body: { personalAccessTokenID },
      }),
      invalidatesTags: ['githubPAT', 'gitProvider'],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(gitOpsApi.util.invalidateTags(['githubRepos']));
        } catch {}
      },
      transformErrorResponse: (response: FetchBaseQueryError) =>
        transformApiErrorResponse(response, 'Failed to delete Personal Access Token'),
    }),

    addGithubRepo: builder.mutation<BaseApiResponse<null>, AddGithubRepoData>({
      query: data => ({
        url: '/github.repository.add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['githubRepos', 'gitProvider'],
      transformErrorResponse: (response: FetchBaseQueryError) =>
        transformApiErrorResponse(response, 'Failed to add repository'),
    }),

    addAzureRepo: builder.mutation<BaseApiResponse<null>, AddAzureDevOpsRepoData>({
      query: data => ({
        url: '/azureDevOps.repository.add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['azureDevOpsRepos', 'gitProvider'],
      transformErrorResponse: (response: FetchBaseQueryError) =>
        transformApiErrorResponse(response, 'Failed to add repository'),
    }),

    updateRepo: builder.mutation<BaseApiResponse<null>, UpdateRepoData>({
      query: data => ({
        url: `/repository.update`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['githubRepos', 'azureDevOpsRepos', 'gitProvider'],
      transformErrorResponse: (response: FetchBaseQueryError) =>
        transformApiErrorResponse(response, 'Failed to update repository'),
    }),

    deleteRepo: builder.mutation<BaseApiResponse<null>, DeleteRepoData>({
      query: data => ({
        url: `/repository.delete`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['githubRepos', 'azureDevOpsRepos', 'gitProvider'],
      transformErrorResponse: (response: FetchBaseQueryError) =>
        transformApiErrorResponse(response, 'Failed to delete repository'),
    }),
  }),
});

export const {
  useListGitProviderQuery,
  useAddGithubPATMutation,
  useAddAzureDevOpsPATMutation,
  useDeletePATMutation,
  useUpdateGithubPATMutation,
  useUpdateAzureDevOpsPATMutation,
  useAddGithubRepoMutation,
  useDeleteRepoMutation,
  useUpdateRepoMutation,
  useAddAzureRepoMutation,
} = gitOpsApi;
