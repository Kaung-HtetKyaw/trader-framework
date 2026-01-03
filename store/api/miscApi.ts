import { createApi } from '@reduxjs/toolkit/query/react';
import { getReduxBaseQueryWithErrorHandling } from '@/lib/redux/baseQuery';

// ✅ Create RTK Query API Slice
export const miscApi = createApi({
  reducerPath: 'miscApi',
  baseQuery: getReduxBaseQueryWithErrorHandling('/api'),

  endpoints: builder => ({
    getIntercomJwt: builder.query<{ token: string }, void>({
      query: () => ({
        url: '/intercom/jwt',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetIntercomJwtQuery, useLazyGetIntercomJwtQuery } = miscApi;
