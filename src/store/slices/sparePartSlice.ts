// src/store/slices/sparePartSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { SparePart, SparePartFormValues } from "@/types/sparepart";
import { sparePartData as initialSparePartData } from "@/data/sampleSparePartData"; // Menggunakan data dummy
import { v4 as uuidv4 } from "uuid"; // Untuk menghasilkan ID unik
import { generateSku } from "@/lib/skuFormatter"; // <-- DITAMBAHKAN: Import generateSku

interface SparePartState {
  spareParts: SparePart[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SparePartState = {
  spareParts: initialSparePartData,
  status: "idle",
  error: null,
};

// Simulasi API call dengan delay
const simulateApiCall = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Async Thunks
export const fetchSpareParts = createAsyncThunk(
  "spareParts/fetchSpareParts",
  async () => {
    const response = await simulateApiCall(initialSparePartData);
    return response;
  }
);

export const createSparePart = createAsyncThunk(
  "spareParts/createSparePart",
  async (newSparePartData: SparePartFormValues) => {
    // Pastikan SKU selalu string. Jika newSparePartData.sku undefined, generate ulang.
    // Ini penting karena SparePart interface memerlukan SKU sebagai string.
    const finalSku =
      newSparePartData.sku ||
      generateSku(
        newSparePartData.partNumber,
        newSparePartData.variant,
        newSparePartData.brand
      );

    const newSparePart: SparePart = {
      ...newSparePartData,
      sku: finalSku, // <-- KOREKSI: Secara eksplisit set SKU
      id: uuidv4(),
      stock: newSparePartData.initialStock, // Set stock awal dari initialStock
      compatibility: newSparePartData.compatibility || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const response = await simulateApiCall(newSparePart);
    return response;
  }
);

export const updateSparePart = createAsyncThunk(
  "spareParts/updateSparePart",
  async (updatedSparePart: SparePart) => {
    const response = await simulateApiCall({
      ...updatedSparePart,
      updatedAt: new Date(),
    });
    return response;
  }
);

export const deleteSparePart = createAsyncThunk(
  "spareParts/deleteSparePart",
  async (sparePartId: string) => {
    await simulateApiCall(null);
    return sparePartId;
  }
);

const sparePartSlice = createSlice({
  name: "spareParts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Spare Parts
      .addCase(fetchSpareParts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchSpareParts.fulfilled,
        (state, action: PayloadAction<SparePart[]>) => {
          state.status = "succeeded";
          state.spareParts = action.payload;
        }
      )
      .addCase(fetchSpareParts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Gagal memuat suku cadang";
      })
      // Create Spare Part
      .addCase(createSparePart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        createSparePart.fulfilled,
        (state, action: PayloadAction<SparePart>) => {
          state.status = "succeeded";
          state.spareParts.push(action.payload);
        }
      )
      .addCase(createSparePart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Gagal membuat suku cadang";
      })
      // Update Spare Part
      .addCase(updateSparePart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateSparePart.fulfilled,
        (state, action: PayloadAction<SparePart>) => {
          state.status = "succeeded";
          const index = state.spareParts.findIndex(
            (sp) => sp.id === action.payload.id
          );
          if (index !== -1) {
            state.spareParts[index] = action.payload;
          }
        }
      )
      .addCase(updateSparePart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Gagal memperbarui suku cadang";
      })
      // Delete Spare Part
      .addCase(deleteSparePart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteSparePart.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.spareParts = state.spareParts.filter(
            (sp) => sp.id !== action.payload
          );
        }
      )
      .addCase(deleteSparePart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Gagal menghapus suku cadang";
      });
  },
});

export default sparePartSlice.reducer;
