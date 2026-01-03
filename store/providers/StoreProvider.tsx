'use client';

import { Provider } from 'react-redux';
import store from '../store';
import PostHogIdentity from '@/components/PostHogIdentity';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PostHogIdentity />
      {children}
    </Provider>
  );
}
