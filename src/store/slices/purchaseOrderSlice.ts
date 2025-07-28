// src/store/slices/purchaseOrderSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PurchaseOrder, RawPurchaseOrderApiResponse } from "@/types/purchaseOrder";
import { api } from "@/lib/utils/api";
import { PurchaseOrderStatus } from "@prisma/client";

export const formatPurchaseOrderDates = (rawPo: RawPurchaseOrderApiResponse): PurchaseOrder => {
  return {
    ...rawPo,
    poDate: new Date(rawPo.poDate),
    deliveryDate: rawPo.deliveryDate ? new Date(rawPo.deliveryDate) : null,
    createdAt: new Date(rawPo.createdAt),
    updatedAt: new Date(rawPo.updatedAt),
    status: rawPo.status as PurchaseOrderStatus,
    // Relasi akan di-map jika disertakan dalam respons API
    supplier: rawPo.supplier
      ? {
          id: rawPo.supplier.id,
          companyName: rawPo.supplier.companyName,
        }
      : undefined,
    requestedBy: rawPo.requestedBy
      ? {
          id: rawPo.requestedBy.id,
          name: rawPo.requestedBy.name,
        }
      : undefined,
    approvedBy: rawPo.approvedBy
      ? {
          id: rawPo.approvedBy.id,
          name: rawPo.approvedBy.name,
        }
      : undefined,
  };
};

interface PurchaseOrderState {
  purchaseOrders: PurchaseOrder[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PurchaseOrderState = {
  purchaseOrders: [],
  status: "idle",
  error: null,
};

export const fetchPurchaseOrders = createAsyncThunk(
  "purchaseOrders/fetchPurchaseOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawPurchaseOrderApiResponse[]>(
        "http://localhost:3000/api/purchase-orders"
      );
      return response.map(formatPurchaseOrderDates);
    } catch (error: any) {
      console.error("Error fetching purchase orders:", error);
      return rejectWithValue(error.message || "Gagal memuat daftar Purchase Order.");
    }
  }
);

const purchaseOrderSlice = createSlice({
  name: "purchaseOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action: PayloadAction<PurchaseOrder[]>) => {
        state.status = "succeeded";
        state.purchaseOrders = action.payload;
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar Purchase Order.";
      });
  },
});

export const {} = purchaseOrderSlice.actions;
export default purchaseOrderSlice.reducer;
