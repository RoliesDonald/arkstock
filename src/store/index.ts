import { configureStore } from "@reduxjs/toolkit";
import tableSearchReducer from "./slices/tableSearchSlice";
import sparePartReducer from "./slices/sparePartSlice"; // Import slice yang baru
import unitReducer from "./slices/unitSlice"; // Pastikan unitSlice juga diimpor jika ada
import companyReducer from "./slices/companySlice";

export const store = configureStore({
  reducer: {
    tableSearch: tableSearchReducer,
    spareParts: sparePartReducer, // Tambahkan slice sparePart di sini
    units: unitReducer, // Tambahkan slice unit di sini
    companies: companyReducer,
  },
  // Middleware untuk menangani objek Date agar tidak diserialisasi
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Abaikan path untuk properti Date di spareParts
        ignoredPaths: [
          "spareParts.spareParts",
          "spareParts.spareParts.createdAt",
          "spareParts.spareParts.updatedAt",
          "purchaseOrders.purchaseOrders", // Jika Anda memiliki purchaseOrderSlice
          // Tambahkan path lain jika ada objek Date di state Redux Anda
        ],
        ignoredActionPaths: [
          "payload.createdAt",
          "payload.updatedAt",
          "meta.arg.createdAt",
          "meta.arg.updatedAt",
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
