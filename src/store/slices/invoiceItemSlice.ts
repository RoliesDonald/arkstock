import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InvoiceItem, RawInvoiceItemApiResponse } from "@/types/invoiceItems";
import { api } from "@/lib/utils/api";

export const formatInvoiceItemDates = (rawIi: RawInvoiceItemApiResponse): InvoiceItem => {
  return {
    ...rawIi,
    createdAt: new Date(rawIi.createdAt),
    updatedAt: new Date(rawIi.updatedAt),
    // Relasi akan di-map jika disertakan dalam respons API
    invoice: rawIi.invoice
      ? {
          id: rawIi.invoice.id,
          invoiceNumber: rawIi.invoice.invoiceNumber,
        }
      : undefined,
    sparePart: rawIi.sparePart
      ? {
          id: rawIi.sparePart.id,
          partNumber: rawIi.sparePart.partNumber,
          partName: rawIi.sparePart.partName,
          unit: rawIi.sparePart.unit,
        }
      : undefined,
  };
};

interface InvoiceItemState {
  invoiceItems: InvoiceItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InvoiceItemState = {
  invoiceItems: [],
  status: "idle",
  error: null,
};

export const fetchInvoiceItems = createAsyncThunk(
  "invoiceItems/fetchInvoiceItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawInvoiceItemApiResponse[]>("http://localhost:3000/api/invoice-items");
      return response.map(formatInvoiceItemDates);
    } catch (error: any) {
      console.error("Error fetching invoice items:", error);
      return rejectWithValue(error.message || "Gagal memuat daftar Item Invoice.");
    }
  }
);

const invoiceItemSlice = createSlice({
  name: "invoiceItems",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoiceItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInvoiceItems.fulfilled, (state, action: PayloadAction<InvoiceItem[]>) => {
        state.status = "succeeded";
        state.invoiceItems = action.payload;
      })
      .addCase(fetchInvoiceItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar Item Invoice.";
      });
  },
});

export const {} = invoiceItemSlice.actions;
export default invoiceItemSlice.reducer;
