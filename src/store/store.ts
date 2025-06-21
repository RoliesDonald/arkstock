// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlices";
import appReducer from "./slices/appSlice"; // Untuk state aplikasi umum seperti tema, loading
import tableSearchSlice from "./slices/tableSearchSlice";
import workOrderReducer from "./slices/workOrderSlice";
import vehiclesReducer from "./slices/vehicleSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    app: appReducer,
    tableSearch: tableSearchSlice,
    workOrders: workOrderReducer,
    vehicles: vehiclesReducer,
  },
  // Anda bisa menambahkan middleware kustom atau konfigurasi lain di sini
  // devTools: process.env.NODE_ENV !== 'production', // DevTools diaktifkan di development
});

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {user: UserState, app: AppState}
// export type AppDispatch = typeof store.dispatch;

import type { EnhancedStore } from "@reduxjs/toolkit";

export type AppStore = EnhancedStore<ReturnType<typeof store.getState>>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
