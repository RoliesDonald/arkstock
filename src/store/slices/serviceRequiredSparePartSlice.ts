import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ServiceRequiredSparePart,
  RawServiceRequiredSparePartApiResponse,
} from "@/types/serviceRequiredSpareParts";
import { api } from "@/lib/utils/api";

export const formatServiceRequiredSparePartDates = (
  rawSrsp: RawServiceRequiredSparePartApiResponse
): ServiceRequiredSparePart => {
  return {
    ...rawSrsp,
    createdAt: new Date(rawSrsp.createdAt),
    updatedAt: new Date(rawSrsp.updatedAt),
    // Relasi akan di-map jika disertakan dalam respons API
    service: rawSrsp.service
      ? {
          id: rawSrsp.service.id,
          name: rawSrsp.service.name,
        }
      : undefined,
    sparePart: rawSrsp.sparePart
      ? {
          id: rawSrsp.sparePart.id,
          partNumber: rawSrsp.sparePart.partNumber,
          partName: rawSrsp.sparePart.partName,
          unit: rawSrsp.sparePart.unit,
          price: rawSrsp.sparePart.price,
        }
      : undefined,
  };
};

interface ServiceRequiredSparePartState {
  serviceRequiredSpareParts: ServiceRequiredSparePart[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ServiceRequiredSparePartState = {
  serviceRequiredSpareParts: [],
  status: "idle",
  error: null,
};

export const fetchServiceRequiredSpareParts = createAsyncThunk(
  "serviceRequiredSpareParts/fetchServiceRequiredSpareParts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawServiceRequiredSparePartApiResponse[]>(
        "http://localhost:3000/api/service-required-spare-parts"
      );
      return response.map(formatServiceRequiredSparePartDates);
    } catch (error: any) {
      console.error("Error fetching service required spare parts:", error);
      return rejectWithValue(error.message || "Gagal memuat daftar Spare Part yang Dibutuhkan Jasa.");
    }
  }
);

const serviceRequiredSparePartSlice = createSlice({
  name: "serviceRequiredSpareParts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceRequiredSpareParts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchServiceRequiredSpareParts.fulfilled,
        (state, action: PayloadAction<ServiceRequiredSparePart[]>) => {
          state.status = "succeeded";
          state.serviceRequiredSpareParts = action.payload;
        }
      )
      .addCase(fetchServiceRequiredSpareParts.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar Spare Part yang Dibutuhkan Jasa.";
      });
  },
});

export const {} = serviceRequiredSparePartSlice.actions;
export default serviceRequiredSparePartSlice.reducer;
