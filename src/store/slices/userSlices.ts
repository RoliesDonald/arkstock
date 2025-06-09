import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role: string; // ["AdminUser", "PIC", "Manager", "Staf", "SuperAdmin"]
  bengkelId?: string;
  rentalCompanyId?: string;
  fleetCompanyId?: string;
  companyType?: string;
  employeeId?: string;
  warehouseId?: string;
}

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: {
    id: "mock-admin-id-123",
    name: "Mock Admin User",
    email: "admin@example.com",
    role: "SuperAdmin",
    bengkelId: "BENGKEL001",
    rentalCompanyId: "RENTAL001",
    fleetCompanyId: "FLEET001",
    companyType: "SERVICE_MAINTENANCE", // <-- Contoh PENAMBAHAN VALUE
    // Sesuaikan companyType dengan enum yang Anda gunakan di aplikasi Anda.
    // Contoh: "INTERNAL", "SERVICE_MAINTENANCE", "FLEET_COMPANY", "RENTAL_COMPANY"
  },
  isAuthenticated: true,
  loading: false,
  error: null,
};

/*
// Jika Anda ingin menguji role lain, uncomment salah satu di bawah:

// Untuk Role Bengkel
const initialState: UserState = {
  currentUser: {
    id: 'mock-bengkel-id-456',
    name: 'Mock Bengkel User',
    email: 'bengkel@example.com',
    role: 'Bengkel',
    bengkelId: 'bengkel-alpha-1', // Tambahkan ID bengkel jika relevan
    rentalCompanyId:'RENTAL002',
    companyType: ''

  },
  isAuthenticated: true,
  loading: false,
  error: null,
};

// Untuk Role Perusahaan Rental
const initialState: UserState = {
  currentUser: {
    id: 'mock-rental-id-789',
    name: 'Mock Rental User',
    email: 'rental@example.com',
    role: 'RentalCompany',
    rentalCompanyId: 'rental-zeta-1', // Tambahkan ID rental jika relevan
  },
  isAuthenticated: true,
  loading: false,
  error: null,
};

// Untuk Role Customer (dari perusahaan rental)
const initialState: UserState = {
  currentUser: {
    id: 'mock-customer-id-010',
    name: 'Mock Customer User',
    email: 'customer@example.com',
    role: 'Customer',
    rentalCompanyId: 'rental-zeta-1', // Customer terhubung ke perusahaan rental mana
  },
  isAuthenticated: true,
  loading: false,
  error: null,
};

// Jika Anda ingin menguji saat TIDAK LOGIN (akses ditolak)
const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};
*/

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action untuk memulai proses login/memuat data user
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Action untuk ketika user berhasil login/data termuat
    loginSuccess: (state, action: PayloadAction<UserState["currentUser"]>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.currentUser = action.payload;
      state.error = null;
    },
    // Action untuk ketika login/pemuaian data gagal
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.currentUser = null;
      state.error = action.payload;
    },
    // Action untuk logout
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  userSlice.actions;
export default userSlice.reducer;
