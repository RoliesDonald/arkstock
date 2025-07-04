import { Warehouse, WarehouseFormValues } from "@/types/warehouse";
import { warehouseData as initialWarehouseData } from "@/data/sampleWarehouseData";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

interface WarehouseState {
  warehouses: Warehouse[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WarehouseState = {
  warehouses: initialWarehouseData,
  status: "idle",
  error: null,
};

export const fetchWarehouses = createAsyncThunk(
  "warehouses/fetchWarehouses",
  async () => {
    // simulasi API
    await new Promise((resolve) => setTimeout(resolve, 500));
    // API beneran
    // const response = await api.get('/warehouses')
    // return response.data;
    return initialWarehouseData;
  }
);

// create new warehouse
export const createWarehouse = createAsyncThunk(
  "warehouses/createWarehouse",
  async (newWarehouseData: WarehouseFormValues, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newWarehouse: Warehouse = {
        ...newWarehouseData,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // API beneran
      // const response = await api.post('/warehouses', newWarehouse);
      // return response.data;
      return newWarehouse;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Gagal input data warehouse baru"
      );
    }
  }
);

// update/edit exsisting gudang
export const updateWarehouse = createAsyncThunk(
  "warehouses/updateWarehouse",
  async (updatedWarehouseData: Warehouse, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulasi API call
      // API beneran
      // const response = await api.put(`/warehouses/${updatedWarehouseData.id}`, updatedWarehouseData);
      // return response.data;
      return { ...updatedWarehouseData, updatedAt: new Date() };
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal mengupdate gudang");
    }
  }
);

// delete
export const deleteWarehouse = createAsyncThunk(
  "warehouses/deleteWarehouse",
  async (warehouseId: string, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulasi API call
      // API beneran
      // await api.delete(`/warehouses/${warehouseId}`);
      return warehouseId; // Untuk saat ini, kembalikan ID gudang yang dihapus
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal menghapus gudang");
    }
  }
);

const warehouseSlice = createSlice({
  name: "warehouses",
  initialState,
  reducers: {
    resetWarehouseStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehouses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchWarehouses.fulfilled,
        (state, action: PayloadAction<Warehouse[]>) => {
          state.status = "succeeded";
          state.warehouses = action.payload;
        }
      )
      .addCase(fetchWarehouses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Gagal memuat daftar gudang";
      })
      // Create Warehouse
      .addCase(createWarehouse.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        createWarehouse.fulfilled,
        (state, action: PayloadAction<Warehouse>) => {
          state.status = "succeeded";
          state.warehouses.unshift(action.payload); // Tambahkan gudang baru ke depan array
        }
      )
      .addCase(createWarehouse.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal membuat gudang";
      })
      // Update Warehouse
      .addCase(updateWarehouse.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateWarehouse.fulfilled,
        (state, action: PayloadAction<Warehouse>) => {
          state.status = "succeeded";
          const index = state.warehouses.findIndex(
            (w) => w.id === action.payload.id
          );
          if (index !== -1) {
            state.warehouses[index] = action.payload; // Perbarui objek gudang
          }
        }
      )
      .addCase(updateWarehouse.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal mengupdate gudang";
      })
      // Delete Warehouse
      .addCase(deleteWarehouse.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteWarehouse.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.warehouses = state.warehouses.filter(
            (w) => w.id !== action.payload
          ); // Hapus gudang dari state
        }
      )
      .addCase(deleteWarehouse.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal menghapus gudang";
      });
  },
});

export const { resetWarehouseStatus } = warehouseSlice.actions;
export default warehouseSlice.reducer;
