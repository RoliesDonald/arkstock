import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InvoiceService, RawInvoiceServiceApiResponse } from "@/types/invoiceServices";
import { api } from "@/lib/utils/api";

export const formatInvoiceServiceDates = (rawIs: RawInvoiceServiceApiResponse): InvoiceService => {
  return {
    ...rawIs,
    createdAt: new Date(rawIs.createdAt),
    updatedAt: new Date(rawIs.updatedAt),
    // Relasi akan di-map jika disertakan dalam respons API
    invoice: rawIs.invoice
      ? {
          id: rawIs.invoice.id,
          invoiceNumber: rawIs.invoice.invoiceNumber,
        }
      : undefined,
    service: rawIs.service
      ? {
          id: rawIs.service.id,
          name: rawIs.service.name,
          price: rawIs.service.price,
        }
      : undefined,
  };
};

interface InvoiceServiceState {
  invoiceServices: InvoiceService[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InvoiceServiceState = {
  invoiceServices: [],
  status: "idle",
  error: null,
};

export const fetchInvoiceServices = createAsyncThunk(
  "invoiceServices/fetchInvoiceServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawInvoiceServiceApiResponse[]>(
        "http://localhost:3000/api/invoice-services"
      );
      return response.map(formatInvoiceServiceDates);
    } catch (error: any) {
      console.error("Error fetching invoice services:", error);
      return rejectWithValue(error.message || "Gagal memuat daftar Jasa Invoice.");
    }
  }
);

const invoiceServiceSlice = createSlice({
  name: "invoiceServices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoiceServices.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInvoiceServices.fulfilled, (state, action: PayloadAction<InvoiceService[]>) => {
        state.status = "succeeded";
        state.invoiceServices = action.payload;
      })
      .addCase(fetchInvoiceServices.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar Jasa Invoice.";
      });
  },
});

export const {} = invoiceServiceSlice.actions;
export default invoiceServiceSlice.reducer;
