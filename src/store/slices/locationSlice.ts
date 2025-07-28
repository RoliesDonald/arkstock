// src/store/slices/locationSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Location, RawLocationApiResponse } from "@/types/locations";
import { api } from "@/lib/utils/api";

export const formatLocationDates = (rawLocation: RawLocationApiResponse): Location => {
  return {
    ...rawLocation,
    name: rawLocation.name,
    address: rawLocation.address,
    createdAt: new Date(rawLocation.createdAt),
    updatedAt: new Date(rawLocation.updatedAt),
  };
};

interface LocationState {
  locations: Location[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: LocationState = {
  locations: [],
  status: "idle",
  error: null,
};

export const fetchLocations = createAsyncThunk("locations/fetchLocations", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<RawLocationApiResponse[]>("http://localhost:3000/api/locations");
    return response.map(formatLocationDates);
  } catch (error: any) {
    console.error("Error fetching locations:", error);
    return rejectWithValue(error.message || "Gagal memuat daftar lokasi.");
  }
});

const locationSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLocations.fulfilled, (state, action: PayloadAction<Location[]>) => {
        state.status = "succeeded";
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar lokasi.";
      });
  },
});

export const {} = locationSlice.actions;
export default locationSlice.reducer;
