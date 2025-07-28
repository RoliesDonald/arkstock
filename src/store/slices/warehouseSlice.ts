// src/store/slices/warehouseSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Warehouse, RawWarehouseApiResponse } from "@/types/warehouse";
import { api } from "@/lib/utils/api";
import { WarehouseType } from "@prisma/client";

export const formatWarehouseDates = (rawWarehouse: RawWarehouseApiResponse): Warehouse => {
  return {
    ...rawWarehouse,
    createdAt: new Date(rawWarehouse.createdAt),
    updatedAt: new Date(rawWarehouse.updatedAt),
    warehouseType: rawWarehouse.warehouseType as WarehouseType,
  };
};

interface WarehouseState {
  warehouses: Warehouse[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WarehouseState = {
  warehouses: [],
  status: "idle",
  error: null,
};

export const fetchWarehouses = createAsyncThunk(
  "warehouses/fetchWarehouses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawWarehouseApiResponse[]>("http://localhost:3000/api/warehouses");
      return response.map(formatWarehouseDates);
    } catch (error: any) {
      console.error("Error fetching warehouses:", error);
      return rejectWithValue(error.message || "Gagal memuat daftar gudang.");
    }
  }
);

const warehouseSlice = createSlice({
  name: "warehouses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehouses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWarehouses.fulfilled, (state, action: PayloadAction<Warehouse[]>) => {
        state.status = "succeeded";
        state.warehouses = action.payload;
      })
      .addCase(fetchWarehouses.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar gudang.";
      });
  },
});

export const {} = warehouseSlice.actions;
export default warehouseSlice.reducer;
