import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Employee, EmployeeFormValues } from "@/types/employee"; // Pastikan path ke types/employee benar
import { employeeData as initialEmployeeData } from "@/data/sampleEmployeeData"; // Data awal
import { v4 as uuidv4 } from "uuid"; // Untuk ID baru

// Definisikan interface untuk state karyawan
interface EmployeeState {
  employees: Employee[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Inisialisasi state awal
const initialState: EmployeeState = {
  employees: initialEmployeeData, // Menggunakan data dummy sebagai state awal
  status: "idle",
  error: null,
};

// Async Thunk untuk mengambil semua karyawan (simulasi API call)
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return initialEmployeeData; // Untuk saat ini, kembalikan data dummy
  }
);

// Async Thunk untuk menambahkan karyawan baru
export const createEmployee = createAsyncThunk(
  "employees/createEmployee",
  async (newEmployeeData: EmployeeFormValues, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulasi API call
      const newEmployee: Employee = {
        id: uuidv4(), // Generate UUID baru
        name: newEmployeeData.name,
        email: newEmployeeData.email || null, // Pastikan email adalah string atau null
        phone: newEmployeeData.phone,
        address: newEmployeeData.address,
        position: newEmployeeData.position,
        role: newEmployeeData.role,
        status: newEmployeeData.status,
        tanggalLahir: newEmployeeData.tanggalLahir,
        tanggalBergabung: newEmployeeData.tanggalBergabung || null, // Pastikan Date atau null
        currentCompanyId: newEmployeeData.currentCompanyId || null, // Pastikan string atau null
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return newEmployee;
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal membuat karyawan baru");
    }
  }
);

// Async Thunk untuk memperbarui karyawan
export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async (updatedEmployeeData: Employee, { rejectWithValue }) => {
    // Menerima Employee lengkap
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulasi API call
      return { ...updatedEmployeeData, updatedAt: new Date() } as Employee; // Perbarui updatedAt
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal mengupdate karyawan");
    }
  }
);

// Async Thunk untuk menghapus karyawan
export const deleteEmployee = createAsyncThunk(
  "employees/deleteEmployee",
  async (employeeId: string, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulasi API call
      return employeeId; // Untuk saat ini, kembalikan ID karyawan yang dihapus
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal menghapus karyawan");
    }
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    resetEmployeeStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchEmployees.fulfilled,
        (state, action: PayloadAction<Employee[]>) => {
          state.status = "succeeded";
          state.employees = action.payload;
        }
      )
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Gagal memuat daftar karyawan";
      })
      .addCase(createEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        createEmployee.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          state.status = "succeeded";
          state.employees.unshift(action.payload);
        }
      )
      .addCase(createEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal membuat karyawan";
      })
      .addCase(updateEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateEmployee.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          state.status = "succeeded";
          const index = state.employees.findIndex(
            (e) => e.id === action.payload.id
          );
          if (index !== -1) {
            state.employees[index] = action.payload;
          }
        }
      )
      .addCase(updateEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal mengupdate karyawan";
      })
      .addCase(deleteEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteEmployee.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.employees = state.employees.filter(
            (e) => e.id !== action.payload
          );
        }
      )
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal menghapus karyawan";
      });
  },
});

export const { resetEmployeeStatus } = employeeSlice.actions;

export default employeeSlice.reducer;
