import { Vehicle, VehicleFormValues } from "@/types/vehicle";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { vehicleData as initialVehicleData } from "@/data/sampleVehicleData";
import { v4 as uuidv4 } from "uuid";

interface VehicleState {
  vehicles: Vehicle[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: VehicleState = {
  vehicles: initialVehicleData,
  status: "idle",
  error: null,
};

export const fetchVehicles = createAsyncThunk(
  "vehicles/fetchVehicles",
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return initialVehicleData;
  }
);

// async thunk untuk menambahkan kendaraan
export const createVehicle = createAsyncThunk(
  "vehicles/createVehicle",
  async (newVehicleData: VehicleFormValues, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newVehicle: Vehicle = {
        ...(newVehicleData as Vehicle),
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return newVehicle;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Gagal input data kendaraan baru"
      );
    }
  }
);

// async thunk untuk mengupdate kendaraan
export const updateVehicle = createAsyncThunk(
  "vehicles/updateVehicle",
  async (updateVehicleData: VehicleFormValues, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        ...(updateVehicleData as Vehicle),
        updatedAt: new Date(),
      } as Vehicle;
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal update data kendaraan");
    }
  }
);

// async thunk untuk menghapus kendaraan

export const deleteVehicle = createAsyncThunk(
  "vehicles/deleteVehicle",
  async (vehicleId: string, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return vehicleId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal menghapus data kendaraan");
    }
  }
);

const vehicleSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    resetVehiclesStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch Vehicles
      .addCase(fetchVehicles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchVehicles.fulfilled,
        (state, action: PayloadAction<Vehicle[]>) => {
          state.status = "succeeded";
          state.vehicles = action.payload; // Update state dengan data yang difetch
        }
      )
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Gagal memuat kendaraan";
      })
      // Create Vehicle
      .addCase(createVehicle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        createVehicle.fulfilled,
        (state, action: PayloadAction<Vehicle>) => {
          state.status = "succeeded";
          state.vehicles.unshift(action.payload); // Tambahkan kendaraan baru ke depan array
        }
      )
      .addCase(createVehicle.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal membuat kendaraan";
      })
      // Update Vehicle
      .addCase(updateVehicle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateVehicle.fulfilled,
        (state, action: PayloadAction<Vehicle>) => {
          state.status = "succeeded";
          const index = state.vehicles.findIndex(
            (v) => v.id === action.payload.id
          );
          if (index !== -1) {
            state.vehicles[index] = action.payload; // Perbarui objek kendaraan
          }
        }
      )
      .addCase(updateVehicle.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Gagal mengupdate kendaraan";
      })
      // Delete Vehicle
      .addCase(deleteVehicle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteVehicle.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.vehicles = state.vehicles.filter(
            (v) => v.id !== action.payload
          ); // Hapus kendaraan
        }
      )
      .addCase(deleteVehicle.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal menghapus kendaraan";
      });
  },
});

export const { resetVehiclesStatus } = vehicleSlice.actions;
export default vehicleSlice.reducer;
