// src/lib/features/workOrders/workOrdersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { WorkOrderFormValues } from "@/types/work-order"; // Pastikan path ini benar

// Definisikan state interface untuk workOrders
interface WorkOrderState {
  workOrders: WorkOrderFormValues[]; // Array work order yang disimpan
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// State awal
const initialState: WorkOrderState = {
  workOrders: [],
  status: "idle",
  error: null,
};

// ===========================================
// DEFINISIKAN createNewWorkOrder DI SINI
// ===========================================
export const createNewWorkOrder = createAsyncThunk(
  "workOrders/createNewWorkOrder",
  async (newWorkOrderData: WorkOrderFormValues, { rejectWithValue }) => {
    try {
      // Simulasikan API call (misal: 2 detik delay)
      // Dalam aplikasi nyata, ini akan menjadi panggilan ke backend API Anda
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Contoh respons yang akan dikembalikan setelah simulasi berhasil
      const response = {
        ...newWorkOrderData,
        id: Date.now().toString(), // Tambahkan ID unik untuk work order yang baru
        createdAt: new Date().toISOString(), // Tambahkan timestamp
      };

      console.log("API Simulation: Work Order created successfully", response);
      return response; // Mengembalikan data yang akan menjadi action.payload.
    } catch (err: any) {
      console.error("API Simulation: Failed to create Work Order", err);
      // Mengembalikan error dengan rejectWithValue agar bisa ditangkap di rejected case
      return rejectWithValue(err.message || "Gagal membuat Work Order");
    }
  }
);
// ===========================================
// AKHIR DEFINISI createNewWorkOrder
// ===========================================

const workOrdersSlice = createSlice({
  name: "workOrders",
  initialState,
  reducers: {
    // Anda bisa menambahkan reducer sinkron di sini jika diperlukan
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewWorkOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        createNewWorkOrder.fulfilled,
        // Penting: PayloadAction harus cocok dengan tipe yang dikembalikan oleh thunk.
        // Jika thunk mengembalikan `WorkOrderFormValues & {id: string, createdAt: string}`,
        // maka di sini juga harus sama.
        (
          state,
          action: PayloadAction<
            WorkOrderFormValues & { id: string; createdAt: string }
          >
        ) => {
          state.status = "succeeded";
          state.workOrders.push(action.payload);
          state.error = null;
        }
      )
      .addCase(createNewWorkOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string; // Payload rejected biasanya string error
      });
  },
});

export const {} = workOrdersSlice.actions; // Ekspor action jika ada, saat ini kosong
export default workOrdersSlice.reducer;
