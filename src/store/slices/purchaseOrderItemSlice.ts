import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PurchaseOrderItem, RawPurchaseOrderItemApiResponse } from "@/types/purchaseOrderItems";
import { api } from "@/lib/utils/api";

export const formatPurchaseOrderItemDates = (rawPoi: RawPurchaseOrderItemApiResponse): PurchaseOrderItem => {
  return {
    ...rawPoi,
    createdAt: new Date(rawPoi.createdAt),
    updatedAt: new Date(rawPoi.updatedAt),
    // Relasi akan di-map jika disertakan dalam respons API
    purchaseOrder: rawPoi.purchaseOrder
      ? {
          id: rawPoi.purchaseOrder.id,
          poNumber: rawPoi.purchaseOrder.poNumber,
        }
      : undefined,
    sparePart: rawPoi.sparePart
      ? {
          id: rawPoi.sparePart.id,
          partNumber: rawPoi.sparePart.partNumber,
          partName: rawPoi.sparePart.partName,
          unit: rawPoi.sparePart.unit,
        }
      : undefined,
  };
};

interface PurchaseOrderItemState {
  purchaseOrderItems: PurchaseOrderItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PurchaseOrderItemState = {
  purchaseOrderItems: [],
  status: "idle",
  error: null,
};

export const fetchPurchaseOrderItems = createAsyncThunk(
  "purchaseOrderItems/fetchPurchaseOrderItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawPurchaseOrderItemApiResponse[]>(
        "http://localhost:3000/api/purchase-order-items"
      );
      return response.map(formatPurchaseOrderItemDates);
    } catch (error: any) {
      console.error("Error fetching purchase order items:", error);
      return rejectWithValue(error.message || "Gagal memuat daftar Item Purchase Order.");
    }
  }
);

const purchaseOrderItemSlice = createSlice({
  name: "purchaseOrderItems",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseOrderItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPurchaseOrderItems.fulfilled, (state, action: PayloadAction<PurchaseOrderItem[]>) => {
        state.status = "succeeded";
        state.purchaseOrderItems = action.payload;
      })
      .addCase(fetchPurchaseOrderItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar Item Purchase Order.";
      });
  },
});

export const {} = purchaseOrderItemSlice.actions;
export default purchaseOrderItemSlice.reducer;
