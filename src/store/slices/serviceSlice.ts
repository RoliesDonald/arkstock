import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Service, ServiceFormValues } from "@/types/services";
import { PartVariant, SparePart } from "@/types/sparepart"; // Import SparePart type
import { v4 as uuidv4 } from "uuid"; // Untuk menghasilkan ID unik

// Data dummy untuk spare parts (untuk simulasi pemilihan di dialog)
// Ini harusnya diambil dari sparePartSlice Anda
const dummySpareParts: SparePart[] = [
  {
    id: "sp-1",
    sku: "SKU-001",
    name: "Oli Mesin 1L",
    partNumber: "OL-001",
    price: 75000,
    stock: 100,
    initialStock: 100,
    unit: "Liter",
    variant: PartVariant.OEM,
    brand: "BrandA",
    manufacturer: "ManufacturerA",
    compatibility: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sp-2",
    sku: "SKU-002",
    name: "Filter Udara",
    partNumber: "FU-002",
    price: 50000,
    stock: 80,
    initialStock: 80,
    unit: "Unit",
    variant: PartVariant.AFTERMARKET,
    brand: "BrandB",
    manufacturer: "ManufacturerB",
    compatibility: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sp-3",
    sku: "SKU-003",
    name: "Busi Iridium",
    partNumber: "BI-003",
    price: 120000,
    stock: 50,
    initialStock: 50,
    unit: "Unit",
    variant: PartVariant.OEM,
    brand: "BrandC",
    manufacturer: "ManufacturerC",
    compatibility: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sp-4",
    sku: "SKU-004",
    name: "Aki 12V 45Ah",
    partNumber: "AK-004",
    price: 850000,
    stock: 30,
    initialStock: 30,
    unit: "Unit",
    variant: PartVariant.GBOX,
    brand: "BrandD",
    manufacturer: "ManufacturerD",
    compatibility: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sp-5",
    sku: "SKU-005",
    name: "Kampas Rem Depan",
    partNumber: "KD-005",
    price: 130000,
    stock: 70,
    initialStock: 70,
    unit: "Set",
    variant: PartVariant.AFTERMARKET,
    brand: "BrandE",
    manufacturer: "ManufacturerE",
    compatibility: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sp-6",
    sku: "SKU-006",
    name: "Radiator Coolant 1L",
    partNumber: "RC-006",
    price: 60000,
    stock: 90,
    initialStock: 90,
    unit: "Liter",
    variant: PartVariant.OEM,
    brand: "BrandF",
    manufacturer: "ManufacturerF",
    compatibility: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sp-7",
    sku: "SKU-007",
    name: "V-Belt",
    partNumber: "VB-007",
    price: 95000,
    stock: 40,
    initialStock: 40,
    unit: "Unit",
    variant: PartVariant.AFTERMARKET,
    brand: "BrandG",
    manufacturer: "ManufacturerG",
    compatibility: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Data dummy untuk jasa
const initialServices: Service[] = [
  {
    id: "svc-1",
    serviceName: "Service Berkala 10.000 KM",
    category: "Perawatan Rutin",
    subCategory: "Service Ringan",
    description:
      "Pengecekan dan penggantian oli, filter oli, dan filter udara.",
    unitPrice: 350000,
    tasks: [
      "Pengecekan sistem pengereman",
      "Penggantian oli mesin",
      "Penggantian filter oli",
      "Pembersihan filter udara",
      "Pengecekan cairan-cairan (minyak rem, air radiator, dll)",
      "Pengecekan lampu-lampu dan klakson",
      "Pengecekan tekanan ban",
    ],
    requiredSpareParts: [
      { sparePartId: "sp-1", quantity: 4 }, // Contoh: 4 liter oli
      { sparePartId: "sp-2", quantity: 1 }, // Contoh: 1 filter oli
    ],
    createdAt: new Date("2024-01-15T10:00:00Z"),
    updatedAt: new Date("2024-01-15T10:00:00Z"),
  },
  {
    id: "svc-2",
    serviceName: "Ganti Kampas Rem Depan",
    category: "Perbaikan",
    subCategory: "Sistem Rem",
    description:
      "Penggantian kampas rem depan untuk satu set (kiri dan kanan).",
    unitPrice: 150000,
    tasks: [
      "Pembongkaran roda depan",
      "Pelepasan kaliper rem",
      "Penggantian kampas rem",
      "Pembersihan komponen rem",
      "Pemasangan kembali kaliper dan roda",
      "Pengecekan minyak rem",
    ],
    requiredSpareParts: [
      { sparePartId: "sp-4", quantity: 1 }, // Contoh: 1 set kampas rem depan
    ],
    createdAt: new Date("2024-02-20T11:30:00Z"),
    updatedAt: new Date("2024-02-20T11:30:00Z"),
  },
  {
    id: "svc-3",
    serviceName: "Spooring & Balancing",
    category: "Perawatan Rutin",
    subCategory: "Sistem Roda",
    description: "Penyelarasan roda dan penyeimbangan ban.",
    unitPrice: 200000,
    tasks: [
      "Pengecekan kondisi ban dan velg",
      "Penyelarasan sudut roda (spooring)",
      "Penyeimbangan ban (balancing)",
      "Pengecekan tekanan ban",
    ],
    requiredSpareParts: [], // Tidak memerlukan spare part khusus
    createdAt: new Date("2024-03-01T09:00:00Z"),
    updatedAt: new Date("2024-03-01T09:00:00Z"),
  },
];

interface ServiceState {
  services: Service[];
  availableSpareParts: SparePart[]; // Tambahkan ini untuk spare parts yang tersedia
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  availableSpareParts: [], // Inisialisasi kosong
  status: "idle",
  error: null,
};

// Async Thunks
export const fetchServices = createAsyncThunk(
  "services/fetchServices",
  async () => {
    // Simulasikan panggilan API
    return new Promise<Service[]>((resolve) => {
      setTimeout(() => {
        resolve(initialServices);
      }, 500); // Penundaan 500ms
    });
  }
);

export const fetchAvailableSpareParts = createAsyncThunk(
  "services/fetchAvailableSpareParts",
  async () => {
    // Simulasikan panggilan API untuk mendapatkan daftar spare parts
    return new Promise<SparePart[]>((resolve) => {
      setTimeout(() => {
        resolve(dummySpareParts); // Gunakan dummySpareParts
      }, 300);
    });
  }
);

export const addService = createAsyncThunk(
  "services/addService",
  async (newServiceData: ServiceFormValues) => {
    // Simulasikan panggilan API untuk menambahkan jasa
    return new Promise<Service>((resolve) => {
      setTimeout(() => {
        const newService: Service = {
          id: uuidv4(), // Hasilkan ID unik
          ...newServiceData,
          unitPrice: Number(newServiceData.unitPrice), // Pastikan ini number
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        initialServices.push(newService); // Tambahkan ke data dummy
        resolve(newService);
      }, 500);
    });
  }
);

export const updateService = createAsyncThunk(
  "services/updateService",
  async (updatedServiceData: Service) => {
    // Simulasikan panggilan API untuk memperbarui jasa
    return new Promise<Service>((resolve, reject) => {
      setTimeout(() => {
        const index = initialServices.findIndex(
          (s) => s.id === updatedServiceData.id
        );
        if (index !== -1) {
          const existingService = initialServices[index];
          initialServices[index] = {
            ...existingService,
            ...updatedServiceData,
            unitPrice: Number(updatedServiceData.unitPrice),
            updatedAt: new Date(),
          };
          resolve(initialServices[index]);
        } else {
          reject(new Error("Jasa tidak ditemukan"));
        }
      }, 500);
    });
  }
);

export const deleteService = createAsyncThunk(
  "services/deleteService",
  async (serviceId: string) => {
    // Simulasikan panggilan API untuk menghapus jasa
    return new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        const initialLength = initialServices.length;
        const filteredServices = initialServices.filter(
          (s) => s.id !== serviceId
        );
        if (filteredServices.length < initialLength) {
          // Update initialServices reference
          initialServices.splice(
            0,
            initialServices.length,
            ...filteredServices
          );
          resolve(serviceId);
        } else {
          reject(new Error("Jasa tidak ditemukan"));
        }
      }, 500);
    });
  }
);

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchServices.fulfilled,
        (state, action: PayloadAction<Service[]>) => {
          state.status = "succeeded";
          state.services = action.payload;
        }
      )
      .addCase(fetchServices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Gagal memuat jasa";
      })
      .addCase(
        fetchAvailableSpareParts.fulfilled,
        (state, action: PayloadAction<SparePart[]>) => {
          state.availableSpareParts = action.payload;
        }
      )
      .addCase(
        addService.fulfilled,
        (state, action: PayloadAction<Service>) => {
          state.services.push(action.payload);
        }
      )
      .addCase(
        updateService.fulfilled,
        (state, action: PayloadAction<Service>) => {
          const index = state.services.findIndex(
            (service) => service.id === action.payload.id
          );
          if (index !== -1) {
            state.services[index] = action.payload;
          }
        }
      )
      .addCase(
        deleteService.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.services = state.services.filter(
            (service) => service.id !== action.payload
          );
        }
      );
  },
});

export default serviceSlice.reducer;
