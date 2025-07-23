// src/store/slices/workOrderSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkOrder, RawWorkOrderApiResponse } from "@/types/workOrder";
import { api } from "@/lib/utils/api";
import { WoProgresStatus, WoPriorityType } from "@prisma/client";

export const formatWorkOrderDates = (rawWorkOrder: RawWorkOrderApiResponse): WorkOrder => {
  return {
    ...rawWorkOrder,
    date: new Date(rawWorkOrder.date),
    schedule: rawWorkOrder.schedule ? new Date(rawWorkOrder.schedule) : null,
    createdAt: new Date(rawWorkOrder.createdAt),
    updatedAt: new Date(rawWorkOrder.updatedAt),
    progresStatus: rawWorkOrder.progresStatus as WoProgresStatus,
    priorityType: rawWorkOrder.priorityType as WoPriorityType,
    // Relasi akan di-map jika disertakan dalam respons API
    vehicle: rawWorkOrder.vehicle
      ? {
          id: rawWorkOrder.vehicle.id,
          licensePlate: rawWorkOrder.vehicle.licensePlate,
          vehicleMake: rawWorkOrder.vehicle.vehicleMake,
          model: rawWorkOrder.vehicle.model,
        }
      : undefined,
    customer: rawWorkOrder.customer
      ? {
          id: rawWorkOrder.customer.id,
          companyName: rawWorkOrder.customer.companyName,
        }
      : undefined,
    carUser: rawWorkOrder.carUser
      ? {
          id: rawWorkOrder.carUser.id,
          companyName: rawWorkOrder.carUser.companyName,
        }
      : undefined,
    vendor: rawWorkOrder.vendor
      ? {
          id: rawWorkOrder.vendor.id,
          companyName: rawWorkOrder.vendor.companyName,
        }
      : undefined,
    mechanic: rawWorkOrder.mechanic
      ? {
          id: rawWorkOrder.mechanic.id,
          name: rawWorkOrder.mechanic.name,
        }
      : undefined,
    driver: rawWorkOrder.driver
      ? {
          id: rawWorkOrder.driver.id,
          name: rawWorkOrder.driver.name,
        }
      : undefined,
    approvedBy: rawWorkOrder.approvedBy
      ? {
          id: rawWorkOrder.approvedBy.id,
          name: rawWorkOrder.approvedBy.name,
        }
      : undefined,
    requestedBy: rawWorkOrder.requestedBy
      ? {
          id: rawWorkOrder.requestedBy.id,
          name: rawWorkOrder.requestedBy.name,
        }
      : undefined,
    location: rawWorkOrder.location
      ? {
          id: rawWorkOrder.location.id,
          name: rawWorkOrder.location.name,
        }
      : undefined,
  };
};

interface WorkOrderState {
  workOrders: WorkOrder[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WorkOrderState = {
  workOrders: [],
  status: "idle",
  error: null,
};

export const fetchWorkOrders = createAsyncThunk(
  "workOrders/fetchWorkOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawWorkOrderApiResponse[]>("http://localhost:3000/api/work-orders");
      return response.map(formatWorkOrderDates);
    } catch (error: any) {
      console.error("Error fetching work orders:", error);
      return rejectWithValue(error.message || "Gagal memuat daftar Work Order.");
    }
  }
);

const workOrderSlice = createSlice({
  name: "workOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWorkOrders.fulfilled, (state, action: PayloadAction<WorkOrder[]>) => {
        state.status = "succeeded";
        state.workOrders = action.payload;
      })
      .addCase(fetchWorkOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar Work Order.";
      });
  },
});

export const {} = workOrderSlice.actions;
export default workOrderSlice.reducer;
