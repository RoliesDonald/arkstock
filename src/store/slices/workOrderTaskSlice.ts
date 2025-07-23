import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkOrderTask, RawWorkOrderTaskApiResponse } from "@/types/workOrderTasks";
import { api } from "@/lib/utils/api";

export const formatWorkOrderTaskDates = (rawWot: RawWorkOrderTaskApiResponse): WorkOrderTask => {
  return {
    ...rawWot,
    startTime: rawWot.startTime ? new Date(rawWot.startTime) : null,
    endTime: rawWot.endTime ? new Date(rawWot.endTime) : null,
    createdAt: new Date(rawWot.createdAt),
    updatedAt: new Date(rawWot.updatedAt),
    // Relasi akan di-map jika disertakan dalam respons API
    workOrder: rawWot.workOrder
      ? {
          id: rawWot.workOrder.id,
          workOrderNumber: rawWot.workOrder.workOrderNumber,
        }
      : undefined,
    assignedTo: rawWot.assignedTo
      ? {
          id: rawWot.assignedTo.id,
          name: rawWot.assignedTo.name,
          position: rawWot.assignedTo.position,
        }
      : undefined,
  };
};

interface WorkOrderTaskState {
  workOrderTasks: WorkOrderTask[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WorkOrderTaskState = {
  workOrderTasks: [],
  status: "idle",
  error: null,
};

export const fetchWorkOrderTasks = createAsyncThunk(
  "workOrderTasks/fetchWorkOrderTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawWorkOrderTaskApiResponse[]>(
        "http://localhost:3000/api/work-order-tasks"
      );
      return response.map(formatWorkOrderTaskDates);
    } catch (error: any) {
      console.error("Error fetching work order tasks:", error);
      return rejectWithValue(error.message || "Gagal memuat daftar Tugas Work Order.");
    }
  }
);

const workOrderTaskSlice = createSlice({
  name: "workOrderTasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkOrderTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWorkOrderTasks.fulfilled, (state, action: PayloadAction<WorkOrderTask[]>) => {
        state.status = "succeeded";
        state.workOrderTasks = action.payload;
      })
      .addCase(fetchWorkOrderTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar Tugas Work Order.";
      });
  },
});

export const {} = workOrderTaskSlice.actions;
export default workOrderTaskSlice.reducer;
