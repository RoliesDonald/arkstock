// src/store/slices/workOrderSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  WorkOrder,
  WorkOrderFormValues,
  WoProgresStatus,
  WoPriorityType,
} from "@/types/workOrder";
import { v4 as uuidv4 } from "uuid";
import { workOrderData as initialWorkOrderData } from "@/data/sampleWorkOrderData";
import { resolve } from "path";
import { stat } from "fs";

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

export const fetchWorkOrders = createAsyncThunk(
  "workOrders/fetch",
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return initialWorkOrderData;
  }
);

export const createNewWorkOrder = createAsyncThunk(
  "workOrders/createNew",
  async (newWoData: WorkOrderFormValues, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newWorkOrder: WorkOrder = {
        ...(newWoData as WorkOrder),
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return newWorkOrder;

      // API Call
      // const response = await apiService.post('/api/work-orders', simulatedNewWorkOrder);
      // return response.data; // Kembalikan data WorkOrder yang dibuat dari backend
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal membuat Work Order");
    }
  }
);

// Work order bisa di update untuk penambahan part atau pekerjaan
export const updateWorkOrder = createAsyncThunk(
  "workOrders/updateWorkOrder",
  async (updateWorkOrderData: WorkOrderFormValues, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        ...(updateWorkOrderData as WorkOrder),
        updatedAt: new Date(),
      } as WorkOrder;
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal mengupdate Work Order");
    }
  }
);

export const deleteWorkOrder = createAsyncThunk(
  "workOrders/deleteWorkOrder",
  async (workOrderId: string, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return workOrderId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal menghapus Work Order");
    }
  }
);

const workOrderSlice = createSlice({
  name: "workOrders",
  initialState,
  reducers: {
    resetWorkOrderStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkOrders.pending, (state) => {
        state.status = "loading";
      })

      .addCase(
        fetchWorkOrders.fulfilled,
        (state, action: PayloadAction<WorkOrder[]>) => {
          state.status = "succeeded";
          state.workOrders = action.payload;
        }
      )
      .addCase(fetchWorkOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Gagal Memuat Data Work Order";
      })
      .addCase(createNewWorkOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        createNewWorkOrder.fulfilled,
        (state, action: PayloadAction<WorkOrder>) => {
          state.status = "succeeded";
          state.workOrders.unshift(action.payload);
        }
      )
      .addCase(createNewWorkOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal membuat Work Order";
      })
      .addCase(updateWorkOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateWorkOrder.fulfilled,
        (state, action: PayloadAction<WorkOrder>) => {
          state.status = "succeeded";
          const index = state.workOrders.findIndex(
            (v) => v.id === action.payload.id
          );
          if (index !== -1) {
            state.workOrders[index] = action.payload;
          }
        }
      )
      .addCase(updateWorkOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Gagal mengupdate Work Order";
      })

      .addCase(deleteWorkOrder.pending, (state) => {
        state.status = "loading";
      })

      .addCase(
        deleteWorkOrder.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.workOrders = state.workOrders.filter(
            (v) => v.id !== action.payload
          );
        }
      )
      .addCase(deleteWorkOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Gagal menghapus Work Order";
      });
  },
});

export const { resetWorkOrderStatus } = workOrderSlice.actions;
export default workOrderSlice.reducer;
