import {
  Vehicle,
  VehicleCategory,
  VehicleFormValues,
  VehicleFuelType,
  VehicleStatus,
  VehicleTransmissionType,
  VehicleType,
} from "@/types/vehicle";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { api } from "@/lib/utils/api";

interface VehicleState {
  vehicles: Vehicle[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: VehicleState = {
  vehicles: [],
  status: "idle",
  error: null,
};

interface RawVehicleApiResponse {
  id: string;
  licensePlate: string;
  vehicleMake: string;
  model: string;
  trimLevel: string | null;
  vinNum: string | null;
  engineNum: string | null;
  chassisNum: string | null;
  yearMade: number;
  color: string;
  vehicleType: VehicleType;
  vehicleCategory: VehicleCategory;
  fuelType: VehicleFuelType;
  transmissionType: VehicleTransmissionType;
  lastOdometer: number;
  lastServiceDate: Date;
  status: VehicleStatus;
  notes: string | null;
  ownerId: string;
  carUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Helper memformat tanggal dari API menjadi string ISO
const formatVehicleDates = (vehicle: any): Vehicle => {
  return {
    ...vehicle,
    lastServiceDate: vehicle.lastServiceDate.toISOString(),
    createdAt: vehicle.createdAt.toISOString(),
    updatedAt: vehicle.updatedAt.toISOString(),
  };
};

export const fetchVehicles = createAsyncThunk(
  "vehicles/fetchVehicles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawVehicleApiResponse[]>(
        "http://localhost:3000/api/vehicles"
      );
      const formattedData = response.map(formatVehicleDates);
      return formattedData;
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal memuat daftar kendaraan");
    }
  }
);

export const fetchVehicleById = createAsyncThunk(
  "vehicles/fetchVehicleById",
  async (vehicleId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<RawVehicleApiResponse>(
        `http://localhost:3000/api/vehicles/${vehicleId}`
      );
      return formatVehicleDates(response);
    } catch (error: any) {
      return rejectWithValue(
        error.message || `Gagal memuat detail kendaraan dengan ID ${vehicleId}.`
      );
    }
  }
);

export const createVehicle = createAsyncThunk(
  "vehicles/createVehicle",
  async (newVehicleData: VehicleFormValues, { rejectWithValue }) => {
    try {
      const response = await api.post<RawVehicleApiResponse>(
        "http://localhost:3000/api/vehicles",
        newVehicleData
      );
      return formatVehicleDates(response);
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
      if (!updateVehicleData.id) {
        throw new Error("ID kendaraan tidak ditemukan untuk pembaruan.");
      }
      const response = await api.put<RawVehicleApiResponse>(
        `http://localhost:3000/api/vehicles/${updateVehicleData.id}`,
        updateVehicleData
      );
      return formatVehicleDates(response);
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
      await api.delete(`http://localhost:3000/api/vehicles/${vehicleId}`);
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
          state.vehicles = action.payload;
        }
      )
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Gagal memuat kendaraan";
      })
      .addCase(fetchVehicleById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchVehicleById.fulfilled,
        (state, action: PayloadAction<Vehicle>) => {
          state.status = "succeeded";
          const index = state.vehicles.findIndex(
            (v) => v.id === action.payload.id
          );
          if (index !== -1) {
            state.vehicles[index] = action.payload;
          } else {
            state.vehicles.push(action.payload);
          }
        }
      )
      .addCase(fetchVehicleById.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Gagal memuat detail kendaraan";
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
