// src/store/slices/CompanySlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Company, RawCompanyApiResponse } from "@/types/companies";
import { api } from "@/lib/utils/api";
import { CompanyType, CompanyStatus, CompanyRole } from "@prisma/client"; // Import Enums dari Prisma

export const formatCompanyDates = (rawCompany: RawCompanyApiResponse): Company => {
  return {
    ...rawCompany,
    createdAt: new Date(rawCompany.createdAt),
    updatedAt: new Date(rawCompany.updatedAt),
    companyType: rawCompany.companyType as CompanyType,
    status: rawCompany.status as CompanyStatus,
    companyRole: rawCompany.companyRole as CompanyRole,
  };
};

interface CompanyState {
  companies: Company[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CompanyState = {
  companies: [],
  status: "idle",
  error: null,
};

export const fetchCompanies = createAsyncThunk("companies/fetchCompanies", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<RawCompanyApiResponse[]>("http://localhost:3000/api/companies");
    return response.map(formatCompanyDates);
  } catch (error: any) {
    console.error("Error fetching companies:", error);
    return rejectWithValue(error.message || "Gagal memuat daftar perusahaan.");
  }
});

const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompanies.fulfilled, (state, action: PayloadAction<Company[]>) => {
        state.status = "succeeded";
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat daftar perusahaan.";
      });
  },
});

export const {} = companySlice.actions;
export default companySlice.reducer;
