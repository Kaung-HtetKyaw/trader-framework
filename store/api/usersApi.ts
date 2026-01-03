import { createApi, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { User, UserRole } from '@/types/user';
import { getReduxBaseQueryWithErrorHandling } from '@/lib/redux/baseQuery';
import { transformApiErrorResponse } from '@/lib/utils/error';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: getReduxBaseQueryWithErrorHandling(),
  tagTypes: ['User'],
  endpoints: builder => ({
    resetPassword: builder.mutation<{ success: boolean; message?: string }, { password: string }>({
      query: data => ({
        url: '/auth.userPassword.reset',
        method: 'POST',
        body: { newPassword: data.password },
      }),
      // TODO: properly type this after MVP
      transformResponse: (response: never) => {
        if (!response) {
          return {
            success: true,
            message: 'Your password has been reset successfully!',
          };
        }
        return response;
      },
      transformErrorResponse: (response: FetchBaseQueryError) =>
        transformApiErrorResponse(response, 'Failed to reset password'),
    }),
    updateUserInfo: builder.mutation<{ success: boolean; message?: string }, { firstName: string; lastName: string }>({
      query: data => ({
        url: '/user.personalInfo.update',
        method: 'POST',
        body: { firstName: data.firstName, lastName: data.lastName },
      }),
      // TODO: properly type this after MVP
      transformResponse: (response: never) => {
        if (!response) {
          return {
            success: true,
            message: 'The user info has been updated successfully!',
          };
        }

        return response;
      },
      invalidatesTags: ['User'],
      transformErrorResponse: (response: FetchBaseQueryError) =>
        transformApiErrorResponse(response, 'Failed to update user info'),
    }),
    getUserInfo: builder.query<User, void>({
      query: () => ({
        url: '/user.personalInfo.find',
        method: 'POST',
        body: {},
        notifyOnError: true,
      }),
      providesTags: ['User'],
    }),

    getUserRoles: builder.query<UserRole[], void>({
      query: () => ({
        url: '/role.list',
        method: 'POST',
        body: {},
        notifyOnError: true,
      }),
      providesTags: ['User'],
    }),
  }),
});

export const {
  useResetPasswordMutation,
  useUpdateUserInfoMutation,
  useLazyGetUserInfoQuery,
  useGetUserInfoQuery,
  useGetUserRolesQuery,
} = usersApi;
