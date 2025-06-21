// src/store/slices/companySlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Company, CompanyFormValues } from "@/types/companies"; // Pastikan path ke types/company benar
import { companyData as initialCompanyData } from "@/data/sampleCompanyData"; // Data awal
import { v4 as uuidv4 } from "uuid"; // Untuk ID baru

// Definisikan interface untuk state perusahaan
interface CompanyState {
  companies: Company[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Inisialisasi state awal
const initialState: CompanyState = {
  companies: initialCompanyData, // Menggunakan data dummy sebagai state awal
  status: "idle",
  error: null,
};

export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    //fetch ke API nyata:
    // const response = await api.get('/companies');
    // return response.data;
    return initialCompanyData; // Untuk saat ini, kembalikan data dummy
  }
);

// Async Thunk untuk menambahkan perusahaan baru
export const createCompany = createAsyncThunk(
  "companies/createCompany",
  async (newCompanyData: CompanyFormValues, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulasi API call
      const newCompany: Company = {
        ...(newCompanyData as Company),
        id: uuidv4(), // Generate UUID baru
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        taxRegistered: newCompanyData.taxRegistered ?? false,
        status: newCompanyData.status ?? "Active",
        companyEmail: newCompanyData.companyEmail || null,
        logo: newCompanyData.logo || null,
        contact: newCompanyData.contact || null,
        address: newCompanyData.address || null,
        city: newCompanyData.city || null,
        phone: newCompanyData.phone || null,
      };
      // POST ke API nyata:
      // const response = await api.post('/companies', newCompany);
      // return response.data;
      return newCompany; // Untuk saat ini, kembalikan objek perusahaan baru
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal membuat perusahaan baru");
    }
  }
);

// Async Thunk untuk memperbarui perusahaan
export const updateCompany = createAsyncThunk(
  "companies/updateCompany",
  async (updatedCompanyData: Company, { rejectWithValue }) => {
    // Menerima Company lengkap
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulasi API call
      //  PUT/PATCH ke API nyata:
      // const response = await api.put(`/companies/${updatedCompanyData.id}`, updatedCompanyData);
      // return response.data;
      return {
        ...updatedCompanyData,
        updatedAt: new Date().toISOString(),
      } as Company; // Perbarui updatedAt
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal mengupdate perusahaan");
    }
  }
);

// Async Thunk untuk menghapus perusahaan
export const deleteCompany = createAsyncThunk(
  "companies/deleteCompany",
  async (companyId: string, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulasi API call
      // DELETE ke API nyata:
      // await api.delete(`/companies/${companyId}`);
      return companyId; // Untuk saat ini, kembalikan ID perusahaan yang dihapus
    } catch (error: any) {
      return rejectWithValue(error.message || "Gagal menghapus perusahaan");
    }
  }
);

const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    // Reducer sinkron jika diperlukan (misalnya untuk mereset status)
    resetCompanyStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Companies
      .addCase(fetchCompanies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCompanies.fulfilled,
        (state, action: PayloadAction<Company[]>) => {
          state.status = "succeeded";
          state.companies = action.payload; // Perbarui state dengan data yang diambil
        }
      )
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Gagal memuat daftar perusahaan";
      })
      // Create Company
      .addCase(createCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        createCompany.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.status = "succeeded";
          state.companies.unshift(action.payload); // Tambahkan perusahaan baru ke depan array
        }
      )
      .addCase(createCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal membuat perusahaan";
      })
      // Update Company
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
            state.companies[index] = action.payload; // Perbarui objek perusahaan
          }
        }
      )
      .addCase(updateCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Gagal mengupdate perusahaan";
      })
      // Delete Company
      .addCase(deleteCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteCompany.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.companies = state.companies.filter(
            (c) => c.id !== action.payload
          ); // Hapus perusahaan dari state
        }
      )
      .addCase(deleteCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Gagal menghapus perusahaan";
      });
  },
});

export const { resetCompanyStatus } = companySlice.actions;

export default companySlice.reducer;
