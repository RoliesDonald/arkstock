import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Company, CompanyFormValues, CompanyStatus } from "@/types/companies";
import { api } from "@/lib/utils/api";

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
      const response = await api.get<Company[]>(
        "http://localhost:3000/api/companies"
      );
      const formattedData = response.map((company) => ({
        ...company,
        createdAt: new Date(company.createdAt),
        updatedAt: new Date(company.updatedAt),
      }));
      return formattedData;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Gagal memuat daftar perusahaan."
      );
    }
  }
);

// NEW: Async Thunk untuk mengambil satu perusahaan berdasarkan ID
export const fetchCompanyById = createAsyncThunk(
  "companies/fetchCompanyById",
  async (companyId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<Company>(
        `http://localhost:3000/api/companies/${companyId}`
      );
      // Konversi string tanggal ke objek Date
      return {
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
      } as Company;
    } catch (error: any) {
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
      const response = await api.post<Company>(
        "http://localhost:3000/api/companies",
        newCompanyData
      );
      return {
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
      } as Company;
    } catch (error: any) {
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
      const response = await api.put<Company>(
        `http://localhost:3000/api/companies/${updatedCompanyData.id}`,
        updatedCompanyData
      );
      return {
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
      } as Company;
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal mengupdate perusahaan.");
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
    resetCompanyStatus: (state) => {
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
      // NEW: Handle fetchCompanyById
      .addCase(fetchCompanyById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCompanyById.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.status = "succeeded";
          // Jika perusahaan sudah ada di state, perbarui. Jika tidak, tambahkan.
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

export const { resetCompanyStatus } = companySlice.actions;

export default companySlice.reducer;
