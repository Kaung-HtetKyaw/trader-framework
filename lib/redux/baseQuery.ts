import { BaseQueryApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query';
import { getSession } from 'next-auth/react';
import config from '../config';
import { ErrorMessages, getDefaultErrorMessageByErrorCode, notifyErrorFromResponse } from '../utils/error';
import { CustomToast } from '@/components/CustomToast';
import { logoutAndRedirect } from '../authClient';
import { LOGOUT_KEY } from '@/components/AutoLogout';

// create a custom base query
export const getReduxBaseQuery = (baseUrl?: string) => {
  return fetchBaseQuery({
    baseUrl: baseUrl || `${config.NEXT_PUBLIC_API_BASE_URL}`,
    prepareHeaders: async headers => {
      const session = await getSession();
      const token = session?.user?.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      } else {
        localStorage.setItem(LOGOUT_KEY, Date.now().toString()); // to sync logout across tabs
        logoutAndRedirect();
      }

      return headers;
    },
  });
};

//  base query with default error handling
// * Use this for API slices that you want to have default error handling
export const getReduxBaseQueryWithErrorHandling =
  (baseUrl?: string) =>
  async (
    // * Injecting custom options into args since that is the only layer in redux we have access to for now
    // TODO: find out if there is a better way to do this
    args: string | (FetchArgs & { notifyOnError?: boolean; notifyOnSuccess?: boolean }),
    api: BaseQueryApi,
    extraOptions: object
  ) => {
    try {
      const result = await getReduxBaseQuery(baseUrl)(args, api, extraOptions);
      if ('error' in result) {
        if (typeof args === 'string') {
          return result;
        }

        if (args.notifyOnError) {
          const { error, notify } = notifyErrorFromResponse(result);
          console.error(error);
          notify(getDefaultErrorMessageByErrorCode(error?.errorCode || 'EKG50000'));
          return result;
        }
      }

      if (typeof args === 'string') {
        return result;
      }

      if (args.notifyOnSuccess) {
        CustomToast({
          type: 'success',
          message: 'Success',
        });
        return result;
      }

      return result;
    } catch (error) {
      // catch runtime error here
      CustomToast({
        type: 'error',
        message: 'Something went wrong',
      });
      console.error(error);
      return { error: ErrorMessages.INTERNAL_SERVER_ERROR };
    }
  };
