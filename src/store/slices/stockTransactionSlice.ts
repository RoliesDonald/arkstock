import {
  StockTransaction,
  StockTransactionFormValues,
} from "@/types/stockTransaction";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stockTransactionData as initialStockTransactionData } from "@/data/sampleStockTransactionData";
import { v4 as _uuidv4 } from "uuid";
import { resolve } from "path";
import { stat } from "fs";

interface StockTransactionState {
  transactions: StockTransaction[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: StockTransactionState = {
  transactions: initialStockTransactionData,
  status: "idle",
  error: null,
};

// ambil semua data transaksi
export const fetchStockTransactions = createAsyncThunk(
  "stockTransactions/fetchStockTransactions",
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // API beneran
    // return await api.get('/stock-transactions')
    return initialStockTransactionData;
  }
);

// transaksi baru
export const createStockTransaction = createAsyncThunk(
  "stockTransactions/createStockTransaction",
  async (
    newTransactionData: StockTransactionFormValues,
    { rejectWithValue }
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newTransaction: StockTransaction = {
        ...newTransactionData,
        id: _uuidv4(),
        date: newTransactionData.date,
        createdAt: new Date(),
        updatedAt: new Date(),
        targetWarehouseId: newTransactionData.targetWarehouseId || null,
        remark: newTransactionData.remark || null,
      };
      //   const response = await api.post("/stock-transactions", newTransaction);
      //   return response.data;
      return newTransaction;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Gagal membuat stok transaksi baru"
      );
    }
  }
);

// update transaksi
export const updateStockTransaction = createAsyncThunk(
  "stockTransactions/updateStockTransaction",
  async (updatedTransactionData: StockTransaction, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // API beneran
      // const response = await api.put(`/stock-transactions/${updatedTransactionData.id}`, updatedTransactionData)
      // return response.data
      return { ...updatedTransactionData, updatedAt: new Date() };
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Gagal mengupdate stok transaksi"
      );
    }
  }
);

// delete transaksi
export const deleteStockTransaction = createAsyncThunk(
  "stockTransactions/deleteStockTransaction",
  async (transactionId: string, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // API beneran
      // await api.delete(`/stock-transactions/${transactionId}`)
      return transactionId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal menghapus stok transaksi");
    }
  }
);

const stockTransactionSlice = createSlice({
  name: "stockTransactions",
  initialState,
  reducers: {
    resetStockTransactionStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ambil data
      .addCase(fetchStockTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchStockTransactions.fulfilled,
        (state, action: PayloadAction<StockTransaction[]>) => {
          state.status = "succeeded";
          state.transactions = action.payload;
        }
      )
      .addCase(fetchStockTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "Gagal memuat daftar stok transaksi";
      })

      // create data
      .addCase(createStockTransaction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        createStockTransaction.fulfilled,
        (state, action: PayloadAction<StockTransaction>) => {
          state.status = "succeeded";
          state.transactions.unshift(action.payload);
        }
      )
      .addCase(createStockTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal membuat transaksi";
      })

      //update data
      .addCase(updateStockTransaction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateStockTransaction.fulfilled,
        (state, action: PayloadAction<StockTransaction>) => {
          state.status = "succeeded";
          const index = state.transactions.findIndex(
            (t) => t.id === action.payload.id
          );
          if (index !== -1) {
            state.transactions[index] = action.payload;
          }
        }
      )
      .addCase(updateStockTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal mengupdate";
      })

      //   delete data
      .addCase(deleteStockTransaction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteStockTransaction.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.transactions = state.transactions.filter(
            (t) => t.id !== action.payload
          );
        }
      )
      .addCase(deleteStockTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal menghapus";
      });
  },
});

export const { resetStockTransactionStatus } = stockTransactionSlice.actions;
export default stockTransactionSlice.reducer;
