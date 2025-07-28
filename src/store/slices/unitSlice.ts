// src/store/slices/unitSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Unit, RawUnitApiResponse } from "@/types/unit";
import { api } from "@/lib/utils/api";
import { UnitType, UnitCategory } from "@prisma/client";

export const formatUnitDates = (rawUnit: RawUnitApiResponse): Unit => {
  return {
    ...rawUnit,
    createdAt: new Date(rawUnit.createdAt),
    updatedAt: new Date(rawUnit.updatedAt),
    unitType: rawUnit.unitType as UnitType,
    unitCategory: rawUnit.unitCategory as UnitCategory,
  };
};

interface UnitState {
  units: Unit[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UnitState = {
  units: [],
  status: "idle",
  error: null,
};

export const fetchUnits = createAsyncThunk("units/fetchUnits", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<RawUnitApiResponse[]>("http://localhost:3000/api/units");
    return response.map(formatUnitDates);
  } catch (error: any) {
    console.error("Error fetching units:", error);
    return rejectWithValue(error.message || "Gagal memuat daftar unit.");
  }
});

const unitSlice = createSlice({
  name: "units",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUnits.fulfilled, (state, action: PayloadAction<Unit[]>) => {
        state.status = "succeeded";
        state.units = action.payload;
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar unit.";
      });
  },
});

export const {} = unitSlice.actions;
export default unitSlice.reducer;
