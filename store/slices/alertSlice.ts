import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { alerts as initialAlerts } from '@/constants/index';

interface Alert {
  title: string;
  content: string;
  isRead: boolean;
}
interface AlertsState {
  alerts: Alert[];
}

const initialState: AlertsState = {
  alerts: initialAlerts.map((a) => ({ ...a, isRead: false })),
};

export const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    markAlertAsRead: (state, action: PayloadAction<number>) => {
      if (state.alerts[action.payload]) {
        state.alerts[action.payload].isRead = true;
      }
    },
    resetAlerts: (state) => {
      state.alerts = initialAlerts.map((a) => ({ ...a, isRead: false }));
    },
  },
});

export const { markAlertAsRead, resetAlerts } = alertsSlice.actions;
export default alertsSlice.reducer;
