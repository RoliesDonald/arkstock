// src/store/slices/estimationSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Estimation, RawEstimationApiResponse } from "@/types/estimation";
import { api } from "@/lib/utils/api";
import { EstimationStatus } from "@prisma/client";

export const formatEstimationDates = (rawEstimation: RawEstimationApiResponse): Estimation => {
  return {
    ...rawEstimation,
    estimationDate: new Date(rawEstimation.estimationDate),
    finishedDate: rawEstimation.finishedDate ? new Date(rawEstimation.finishedDate) : null,
    createdAt: new Date(rawEstimation.createdAt),
    updatedAt: new Date(rawEstimation.updatedAt),
    status: rawEstimation.status as EstimationStatus,
    // Relasi akan di-map jika disertakan dalam respons API
    workOrder: rawEstimation.workOrder
      ? {
          id: rawEstimation.workOrder.id,
          workOrderNumber: rawEstimation.workOrder.workOrderNumber,
        }
      : undefined,
    vehicle: rawEstimation.vehicle
      ? {
          id: rawEstimation.vehicle.id,
          licensePlate: rawEstimation.vehicle.licensePlate,
          vehicleMake: rawEstimation.vehicle.vehicleMake,
          model: rawEstimation.vehicle.model,
        }
      : undefined,
    mechanic: rawEstimation.mechanic
      ? {
          id: rawEstimation.mechanic.id,
          name: rawEstimation.mechanic.name,
        }
      : undefined,
    accountant: rawEstimation.accountant
      ? {
          id: rawEstimation.accountant.id,
          name: rawEstimation.accountant.name,
        }
      : undefined,
    approvedBy: rawEstimation.approvedBy
      ? {
          id: rawEstimation.approvedBy.id,
          name: rawEstimation.approvedBy.name,
        }
      : undefined,
  };
};

interface EstimationState {
  estimations: Estimation[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: EstimationState = {
  estimations: [],
  status: "idle",
  error: null,
};

export const fetchEstimations = createAsyncThunk(
  "estimations/fetchEstimations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawEstimationApiResponse[]>("http://localhost:3000/api/estimations");
      return response.map(formatEstimationDates);
    } catch (error: any) {
      console.error("Error fetching estimations:", error);
      return rejectWithValue(error.message || "Gagal memuat daftar Estimasi.");
    }
  }
);

const estimationSlice = createSlice({
  name: "estimations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEstimations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEstimations.fulfilled, (state, action: PayloadAction<Estimation[]>) => {
        state.status = "succeeded";
        state.estimations = action.payload;
      })
      .addCase(fetchEstimations.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar Estimasi.";
      });
  },
});

export const {} = estimationSlice.actions;
export default estimationSlice.reducer;
