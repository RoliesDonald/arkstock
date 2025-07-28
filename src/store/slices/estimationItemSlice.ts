import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EstimationItem, RawEstimationItemApiResponse } from "@/types/estimationItems";
import { api } from "@/lib/utils/api";

export const formatEstimationItemDates = (rawEi: RawEstimationItemApiResponse): EstimationItem => {
  return {
    ...rawEi,
    createdAt: new Date(rawEi.createdAt),
    updatedAt: new Date(rawEi.updatedAt),
    // Relasi akan di-map jika disertakan dalam respons API
    estimation: rawEi.estimation
      ? {
          id: rawEi.estimation.id,
          estimationNumber: rawEi.estimation.estimationNumber,
        }
      : undefined,
    sparePart: rawEi.sparePart
      ? {
          id: rawEi.sparePart.id,
          partNumber: rawEi.sparePart.partNumber,
          partName: rawEi.sparePart.partName,
          unit: rawEi.sparePart.unit,
        }
      : undefined,
  };
};

interface EstimationItemState {
  estimationItems: EstimationItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: EstimationItemState = {
  estimationItems: [],
  status: "idle",
  error: null,
};

export const fetchEstimationItems = createAsyncThunk(
  "estimationItems/fetchEstimationItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawEstimationItemApiResponse[]>(
        "http://localhost:3000/api/estimation-items"
      );
      return response.map(formatEstimationItemDates);
    } catch (error: any) {
      console.error("Error fetching estimation items:", error);
      return rejectWithValue(error.message || "Gagal memuat daftar Item Estimasi.");
    }
  }
);

const estimationItemSlice = createSlice({
  name: "estimationItems",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEstimationItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEstimationItems.fulfilled, (state, action: PayloadAction<EstimationItem[]>) => {
        state.status = "succeeded";
        state.estimationItems = action.payload;
      })
      .addCase(fetchEstimationItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar Item Estimasi.";
      });
  },
});

export const {} = estimationItemSlice.actions;
export default estimationItemSlice.reducer;
