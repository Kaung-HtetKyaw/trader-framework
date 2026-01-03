import { CombinedUser, InvitedUser, User } from '@/types/user';
import { getReduxBaseQueryWithErrorHandling } from '@/lib/redux/baseQuery';
import { createApi, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { transformApiErrorResponse } from '@/lib/utils/error';

export const organizationApi = createApi({
  reducerPath: 'organizationApi',
  baseQuery: getReduxBaseQueryWithErrorHandling(),
  tagTypes: ['organizationMembers'],
  endpoints: builder => ({
    listOrganizationUser: builder.query<User[], void>({
      query: () => ({
        url: '/organization.user.list',
        method: 'POST',
        body: {},
      }),
      transformResponse: (response: { users: User[] }) => response.users,
      providesTags: ['organizationMembers'],
    }),

    deleteUser: builder.mutation<void, { userID: string }>({
      query: ({ userID }) => ({
        url: '/user.delete',
        method: 'POST',
        body: { userID },
      }),
      transformErrorResponse: (response: FetchBaseQueryError) =>
        transformApiErrorResponse(response, 'Failed to delete user'),
      invalidatesTags: ['organizationMembers'],
    }),

    getOrganization: builder.query<{ id: string; name: string }, void>({
      query: () => ({
        url: '/organization.info.find',
        method: 'POST',
        body: {},
      }),
    }),

    updateOrganization: builder.mutation<void, { name: string }>({
      query: ({ name }) => ({
        url: '/organization.info.update',
        method: 'POST',
        body: { name },
      }),
      transformErrorResponse: (response: FetchBaseQueryError) =>
        transformApiErrorResponse(response, 'Failed to update organization'),
    }),

    updateUserRole: builder.mutation<void, { userID: string; roleName: string }>({
      query: ({ userID, roleName }) => ({
        url: '/user.role.update',
        method: 'POST',
        body: { userID, roleName },
      }),
      transformErrorResponse: (response: FetchBaseQueryError) =>
        transformApiErrorResponse(response, 'Failed to update user role'),
      invalidatesTags: ['organizationMembers'],
    }),

    inviteUser: builder.mutation<void, { email: string; roleName: string }>({
      query: ({ email, roleName }) => ({
        url: '/user.invite.send',
        method: 'POST',
        body: { email, roleName },
      }),
      transformErrorResponse: (response: FetchBaseQueryError) =>
        transformApiErrorResponse(response, 'Failed to invite user'),
      invalidatesTags: ['organizationMembers'],
    }),

    listOrganizationUserAndInvited: builder.query<CombinedUser[], void>({
      query: () => ({
        url: '/organization.userAndInvited.list',
        method: 'POST',
        body: {},
      }),
      transformResponse: (response: { users: User[]; invitedUsers: InvitedUser[] }) => {
        return [...response.users, ...response.invitedUsers];
      },
      providesTags: ['organizationMembers'],
    }),

    deleteInviteUser: builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: '/user.invite.delete',
        method: 'POST',
        body: { email },
      }),
      transformErrorResponse: (response: FetchBaseQueryError) =>
        transformApiErrorResponse(response, 'Failed to delete invite user'),
      invalidatesTags: ['organizationMembers'],
    }),
  }),
});

export const {
  useListOrganizationUserQuery,
  useGetOrganizationQuery,
  useUpdateOrganizationMutation,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useInviteUserMutation,
  useListOrganizationUserAndInvitedQuery,
  useDeleteInviteUserMutation,
} = organizationApi;
