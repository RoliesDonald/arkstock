// src/store/slices/employeeSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Employee, RawEmployeeApiResponse } from "@/types/employee";
import { api } from "@/lib/utils/api";
import { EmployeeStatus, EmployeeRole, Gender } from "@prisma/client"; // <--- IMPORT GENDER DARI @PRISMA/CLIENT

export const formatEmployeeDates = (rawEmployee: RawEmployeeApiResponse): Employee => {
  return {
    ...rawEmployee,
    tanggalLahir: rawEmployee.tanggalLahir ? new Date(rawEmployee.tanggalLahir) : null,
    tanggalBergabung: rawEmployee.tanggalBergabung ? new Date(rawEmployee.tanggalBergabung) : null,
    createdAt: new Date(rawEmployee.createdAt),
    updatedAt: new Date(rawEmployee.updatedAt),
    role: rawEmployee.role as EmployeeRole,
    status: rawEmployee.status as EmployeeStatus,
    gender: rawEmployee.gender as Gender, // Konversi string ke Gender Enum dari @prisma/client
  };
};

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

export const fetchEmployees = createAsyncThunk("employees/fetchEmployees", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<RawEmployeeApiResponse[]>("http://localhost:3000/api/employees");
    return response.map(formatEmployeeDates);
  } catch (error: any) {
    console.error("Error fetching employees:", error);
    return rejectWithValue(error.message || "Gagal memuat daftar karyawan.");
  }
});

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
      });
  },
});

export const {} = employeeSlice.actions;
export default employeeSlice.reducer;
