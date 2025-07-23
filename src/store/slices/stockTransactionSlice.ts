// src/store/slices/stockTransactionSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StockTransaction, RawStockTransactionApiResponse } from "@/types/stockTransaction";
import { api } from "@/lib/utils/api";
import { StockTransactionType } from "@prisma/client";

export const formatStockTransactionDates = (
  rawTransaction: RawStockTransactionApiResponse
): StockTransaction => {
  return {
    ...rawTransaction,
    transactionDate: new Date(rawTransaction.transactionDate),
    createdAt: new Date(rawTransaction.createdAt),
    updatedAt: new Date(rawTransaction.updatedAt),
    type: rawTransaction.type as StockTransactionType,
    // Relasi akan di-map jika disertakan dalam respons API
    sparePart: rawTransaction.sparePart
      ? {
          id: rawTransaction.sparePart.id,
          partNumber: rawTransaction.sparePart.partNumber,
          partName: rawTransaction.sparePart.partName,
          unit: rawTransaction.sparePart.unit,
        }
      : undefined,
    sourceWarehouse: rawTransaction.sourceWarehouse
      ? {
          // Perubahan
          id: rawTransaction.sourceWarehouse.id,
          name: rawTransaction.sourceWarehouse.name,
        }
      : undefined,
    targetWarehouse: rawTransaction.targetWarehouse
      ? {
          // Perubahan
          id: rawTransaction.targetWarehouse.id,
          name: rawTransaction.targetWarehouse.name,
        }
      : undefined,
    processedBy: rawTransaction.processedBy
      ? {
          id: rawTransaction.processedBy.id,
          name: rawTransaction.processedBy.name,
        }
      : undefined,
  };
};

interface StockTransactionState {
  stockTransactions: StockTransaction[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: StockTransactionState = {
  stockTransactions: [],
  status: "idle",
  error: null,
};

export const fetchStockTransactions = createAsyncThunk(
  "stockTransactions/fetchStockTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawStockTransactionApiResponse[]>(
        "http://localhost:3000/api/stock-transactions"
      );
      return response.map(formatStockTransactionDates);
    } catch (error: any) {
      console.error("Error fetching stock transactions:", error);
      return rejectWithValue(error.message || "Gagal memuat daftar Transaksi Stok.");
    }
  }
);

const stockTransactionSlice = createSlice({
  name: "stockTransactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStockTransactions.fulfilled, (state, action: PayloadAction<StockTransaction[]>) => {
        state.status = "succeeded";
        state.stockTransactions = action.payload;
      })
      .addCase(fetchStockTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar Transaksi Stok.";
      });
  },
});

export const {} = stockTransactionSlice.actions;
export default stockTransactionSlice.reducer;
