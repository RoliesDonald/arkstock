import { WarehouseStock } from "@/types/warehouseStok";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { warehouseStockData as initialWarehouseStockData } from "@/data/sampleWarehouseStockData";
import { v4 as uuidv4 } from "uuid";

interface WarehouseStockState {
  stockItems: WarehouseStock[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WarehouseStockState = {
  stockItems: [],
  status: "idle",
  error: null,
};

// Async ambil semua item stok gudang
export const fetchWarehouseStock = createAsyncThunk(
  "warehouseStock/fetchWarehouseStock",
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return initialWarehouseStockData;
    // return await api.get('/warehouse-stock')
  }
);

// Async Thunk untuk menambahkan/memperbarui item stok gudang
// Biasanya, ini tidak dibuat langsung dari form, melainkan diperbarui secara otomatis
// berdasarkan transaksi stok. Namun, untuk simulasi CRUD, kita buat dulu.
export const createOrUpdateWarehouseStock = createAsyncThunk(
  "warehouseStock/createOrUpdateWarehouseStock",
  async (stockItem: WarehouseStock, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Dalam aplikasi nyata, Anda akan mencari apakah item stok sudah ada
      // dan memperbarui atau membuatnya baru di backend.
      // const response = await api.post('/warehouse-stock', stockItem); // atau PUT
      // return response.data;

      // Untuk simulasi:
      if (stockItem.id) {
        // Jika ada ID, anggap update
        return { ...stockItem, updatedAt: new Date() };
      } else {
        // Jika tidak ada ID, anggap create
        return {
          ...stockItem,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal menyimpan stok gudang");
    }
  }
);

// Async Thunk untuk menghapus item stok gudang
export const deleteWarehouseStock = createAsyncThunk(
  "warehouseStock/deleteWarehouseStock",
  async (stockItemId: string, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // await api.delete(`/warehouse-stock/${stockItemId}`);
      return stockItemId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal menghapus stok gudang");
    }
  }
);

const warehouseStockSlice = createSlice({
  name: "warehouseStock",
  initialState,
  reducers: {
    resetWarehouseStockStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
    // Reducer untuk memperbarui stok berdasarkan transaksi (akan dipanggil dari stockTransactionSlice atau middleware)
    updateStockFromTransaction: (
      state,
      action: PayloadAction<{
        sparePartId: string;
        warehouseId: string;
        quantity: number;
        transactionType: "IN" | "OUT" | "TRANSFER_OUT" | "TRANSFER_IN";
      }>
    ) => {
      const { sparePartId, warehouseId, quantity, transactionType } =
        action.payload;
      const exsistingStockIndex = state.stockItems.findIndex(
        (item) =>
          item.sparePartId === sparePartId && item.warehouseId === warehouseId
      );
      if (exsistingStockIndex !== -1) {
        //update stok yang ada
        let newStock = state.stockItems[exsistingStockIndex].currentStock;
        if (transactionType === "IN" || transactionType === "TRANSFER_IN") {
          newStock += quantity;
        } else if (
          transactionType === "OUT" ||
          transactionType === "TRANSFER_OUT"
        ) {
          newStock -= quantity;
        }
        state.stockItems[exsistingStockIndex].currentStock = newStock;
        state.stockItems[exsistingStockIndex].updatedAt = new Date();
      } else if (
        transactionType === "IN" ||
        transactionType === "TRANSFER_IN"
      ) {
        // kalau tidak ada transaksi
        state.stockItems.push({
          id: uuidv4(),
          sparePartId,
          warehouseId,
          currentStock: quantity,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder

      // ambil semua data stok
      .addCase(fetchWarehouseStock.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchWarehouseStock.fulfilled,
        (state, action: PayloadAction<WarehouseStock[]>) => {
          state.status = "succeeded";
          state.stockItems = action.payload;
        }
      )
      .addCase(fetchWarehouseStock.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Gagal memuat stok gudang";
      })

      // Create or Update Warehouse Stock
      .addCase(createOrUpdateWarehouseStock.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        createOrUpdateWarehouseStock.fulfilled,
        (state, action: PayloadAction<WarehouseStock>) => {
          state.status = "succeeded";
          const index = state.stockItems.findIndex(
            (item) => item.id === action.payload.id
          );
          if (index !== -1) {
            state.stockItems[index] = action.payload; // Update yang sudah ada
          } else {
            state.stockItems.unshift(action.payload); // Tambah baru
          }
        }
      )
      .addCase(createOrUpdateWarehouseStock.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Gagal menyimpan stok gudang";
      })
      // Delete Warehouse Stock
      .addCase(deleteWarehouseStock.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteWarehouseStock.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.stockItems = state.stockItems.filter(
            (item) => item.id !== action.payload
          );
        }
      )
      .addCase(deleteWarehouseStock.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Gagal menghapus stok gudang";
      });
  },
});

export const { resetWarehouseStockStatus, updateStockFromTransaction } =
  warehouseStockSlice.actions;

export default warehouseStockSlice.reducer;
