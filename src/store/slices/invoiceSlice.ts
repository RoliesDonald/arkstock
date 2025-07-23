// src/store/slices/invoiceSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Invoice, RawInvoiceApiResponse } from "@/types/invoice";
import { api } from "@/lib/utils/api";

export const formatInvoiceDates = (rawInvoice: RawInvoiceApiResponse): Invoice => {
  return {
    ...rawInvoice,
    invoiceDate: new Date(rawInvoice.invoiceDate),
    finishedDate: new Date(rawInvoice.finishedDate),
    createdAt: new Date(rawInvoice.createdAt),
    updatedAt: new Date(rawInvoice.updatedAt),
    // Pastikan relasi workOrder juga diformat jika ada
    workOrder: rawInvoice.workOrder
      ? {
          id: rawInvoice.workOrder.id,
          workOrderNumber: rawInvoice.workOrder.workOrderNumber,
          // Tambahkan properti lain dari WorkOrder yang mungkin Anda butuhkan di frontend
        }
      : undefined,
    // Tambahkan pemetaan untuk relasi lain jika diperlukan (misal: vehicle, accountant, approvedBy)
    vehicle: rawInvoice.vehicle
      ? {
          id: rawInvoice.vehicle.id,
          licensePlate: rawInvoice.vehicle.licensePlate,
          vehicleMake: rawInvoice.vehicle.vehicleMake,
          model: rawInvoice.vehicle.model,
        }
      : undefined,
    accountant: rawInvoice.accountant
      ? {
          id: rawInvoice.accountant.id,
          name: rawInvoice.accountant.name,
          position: rawInvoice.accountant.position, // Ini seharusnya sudah benar sekarang
        }
      : undefined,
    approvedBy: rawInvoice.approvedBy
      ? {
          id: rawInvoice.approvedBy.id,
          name: rawInvoice.approvedBy.name,
          position: rawInvoice.approvedBy.position, // Ini seharusnya sudah benar sekarang
        }
      : undefined,
  };
};

interface InvoiceState {
  invoices: Invoice[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InvoiceState = {
  invoices: [],
  status: "idle",
  error: null,
};

export const fetchInvoices = createAsyncThunk("invoices/fetchInvoices", async (_, { rejectWithValue }) => {
  try {
    // Asumsi API endpoint akan mengembalikan relasi workOrder
    const response = await api.get<RawInvoiceApiResponse[]>("http://localhost:3000/api/invoices");
    return response.map(formatInvoiceDates);
  } catch (error: any) {
    console.error("Error fetching invoices:", error);
    return rejectWithValue(error.message || "Gagal memuat daftar Invoice.");
  }
});

const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInvoices.fulfilled, (state, action: PayloadAction<Invoice[]>) => {
        state.status = "succeeded";
        state.invoices = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar Invoice.";
      });
  },
});

export const {} = invoiceSlice.actions;
export default invoiceSlice.reducer;
