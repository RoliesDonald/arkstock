import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkOrderSparePart, RawWorkOrderSparePartApiResponse } from "@/types/workOrderSpareParts";
import { api } from "@/lib/utils/api";

export const formatWorkOrderSparePartDates = (
  rawWosp: RawWorkOrderSparePartApiResponse
): WorkOrderSparePart => {
  return {
    ...rawWosp,
    createdAt: new Date(rawWosp.createdAt),
    updatedAt: new Date(rawWosp.updatedAt),
    // Relasi akan di-map jika disertakan dalam respons API
    workOrder: rawWosp.workOrder
      ? {
          id: rawWosp.workOrder.id,
          workOrderNumber: rawWosp.workOrder.workOrderNumber,
        }
      : undefined,
    sparePart: rawWosp.sparePart
      ? {
          id: rawWosp.sparePart.id,
          partNumber: rawWosp.sparePart.partNumber,
          partName: rawWosp.sparePart.partName,
          unit: rawWosp.sparePart.unit,
        }
      : undefined,
  };
};

interface WorkOrderSparePartState {
  workOrderSpareParts: WorkOrderSparePart[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WorkOrderSparePartState = {
  workOrderSpareParts: [],
  status: "idle",
  error: null,
};

export const fetchWorkOrderSpareParts = createAsyncThunk(
  "workOrderSpareParts/fetchWorkOrderSpareParts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawWorkOrderSparePartApiResponse[]>(
        "http://localhost:3000/api/work-order-spare-parts"
      );
      return response.map(formatWorkOrderSparePartDates);
    } catch (error: any) {
      console.error("Error fetching work order spare parts:", error);
      return rejectWithValue(error.message || "Gagal memuat daftar Spare Part Work Order.");
    }
  }
);

const workOrderSparePartSlice = createSlice({
  name: "workOrderSpareParts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkOrderSpareParts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWorkOrderSpareParts.fulfilled, (state, action: PayloadAction<WorkOrderSparePart[]>) => {
        state.status = "succeeded";
        state.workOrderSpareParts = action.payload;
      })
      .addCase(fetchWorkOrderSpareParts.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar Spare Part Work Order.";
      });
  },
});

export const {} = workOrderSparePartSlice.actions;
export default workOrderSparePartSlice.reducer;
