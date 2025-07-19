// src/store/slices/employeeSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Employee,
  EmployeeFormValues,
  RawEmployeeApiResponse,
} from "@/types/employee";
import { api } from "@/lib/utils/api";
import { formatCompanyDates } from "./companySlice"; // Import formatCompanyDates dari companySlice

interface EmployeeState {
  employees: Employee[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  status: "idle",
  error: null,
};

// Helper function untuk memformat tanggal dari RawEmployeeApiResponse (Date objek) menjadi string ISO
// Ini juga akan memformat company jika disertakan sebagai RawCompanyApiResponse
const formatEmployeeDates = (rawEmployee: RawEmployeeApiResponse): Employee => {
  return {
    // Menggunakan spread operator untuk menyalin semua properti dari rawEmployee
    // Ini termasuk companyId, userId, name, email, dll.
    ...rawEmployee,

    // Kemudian, timpa properti tanggal dengan versi string ISO
    createdAt: rawEmployee.createdAt.toISOString(),
    updatedAt: rawEmployee.updatedAt.toISOString(),
    tanggalLahir: rawEmployee.tanggalLahir
      ? rawEmployee.tanggalLahir.toISOString()
      : null,
    tanggalBergabung: rawEmployee.tanggalBergabung
      ? rawEmployee.tanggalBergabung.toISOString()
      : null,

    // Format relasi company jika ada
    company: rawEmployee.company
      ? formatCompanyDates(rawEmployee.company)
      : null,

    // Tambahkan relasi lain secara eksplisit jika perlu diformat (misal: WorkOrder, Estimation, dll. jika mereka punya Date objek)
    // Contoh:
    // mechanicWorkOrders: rawEmployee.mechanicWorkOrders?.map(wo => ({
    //   ...wo,
    //   date: wo.date.toISOString(),
    //   createdAt: wo.createdAt.toISOString(),
    //   updatedAt: wo.updatedAt.toISOString(),
    // })) || [],
  };
};

// Async Thunk untuk mengambil semua karyawan
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawEmployeeApiResponse[]>(
        "http://localhost:3000/api/employees"
      );
      const formattedData = response.map(formatEmployeeDates);
      return formattedData;
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal memuat daftar karyawan.");
    }
  }
);

// Async Thunk untuk mengambil satu karyawan berdasarkan ID
export const fetchEmployeeById = createAsyncThunk(
  "employees/fetchEmployeeById",
  async (employeeId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<RawEmployeeApiResponse>(
        `http://localhost:3000/api/employees/${employeeId}`
      );
      return formatEmployeeDates(response);
    } catch (error: any) {
      return rejectWithValue(
        error.message || `Gagal memuat detail karyawan dengan ID ${employeeId}.`
      );
    }
  }
);

// Async Thunk untuk membuat karyawan baru
export const createEmployee = createAsyncThunk(
  "employees/createEmployee",
  async (newEmployeeData: EmployeeFormValues, { rejectWithValue }) => {
    try {
      const response = await api.post<RawEmployeeApiResponse>(
        "http://localhost:3000/api/employees",
        newEmployeeData
      );
      return formatEmployeeDates(response);
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal membuat karyawan baru.");
    }
  }
);

// Async Thunk untuk memperbarui karyawan
export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async (updatedEmployeeData: EmployeeFormValues, { rejectWithValue }) => {
    try {
      if (!updatedEmployeeData.id) {
        throw new Error("ID karyawan tidak ditemukan untuk pembaruan.");
      }
      const response = await api.put<RawEmployeeApiResponse>(
        `http://localhost:3000/api/employees/${updatedEmployeeData.id}`,
        updatedEmployeeData
      );
      return formatEmployeeDates(response);
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal memperbarui karyawan.");
    }
  }
);

// Async Thunk untuk menghapus karyawan
export const deleteEmployee = createAsyncThunk(
  "employees/deleteEmployee",
  async (employeeId: string, { rejectWithValue }) => {
    try {
      await api.delete(`http://localhost:3000/api/employees/${employeeId}`);
      return employeeId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal menghapus karyawan.");
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
      // Fetch Employees
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
        state.error =
          (action.payload as string) || "Gagal memuat daftar karyawan.";
      })
      // Fetch Employee By ID
      .addCase(fetchEmployeeById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchEmployeeById.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          state.status = "succeeded";
          const index = state.employees.findIndex(
            (emp) => emp.id === action.payload.id
          );
          if (index !== -1) {
            state.employees[index] = action.payload;
          } else {
            state.employees.push(action.payload);
          }
        }
      )
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Gagal memuat detail karyawan.";
      })
      // Create Employee
      .addCase(createEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        createEmployee.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          state.status = "succeeded";
          state.employees.unshift(action.payload); // Tambahkan ke depan list
        }
      )
      .addCase(createEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Gagal membuat karyawan baru.";
      })
      // Update Employee
      .addCase(updateEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateEmployee.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          state.status = "succeeded";
          const index = state.employees.findIndex(
            (emp) => emp.id === action.payload.id
          );
          if (index !== -1) {
            state.employees[index] = action.payload;
          }
        }
      )
      .addCase(updateEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Gagal memperbarui karyawan.";
      })
      // Delete Employee
      .addCase(deleteEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteEmployee.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.employees = state.employees.filter(
            (emp) => emp.id !== action.payload
          );
        }
      )
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal menghapus karyawan.";
      });
  },
});

export const { resetEmployeeStatus } = employeeSlice.actions;

export default employeeSlice.reducer;
