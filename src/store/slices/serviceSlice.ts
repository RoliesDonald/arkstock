import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Service, RawServiceApiResponse } from "@/types/services";
import { api } from "@/lib/utils/api";

export const formatServiceDates = (rawService: RawServiceApiResponse): Service => {
  return {
    ...rawService,
    createdAt: new Date(rawService.createdAt),
    updatedAt: new Date(rawService.updatedAt),
    // tasks sudah array of string, price sudah number
  };
};

interface ServiceState {
  services: Service[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  status: "idle",
  error: null,
};

export const fetchServices = createAsyncThunk("services/fetchServices", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<RawServiceApiResponse[]>("http://localhost:3000/api/services");
    return response.map(formatServiceDates);
  } catch (error: any) {
    console.error("Error fetching services:", error);
    return rejectWithValue(error.message || "Gagal memuat daftar jasa.");
  }
});

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchServices.fulfilled, (state, action: PayloadAction<Service[]>) => {
        state.status = "succeeded";
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar jasa.";
      });
  },
});

export const {} = serviceSlice.actions;
export default serviceSlice.reducer;
