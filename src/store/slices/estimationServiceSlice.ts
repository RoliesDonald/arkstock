import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EstimationService, RawEstimationServiceApiResponse } from "@/types/estimationServices";
import { api } from "@/lib/utils/api";

export const formatEstimationServiceDates = (rawEs: RawEstimationServiceApiResponse): EstimationService => {
  return {
    ...rawEs,
    createdAt: new Date(rawEs.createdAt),
    updatedAt: new Date(rawEs.updatedAt),
    // Relasi akan di-map jika disertakan dalam respons API
    estimation: rawEs.estimation
      ? {
          id: rawEs.estimation.id,
          estimationNumber: rawEs.estimation.estimationNumber,
        }
      : undefined,
    service: rawEs.service
      ? {
          id: rawEs.service.id,
          name: rawEs.service.name,
          price: rawEs.service.price,
        }
      : undefined,
  };
};

interface EstimationServiceState {
  estimationServices: EstimationService[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: EstimationServiceState = {
  estimationServices: [],
  status: "idle",
  error: null,
};

export const fetchEstimationServices = createAsyncThunk(
  "estimationServices/fetchEstimationServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawEstimationServiceApiResponse[]>(
        "http://localhost:3000/api/estimation-services"
      );
      return response.map(formatEstimationServiceDates);
    } catch (error: any) {
      console.error("Error fetching estimation services:", error);
      return rejectWithValue(error.message || "Gagal memuat daftar Jasa Estimasi.");
    }
  }
);

const estimationServiceSlice = createSlice({
  name: "estimationServices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEstimationServices.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEstimationServices.fulfilled, (state, action: PayloadAction<EstimationService[]>) => {
        state.status = "succeeded";
        state.estimationServices = action.payload;
      })
      .addCase(fetchEstimationServices.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar Jasa Estimasi.";
      });
  },
});

export const {} = estimationServiceSlice.actions;
export default estimationServiceSlice.reducer;
