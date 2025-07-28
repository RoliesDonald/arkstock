// src/store/slices/sparePartSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SparePart, RawSparePartApiResponse } from "@/types/sparepart";
import { api } from "@/lib/utils/api";
import { PartVariant, SparePartCategory, SparePartStatus } from "@prisma/client"; // Import semua Enums dari Prisma

export const formatSparePartDates = (rawSparePart: RawSparePartApiResponse): SparePart => {
  return {
    ...rawSparePart,
    createdAt: new Date(rawSparePart.createdAt),
    updatedAt: new Date(rawSparePart.updatedAt),
    variant: rawSparePart.variant as PartVariant,
    category: rawSparePart.category as SparePartCategory,
    status: rawSparePart.status as SparePartStatus,
    // Price dan stock sudah diasumsikan sebagai number dari RawSparePartApiResponse
  };
};

interface SparePartState {
  spareParts: SparePart[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SparePartState = {
  spareParts: [],
  status: "idle",
  error: null,
};

export const fetchSpareParts = createAsyncThunk(
  "spareParts/fetchSpareParts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawSparePartApiResponse[]>("http://localhost:3000/api/spare-parts");
      return response.map(formatSparePartDates);
    } catch (error: any) {
      console.error("Error fetching spare parts:", error);
      return rejectWithValue(error.message || "Gagal memuat daftar spare part.");
    }
  }
);

const sparePartSlice = createSlice({
  name: "spareParts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpareParts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSpareParts.fulfilled, (state, action: PayloadAction<SparePart[]>) => {
        state.status = "succeeded";
        state.spareParts = action.payload;
      })
      .addCase(fetchSpareParts.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar spare part.";
      });
  },
});

export const {} = sparePartSlice.actions;
export default sparePartSlice.reducer;
