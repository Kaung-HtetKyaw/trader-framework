import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { clusterApi } from './api/clusterApi';
import alertsReducer from './slices/alertSlice';
import { usersApi } from './api/usersApi';
import clusterReducer from './slices/clusterSlice';
import appSettingsReducer from './slices/appSettingsSlice';
import { miscApi } from './api/miscApi';
import { organizationApi } from './api/organizationApi';
import { agenticKubeApi } from './api/agenticKubeApi';
import { agentApi } from './api/agentApi';
import { gitOpsApi } from './api/gitOpsApi';
import { mcpServerApi } from './api/mcpServerApi';

const rootReducer = combineReducers({
  alerts: alertsReducer,
  cluster: clusterReducer,
  appSettings: appSettingsReducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [clusterApi.reducerPath]: clusterApi.reducer,
  [miscApi.reducerPath]: miscApi.reducer,
  [organizationApi.reducerPath]: organizationApi.reducer,
  [agenticKubeApi.reducerPath]: agenticKubeApi.reducer,
  [agentApi.reducerPath]: agentApi.reducer,
  [gitOpsApi.reducerPath]: gitOpsApi.reducer,
  [mcpServerApi.reducerPath]: mcpServerApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      usersApi.middleware,
      clusterApi.middleware,
      miscApi.middleware,
      organizationApi.middleware,
      agenticKubeApi.middleware,
      agentApi.middleware,
      gitOpsApi.middleware,
      mcpServerApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
