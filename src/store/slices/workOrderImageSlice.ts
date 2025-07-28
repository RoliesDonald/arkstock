import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkOrderImage, RawWorkOrderImageApiResponse } from "@/types/workOrderImages";
import { api } from "@/lib/utils/api";

export const formatWorkOrderImageDates = (rawWoi: RawWorkOrderImageApiResponse): WorkOrderImage => {
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
  };
};

interface WorkOrderImageState {
  workOrderImages: WorkOrderImage[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WorkOrderImageState = {
  workOrderImages: [],
  status: "idle",
  error: null,
};

export const fetchWorkOrderImages = createAsyncThunk(
  "workOrderImages/fetchWorkOrderImages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawWorkOrderImageApiResponse[]>(
        "http://localhost:3000/api/work-order-images"
      );
      return response.map(formatWorkOrderImageDates);
    } catch (error: any) {
      console.error("Error fetching work order images:", error);
      return rejectWithValue(error.message || "Gagal memuat daftar Gambar Work Order.");
    }
  }
);

const workOrderImageSlice = createSlice({
  name: "workOrderImages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkOrderImages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWorkOrderImages.fulfilled, (state, action: PayloadAction<WorkOrderImage[]>) => {
        state.status = "succeeded";
        state.workOrderImages = action.payload;
      })
      .addCase(fetchWorkOrderImages.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar Gambar Work Order.";
      });
  },
});

export const {} = workOrderImageSlice.actions;
export default workOrderImageSlice.reducer;
