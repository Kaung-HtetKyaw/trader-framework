import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppSettings } from '@/types/appSettings';
import config from '@/lib/config';
import { EnvironmentTypeEnum } from '@/types/environment';

const initialState: AppSettings = {
  environment: config.NEXT_PUBLIC_ENVIRONMENT,
};

const appSettingsSlice = createSlice({
  name: 'appSettings',
  initialState,
  reducers: {
    setEnvironment: (state, action: PayloadAction<EnvironmentTypeEnum>) => {
      state.environment = action.payload;
    },
  },
});

export const { setEnvironment } = appSettingsSlice.actions;
export default appSettingsSlice.reducer;
