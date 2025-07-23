import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  SparePartSuitableVehicle,
  RawSparePartSuitableVehicleApiResponse,
} from "@/types/sparePartSuitableVehicles";
import { api } from "@/lib/utils/api";

// Fungsi format data (tanpa tanggal karena tidak ada createdAt/updatedAt di model ini)
export const formatSparePartSuitableVehicleData = (
  rawSrsv: RawSparePartSuitableVehicleApiResponse
): SparePartSuitableVehicle => {
  return {
    ...rawSrsv,
    // Relasi akan di-map jika disertakan dalam respons API
    sparePart: rawSrsv.sparePart
      ? {
          id: rawSrsv.sparePart.id,
          partNumber: rawSrsv.sparePart.partNumber,
          partName: rawSrsv.sparePart.partName,
          unit: rawSrsv.sparePart.unit,
        }
      : undefined,
  };
};

interface SparePartSuitableVehicleState {
  sparePartSuitableVehicles: SparePartSuitableVehicle[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SparePartSuitableVehicleState = {
  sparePartSuitableVehicles: [],
  status: "idle",
  error: null,
};

export const fetchSparePartSuitableVehicles = createAsyncThunk(
  "sparePartSuitableVehicles/fetchSparePartSuitableVehicles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawSparePartSuitableVehicleApiResponse[]>(
        "http://localhost:3000/api/spare-part-suitable-vehicles"
      );
      return response.map(formatSparePartSuitableVehicleData);
    } catch (error: any) {
      console.error("Error fetching spare part suitable vehicles:", error);
      return rejectWithValue(error.message || "Gagal memuat daftar Kendaraan yang Cocok untuk Spare Part.");
    }
  }
);

const sparePartSuitableVehicleSlice = createSlice({
  name: "sparePartSuitableVehicles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSparePartSuitableVehicles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchSparePartSuitableVehicles.fulfilled,
        (state, action: PayloadAction<SparePartSuitableVehicle[]>) => {
          state.status = "succeeded";
          state.sparePartSuitableVehicles = action.payload;
        }
      )
      .addCase(fetchSparePartSuitableVehicles.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Gagal memuat daftar Kendaraan yang Cocok untuk Spare Part.";
      });
  },
});

export const {} = sparePartSuitableVehicleSlice.actions;
export default sparePartSuitableVehicleSlice.reducer;
