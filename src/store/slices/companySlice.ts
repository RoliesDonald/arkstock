import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Company,
  CompanyFormValues,
  RawCompanyApiResponse,
  CompanyNameAndId,
  CompanyRole,
} from "@/types/companies";
import { api } from "@/lib/utils/api";

// Fungsi helper utama untuk memformat tanggal di objek Company
export const formatCompanyDates = (
  rawCompany: RawCompanyApiResponse
): Company => {
  return {
    ...rawCompany,
    createdAt: new Date(rawCompany.createdAt).toISOString(),
    updatedAt: new Date(rawCompany.updatedAt).toISOString(),
    parentCompany: rawCompany.parentCompany
      ? formatCompanyDates(rawCompany.parentCompany)
      : null, // Corrected typo from childComapnies to childCompanies
    childCompanies: rawCompany.childCompanies?.map(formatCompanyDates) || [],
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

export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawCompanyApiResponse[]>(
        "http://localhost:3000/api/companies"
      );
      const formattedData = response.map(formatCompanyDates);
      return formattedData;
    } catch (error: any) {
      console.error("Error fetching companies:", error);
      return rejectWithValue(
        error.message || "Gagal memuat daftar perusahaan."
      );
    }
  }
);

export const fetchCompanyById = createAsyncThunk(
  "companies/fetchCompanyById",
  async (companyId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<RawCompanyApiResponse>(
        `http://localhost:3000/api/companies/${companyId}`
      );
      return formatCompanyDates(response);
    } catch (error: any) {
      console.error("Error fetching company by ID:", error);
      return rejectWithValue(
        error.message ||
          `Gagal memuat detail perusahaan dengan ID ${companyId}.`
      );
    }
  }
);

export const createCompany = createAsyncThunk(
  "companies/createCompany",
  async (newCompanyData: CompanyFormValues, { rejectWithValue }) => {
    try {
      const payload = {
        ...newCompanyData,
        parentCompanyId:
          newCompanyData.companyRole === CompanyRole.MAIN_COMPANY
            ? null
            : newCompanyData.parentCompanyId || null, // Pastikan string kosong jadi null
      };
      delete (payload as any).companyRole; // Hati-hati dengan type assertion 'any'

      const response = await api.post<RawCompanyApiResponse>(
        "http://localhost:3000/api/companies",
        payload
      );
      return formatCompanyDates(response);
    } catch (error: any) {
      console.error("Error creating company:", error);
      return rejectWithValue(error.message || "Gagal membuat perusahaan baru.");
    }
  }
);

export const updateCompany = createAsyncThunk(
  "companies/updateCompany",
  async (updatedCompanyData: CompanyFormValues, { rejectWithValue }) => {
    try {
      if (!updatedCompanyData.id) {
        throw new Error("ID perusahaan tidak ditemukan untuk pembaruan.");
      }
      const payload = {
        ...updatedCompanyData,
        // Pastikan parentCompanyId adalah null jika companyRole adalah MAIN_COMPANY
        parentCompanyId:
          updatedCompanyData.companyRole === CompanyRole.MAIN_COMPANY
            ? null
            : updatedCompanyData.parentCompanyId || null, // Pastikan string kosong jadi null
      };
      // Hapus companyRole dari payload sebelum dikirim ke API jika API tidak mengharapkannya
      delete (payload as any).companyRole; // Hati-hati dengan type assertion 'any'

      const response = await api.put<RawCompanyApiResponse>(
        `http://localhost:3000/api/companies/${updatedCompanyData.id}`,
        payload
      );
      return formatCompanyDates(response);
    } catch (error: any) {
      console.error("Error updating company:", error);
      return rejectWithValue(error.message || "Gagal memperbarui perusahaan.");
    }
  }
);

export const deleteCompany = createAsyncThunk(
  "companies/deleteCompany",
  async (companyId: string, { rejectWithValue }) => {
    try {
      await api.delete(`http://localhost:3000/api/companies/${companyId}`);
      return companyId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal menghapus perusahaan.");
    }
  }
);

const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    resetCompaniesStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCompanies.fulfilled,
        (state, action: PayloadAction<Company[]>) => {
          state.status = "succeeded";
          state.companies = action.payload;
        }
      )
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Gagal memuat daftar perusahaan.";
      })
      .addCase(fetchCompanyById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCompanyById.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.status = "succeeded";
          const index = state.companies.findIndex(
            (c) => c.id === action.payload.id
          );
          if (index !== -1) {
            state.companies[index] = action.payload;
          } else {
            state.companies.push(action.payload);
          }
        }
      )
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Gagal memuat detail perusahaan.";
      })
      .addCase(createCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        createCompany.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.status = "succeeded";
          state.companies.unshift(action.payload);
        }
      )
      .addCase(createCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal membuat perusahaan.";
      })
      .addCase(updateCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateCompany.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.status = "succeeded";
          const index = state.companies.findIndex(
            (c) => c.id === action.payload.id
          );
          if (index !== -1) {
            state.companies[index] = action.payload;
          }
        }
      )
      .addCase(updateCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Gagal mengupdate perusahaan.";
      })
      .addCase(deleteCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteCompany.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.companies = state.companies.filter(
            (c) => c.id !== action.payload
          );
        }
      )
      .addCase(deleteCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Gagal menghapus perusahaan.";
      });
  },
});
export const { resetCompaniesStatus } = companySlice.actions;

export default companySlice.reducer;
