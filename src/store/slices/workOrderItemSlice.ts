import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkOrderItem, RawWorkOrderItemApiResponse } from "@/types/workOrderItems";
import { api } from "@/lib/utils/api";

export const formatWorkOrderItemDates = (rawWoi: RawWorkOrderItemApiResponse): WorkOrderItem => {
  return {
    ...rawWoi,
    createdAt: new Date(rawWoi.createdAt),
    updatedAt: new Date(rawWoi.updatedAt),
    // Relasi akan di-map jika disertakan dalam respons API
    workOrder: rawWoi.workOrder
      ? {
          id: rawWoi.workOrder.id,
          workOrderNumber: rawWoi.workOrder.workOrderNumber,
        }
      : undefined,
    sparePart: rawWoi.sparePart
      ? {
          id: rawWoi.sparePart.id,
          partNumber: rawWoi.sparePart.partNumber,
          partName: rawWoi.sparePart.partName,
          unit: rawWoi.sparePart.unit,
        }
      : undefined,
  };
};

interface WorkOrderItemState {
  workOrderItems: WorkOrderItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WorkOrderItemState = {
  workOrderItems: [],
  status: "idle",
  error: null,
};

export const fetchWorkOrderItems = createAsyncThunk(
  "workOrderItems/fetchWorkOrderItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawWorkOrderItemApiResponse[]>(
        "http://localhost:3000/api/work-order-items"
      );
      return response.map(formatWorkOrderItemDates);
    } catch (error: any) {
      console.error("Error fetching work order items:", error);
      return rejectWithValue(error.message || "Gagal memuat daftar Item Work Order.");
    }
  }
);

const workOrderItemSlice = createSlice({
  name: "workOrderItems",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkOrderItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWorkOrderItems.fulfilled, (state, action: PayloadAction<WorkOrderItem[]>) => {
        state.status = "succeeded";
        state.workOrderItems = action.payload;
      })
      .addCase(fetchWorkOrderItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar Item Work Order.";
      });
  },
});

export const {} = workOrderItemSlice.actions;
export default workOrderItemSlice.reducer;
