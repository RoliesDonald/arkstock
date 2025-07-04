import { Unit, UnitFormValues } from "@/types/unit";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { unitData as initialUnitData } from "@/data/sampleUnitData";
import { v4 as uuidv4 } from "uuid";

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

export const fetchUnits = createAsyncThunk("units/fetchUnits", async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  //API Beneran
  //   return await api.get('/units')
  return initialUnitData;
});

export const createUnit = createAsyncThunk(
  "units/createUnit",
  async (newUnitData: UnitFormValues, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newUnit: Unit = {
        ...newUnitData,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return newUnit;
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal membuat unit baru");
    }
  }
);

export const updateUnit = createAsyncThunk(
  "units/updateUnit",
  async (updatedUnitData: Unit, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      //   const response = await api.put(`/units/${updatedUnitData.id}`, updatedUnitData);
      //   return response.data;`)
      return { ...updatedUnitData, updatedAt: new Date() };
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal mengupdate unit");
    }
  }
);

export const deleteUnit = createAsyncThunk(
  "units/deleteUnit",
  async (unitId: string, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // await api.delete(`/units/${unitId}`)
      return unitId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal menghapus unit");
    }
  }
);

const unitSlice = createSlice({
  name: "units",
  initialState,
  reducers: {
    resetUnitStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch unit
      .addCase(fetchUnits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUnits.fulfilled, (state, action: PayloadAction<Unit[]>) => {
        state.status = "succeeded";
        state.units = action.payload;
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Gagal memuat daftar unit";
      })
      // Create Unit
      .addCase(createUnit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUnit.fulfilled, (state, action: PayloadAction<Unit>) => {
        state.status = "succeeded";
        state.units.unshift(action.payload); // Tambahkan unit baru ke depan array
      })
      .addCase(createUnit.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal membuat unit";
      })
      // Update Unit
      .addCase(updateUnit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateUnit.fulfilled,
        (state, action: PayloadAction<Unit | undefined>) => {
          state.status = "succeeded";
          if (action.payload) {
            const index = state.units.findIndex(
              (u) => u.id === action.payload!.id
            );
            if (index !== -1) {
              state.units[index] = action.payload;
            }
          }
        }
      )
      .addCase(updateUnit.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal mengupdate unit";
      })
      // Delete Unit
      .addCase(deleteUnit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUnit.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        state.units = state.units.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUnit.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal menghapus unit";
      });
  },
});

export const { resetUnitStatus } = unitSlice.actions;
export default unitSlice.reducer;
