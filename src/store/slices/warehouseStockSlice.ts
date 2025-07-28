// src/store/slices/warehouseStockSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WarehouseStock, RawWarehouseStockApiResponse } from "@/types/warehouseStok";
import { api } from "@/lib/utils/api";

export const formatWarehouseStockDates = (rawWs: RawWarehouseStockApiResponse): WarehouseStock => {
  return {
    ...rawWs,
    createdAt: new Date(rawWs.createdAt),
    updatedAt: new Date(rawWs.updatedAt),
    // Relasi akan di-map jika disertakan dalam respons API
    sparePart: rawWs.sparePart
      ? {
          id: rawWs.sparePart.id,
          partNumber: rawWs.sparePart.partNumber,
          partName: rawWs.sparePart.partName,
          unit: rawWs.sparePart.unit,
        }
      : undefined,
    warehouse: rawWs.warehouse
      ? {
          id: rawWs.warehouse.id,
          name: rawWs.warehouse.name,
          location: rawWs.warehouse.location,
        }
      : undefined,
  };
};

interface WarehouseStockState {
  warehouseStocks: WarehouseStock[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WarehouseStockState = {
  warehouseStocks: [],
  status: "idle",
  error: null,
};

export const fetchWarehouseStocks = createAsyncThunk(
  "warehouseStocks/fetchWarehouseStocks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawWarehouseStockApiResponse[]>(
        "http://localhost:3000/api/warehouse-stocks"
      );
      return response.map(formatWarehouseStockDates);
    } catch (error: any) {
      console.error("Error fetching warehouse stocks:", error);
      return rejectWithValue(error.message || "Gagal memuat daftar Stok Gudang.");
    }
  }
);

const warehouseStockSlice = createSlice({
  name: "warehouseStocks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehouseStocks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWarehouseStocks.fulfilled, (state, action: PayloadAction<WarehouseStock[]>) => {
        state.status = "succeeded";
        state.warehouseStocks = action.payload;
      })
      .addCase(fetchWarehouseStocks.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar Stok Gudang.";
      });
  },
});

export const {} = warehouseStockSlice.actions;
export default warehouseStockSlice.reducer;
