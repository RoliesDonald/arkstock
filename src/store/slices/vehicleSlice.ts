// src/store/slices/vehicleSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Vehicle, RawVehicleApiResponse } from "@/types/vehicle";
import { api } from "@/lib/utils/api";
import {
  VehicleType,
  VehicleCategory,
  VehicleFuelType,
  VehicleTransmissionType,
  VehicleStatus,
} from "@prisma/client"; // Import Enums dari Prisma

export const formatVehicleDates = (rawVehicle: RawVehicleApiResponse): Vehicle => {
  return {
    ...rawVehicle,
    lastServiceDate: new Date(rawVehicle.lastServiceDate),
    createdAt: new Date(rawVehicle.createdAt),
    updatedAt: new Date(rawVehicle.updatedAt),
    vehicleType: rawVehicle.vehicleType as VehicleType,
    vehicleCategory: rawVehicle.vehicleCategory as VehicleCategory,
    fuelType: rawVehicle.fuelType as VehicleFuelType,
    transmissionType: rawVehicle.transmissionType as VehicleTransmissionType,
    status: rawVehicle.status as VehicleStatus,
    // Jika owner atau carUser disertakan dalam respons API, pastikan tipenya sesuai
    owner: rawVehicle.owner
      ? { id: rawVehicle.owner.id, companyName: rawVehicle.owner.companyName }
      : undefined,
    carUser: rawVehicle.carUser
      ? { id: rawVehicle.carUser.id, companyName: rawVehicle.carUser.companyName }
      : undefined,
  };
};

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

export const fetchVehicles = createAsyncThunk("vehicles/fetchVehicles", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<RawVehicleApiResponse[]>("http://localhost:3000/api/vehicles");
    return response.map(formatVehicleDates);
  } catch (error: any) {
    console.error("Error fetching vehicles:", error);
    return rejectWithValue(error.message || "Gagal memuat daftar kendaraan.");
  }
});

const vehicleSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVehicles.fulfilled, (state, action: PayloadAction<Vehicle[]>) => {
        state.status = "succeeded";
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar kendaraan.";
      });
  },
});

export const {} = vehicleSlice.actions;
export default vehicleSlice.reducer;
