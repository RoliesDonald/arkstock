// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import tableSearchReducer from "./slices/tableSearchSlice";
import workOrdersReducer from "./slices/workOrderSlice";
import vehiclesReducer from "./slices/vehicleSlice";
import companiesReducer from "./slices/companySlice";
import warehousesReducer from "./slices/warehouseSlice";
import stockTransactionsReducer from "./slices/stockTransactionSlice";
import warehouseStockReducer from "./slices/warehouseStockSlice";
import unitsReducer from "./slices/unitSlice";
import sparePartsReducer from "./slices/sparePartSlice";
import userReducer from "./slices/userSlices";
import appReducer from "./slices/appSlice";
import tableSearchSlice from "./slices/tableSearchSlice";
import employeeReducer from "./slices/employeeSlice";
import serviceReducer from "./slices/serviceSlice";
import estimationReducer from "./slices/estimationSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    app: appReducer,
    // tableSearch: tableSearchReducer,
    workOrders: workOrdersReducer,
    vehicles: vehiclesReducer,
    companies: companiesReducer,
    warehouses: warehousesReducer,
    stockTransactions: stockTransactionsReducer,
    warehouseStock: warehouseStockReducer,
    units: unitsReducer,
    spareParts: sparePartsReducer,
    tableSearch: tableSearchSlice,
    employee: employeeReducer,
    services: serviceReducer,
    estimations: estimationReducer,
  },
  // Middleware untuk menangani objek Date agar tidak diserialisasi
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Abaikan path untuk properti Date di state Redux Anda
        ignoredPaths: [
          "spareParts.spareParts", // Untuk array spareParts
          "spareParts.spareParts.createdAt",
          "spareParts.spareParts.updatedAt",
          "warehouses.warehouses",
          "warehouses.warehouses.createdAt",
          "warehouses.warehouses.updatedAt",
          "stockTransactions.transactions",
          "stockTransactions.transactions.date",
          "stockTransactions.transactions.createdAt",
          "stockTransactions.transactions.updatedAt",
          "warehouseStock.stockItems",
          "warehouseStock.stockItems.createdAt",
          "warehouseStock.stockItems.updatedAt",
          "units.units",
          "units.units.createdAt",
          "units.units.updatedAt",
          "services.services", // Untuk array services
          "services.services.createdAt",
          "services.services.updatedAt",
          // Tambahkan path lain jika ada objek Date di state Redux Anda
          // Misalnya untuk Purchase Order jika sudah ada slice-nya
          // 'purchaseOrders.purchaseOrders',
          // 'purchaseOrders.purchaseOrders.date',
          // 'purchaseOrders.purchaseOrders.createdAt',
          // 'purchaseOrders.purchaseOrders.updatedAt',
        ],
        ignoredActionPaths: [
          "payload.createdAt",
          "payload.updatedAt",
          "meta.arg.createdAt",
          "meta.arg.updatedAt",
          "payload.date", // Untuk tanggal di transaksi/PO
          "meta.arg.date",
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
