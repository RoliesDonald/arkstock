// src/store/slices/workOrderSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  WorkOrder,
  WorkOrderFormValues,
  WoProgresStatus,
  WoPriorityType,
} from "@/types/workOrder";
import { v4 as uuidv4 } from "uuid";

interface WorkOrderState {
  workOrders: WorkOrder[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WorkOrderState = {
  workOrders: [], // ini diisi dari data dummy atau fetch awal
  status: "idle",
  error: null,
};

export const createNewWorkOrder = createAsyncThunk<
  WorkOrder, //ini adalah objek WorkOrder lengkap
  WorkOrderFormValues,
  { rejectValue: string }
>(
  "workOrders/createNew",
  async (newWoData: WorkOrderFormValues, { rejectWithValue }) => {
    try {
      const simulatedNewWorkOrder: WorkOrder = {
        id: uuidv4(), // Generate ID baru
        createdAt: new Date(),
        updatedAt: new Date(),
        ...newWoData, // Copy semua properti dari form
        // Tambahkan properti lain yang mungkin hilang dari WorkOrderFormValues
        // tetapi diperlukan oleh interface WorkOrder lengkap atau oleh backend
        // Misal:
        // woNumber: newWoData.woNumber || 'AUTO-GENERATED', // pastikan woNumber terisi
        // date: new Date(newWoData.date), // pastikan ini Date object
        // status: newWoData.progresStatus, // Map progresStatus ke status jika diperlukan
        // totalAmount: 0, // Mungkin dihitung di backend
      };

      // API Call
      // const response = await apiService.post('/api/work-orders', simulatedNewWorkOrder);
      // return response.data; // Kembalikan data WorkOrder yang dibuat dari backend

      console.log(
        "Simulating API call with new Work Order:",
        simulatedNewWorkOrder
      );
      return simulatedNewWorkOrder; // Mengembalikan objek WorkOrder yang disimulasikan
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal membuat Work Order");
    }
  }
);

const workOrderSlice = createSlice({
  name: "workOrders",
  initialState,
  reducers: {
    // Reducer sinkronus lainnya
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewWorkOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        createNewWorkOrder.fulfilled,
        (state, action: PayloadAction<WorkOrder>) => {
          state.status = "succeeded";
          // Tambahkan work order baru ke state jika sukses
          state.workOrders.push(action.payload);
        }
      )
      .addCase(createNewWorkOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Terjadi kesalahan tidak dikenal";
      });
  },
});

export default workOrderSlice.reducer;
