import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Employee, RawEmployeeApiResponse } from "@/types/employee";
import { api } from "@/lib/utils/api";
import { EmployeeStatus, EmployeeRole, EmployeePosition, Gender } from "@prisma/client"; // Ini aman di slice karena slice berjalan di server/runtime Node.js
import { EmployeeFormValues } from "@/schemas/employee";

export const formatEmployeeDates = (rawEmployee: RawEmployeeApiResponse): Employee => {
  return {
    ...rawEmployee,
    tanggalLahir: rawEmployee.tanggalLahir ? new Date(rawEmployee.tanggalLahir) : null,
    tanggalBergabung: rawEmployee.tanggalBergabung ? new Date(rawEmployee.tanggalBergabung) : null,
    createdAt: new Date(rawEmployee.createdAt),
    updatedAt: new Date(rawEmployee.updatedAt),
    role: rawEmployee.role as EmployeeRole,
    status: rawEmployee.status as EmployeeStatus,
    gender: rawEmployee.gender as Gender,
    position: rawEmployee.position as EmployeePosition | null,
  };
};

interface EmployeeState {
  employees: Employee[];
  currentEmployee: Employee | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  currentEmployee: null,
  status: "idle",
  error: null,
};

export const fetchEmployees = createAsyncThunk("employees/fetchEmployees", async (_, { rejectWithValue }) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null;
    if (!token) {
      return rejectWithValue("Tidak ada token otentikasi. Silakan login kembali.");
    }

    const response = await api.get<RawEmployeeApiResponse[]>("http://localhost:3000/api/employees", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.map(formatEmployeeDates);
  } catch (error: any) {
    console.error("Error fetching employees:", error);
    return rejectWithValue(error.message || "Gagal memuat daftar karyawan.");
  }
});

export const fetchEmployeeById = createAsyncThunk(
  "employees/fetchEmployeeById",
  async (employeeId: string, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null;
      if (!token) {
        return rejectWithValue("Tidak ada token otentikasi. Silakan login kembali.");
      }

      const response = await api.get<RawEmployeeApiResponse>(
        `http://localhost:3000/api/employees/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return formatEmployeeDates(response);
    } catch (error: any) {
      console.error(`Error fetching employee with ID ${employeeId}:`, error);
      return rejectWithValue(error.message || `Gagal memuat karyawan dengan ID ${employeeId}.`);
    }
  }
);

export const createEmployee = createAsyncThunk(
  // KUNCI PERBAIKAN: Thunk baru untuk membuat karyawan
  "employees/createEmployee",
  async (employeeData: EmployeeFormValues, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null;
      if (!token) {
        return rejectWithValue("Tidak ada token otentikasi. Silakan login kembali.");
      }

      const response = await api.post<RawEmployeeApiResponse>(
        "http://localhost:3000/api/employees",
        employeeData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return formatEmployeeDates(response);
    } catch (error: any) {
      console.error(`Error creating employee:`, error);
      return rejectWithValue(error.message || `Gagal membuat karyawan baru.`);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async ({ id, employeeData }: { id: string; employeeData: EmployeeFormValues }, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null;
      if (!token) {
        return rejectWithValue("Tidak ada token otentikasi. Silakan login kembali.");
      }

      const response = await api.put<RawEmployeeApiResponse>(
        `http://localhost:3000/api/employees/${id}`,
        employeeData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return formatEmployeeDates(response);
    } catch (error: any) {
      console.error(`Error updating employee with ID ${id}:`, error);
      return rejectWithValue(error.message || `Gagal memperbarui karyawan dengan ID ${id}.`);
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  // KUNCI PERBAIKAN: Thunk baru untuk menghapus karyawan
  "employees/deleteEmployee",
  async (employeeId: string, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null;
      if (!token) {
        return rejectWithValue("Tidak ada token otentikasi. Silakan login kembali.");
      }

      await api.delete(`http://localhost:3000/api/employees/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return employeeId; // Kembalikan ID yang dihapus untuk pembaruan state
    } catch (error: any) {
      console.error(`Error deleting employee with ID ${employeeId}:`, error);
      return rejectWithValue(error.message || `Gagal menghapus karyawan dengan ID ${employeeId}.`);
    }
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployees.fulfilled, (state, action: PayloadAction<Employee[]>) => {
        state.status = "succeeded";
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar karyawan.";
      })

      .addCase(fetchEmployeeById.pending, (state) => {
        state.status = "loading";
        state.currentEmployee = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.status = "succeeded";
        state.currentEmployee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat detail karyawan.";
        state.currentEmployee = null;
      })

      // KUNCI PERBAIKAN: Handler untuk createEmployee
      .addCase(createEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createEmployee.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.status = "succeeded";
        state.employees.push(action.payload); // Tambahkan karyawan baru ke daftar
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal membuat karyawan.";
      })

      .addCase(updateEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateEmployee.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.status = "succeeded";
        // Update the employee in the list
        const index = state.employees.findIndex((emp) => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        // If the updated employee is the current one, update it too
        if (state.currentEmployee?.id === action.payload.id) {
          state.currentEmployee = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memperbarui karyawan.";
      })

      // KUNCI PERBAIKAN: Handler untuk deleteEmployee
      .addCase(deleteEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteEmployee.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        state.employees = state.employees.filter((emp) => emp.id !== action.payload); // Hapus karyawan dari daftar
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal menghapus karyawan.";
      });
  },
});
export const {} = employeeSlice.actions; // Tetap kosong jika tidak ada reducer sinkron
export default employeeSlice.reducer;
