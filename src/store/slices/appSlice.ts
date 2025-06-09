// src/store/slices/appSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  globalLoading: boolean;
  notification: { message: string; type: "success" | "error" | "info" } | null;
}

const initialState: AppState = {
  // theme: "light",
  globalLoading: false,
  notification: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    showNotification: (
      state,
      action: PayloadAction<AppState["notification"]>
    ) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
  },
});

export const {
  // toggleTheme,
  setGlobalLoading,
  showNotification,
  clearNotification,
} = appSlice.actions;
export default appSlice.reducer;
