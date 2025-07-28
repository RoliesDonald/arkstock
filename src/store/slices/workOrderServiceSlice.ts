import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkOrderService, RawWorkOrderServiceApiResponse } from "@/types/workOrderServices";
import { api } from "@/lib/utils/api";

export const formatWorkOrderServiceDates = (rawWos: RawWorkOrderServiceApiResponse): WorkOrderService => {
  return {
    ...rawWos,
    createdAt: new Date(rawWos.createdAt),
    updatedAt: new Date(rawWos.updatedAt),
    // Relasi akan di-map jika disertakan dalam respons API
    workOrder: rawWos.workOrder
      ? {
          id: rawWos.workOrder.id,
          workOrderNumber: rawWos.workOrder.workOrderNumber,
        }
      : undefined,
    service: rawWos.service
      ? {
          id: rawWos.service.id,
          name: rawWos.service.name,
          price: rawWos.service.price,
        }
      : undefined,
  };
};

interface WorkOrderServiceState {
  workOrderServices: WorkOrderService[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WorkOrderServiceState = {
  workOrderServices: [],
  status: "idle",
  error: null,
};

export const fetchWorkOrderServices = createAsyncThunk(
  "workOrderServices/fetchWorkOrderServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawWorkOrderServiceApiResponse[]>(
        "http://localhost:3000/api/work-order-services"
      );
      return response.map(formatWorkOrderServiceDates);
    } catch (error: any) {
      console.error("Error fetching work order services:", error);
      return rejectWithValue(error.message || "Gagal memuat daftar Jasa Work Order.");
    }
  }
);

const workOrderServiceSlice = createSlice({
  name: "workOrderServices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkOrderServices.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWorkOrderServices.fulfilled, (state, action: PayloadAction<WorkOrderService[]>) => {
        state.status = "succeeded";
        state.workOrderServices = action.payload;
      })
      .addCase(fetchWorkOrderServices.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar Jasa Work Order.";
      });
  },
});

export const {} = workOrderServiceSlice.actions;
export default workOrderServiceSlice.reducer;
