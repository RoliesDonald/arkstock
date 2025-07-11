import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Estimation,
  EstimationFormValues,
  EstimationStatus,
  EstimationItem,
  EstimationService,
} from "@/types/estimation";
import { PartVariant, SparePart } from "@/types/sparepart"; // Untuk data spare part dummy
import { Service } from "@/types/services"; // Untuk data service dummy
import {
  Vehicle,
  VehicleCategory,
  VehicleFuelType,
  VehicleStatus,
  VehicleTransmissionType,
  VehicleType,
} from "@/types/vehicle"; // Untuk data vehicle dummy
import { Company, CompanyType } from "@/types/companies"; // Untuk data company dummy
import { Employee, EmployeeRole, EmployeeStatus } from "@/types/employee"; // Untuk data employee dummy
import { v4 as uuidv4 } from "uuid";

// --- Data Dummy yang Lebih Lengkap (Sesuaikan dengan data master Anda) ---
// Asumsi data master ini sudah ada atau akan diambil dari slice masing-masing
const dummyVehicles: Vehicle[] = [
  {
    id: "veh-1",
    licensePlate: "B 1234 ABC",
    vehicleMake: "TOYOTA",
    model: "AVANZA",
    color: "Hitam",
    yearMade: 2020,
    chassisNum: "MHK123XYZ4567890",
    engineNum: "1NRVE123456",
    ownerId: "comp-1",
    createdAt: new Date(),
    updatedAt: new Date(),
    trimLevel: null,
    vinNum: null,
    vehicleType: VehicleType.PASSENGER,
    vehicleCategory: VehicleCategory.MPV,
    fuelType: VehicleFuelType.GASOLINE,
    transmissionType: VehicleTransmissionType.AUTOMATIC,
    lastOdometer: 50000,
    lastServiceDate: new Date(),
    status: VehicleStatus.ACTIVE,
    notes: null,
    carUserId: null,
  },
  {
    id: "veh-2",
    licensePlate: "D 5678 EFG",
    vehicleMake: "HONDA",
    model: "JAZZ",
    color: "Merah",
    yearMade: 2018,
    chassisNum: "MHF987XYZ6543210",
    engineNum: "L15A789012",
    ownerId: "comp-2",
    createdAt: new Date(),
    updatedAt: new Date(),
    trimLevel: null,
    vinNum: null,
    vehicleType: VehicleType.PASSENGER,
    vehicleCategory: VehicleCategory.HATCHBACK,
    fuelType: VehicleFuelType.GASOLINE,
    transmissionType: VehicleTransmissionType.AUTOMATIC,
    lastOdometer: 60000,
    lastServiceDate: new Date(),
    status: VehicleStatus.ACTIVE,
    notes: null,
    carUserId: null,
  },
];

const dummyCompanies: Company[] = [
  {
    id: "comp-1",
    companyName: "Pelanggan A",
    companyId: "CUST-001",
    address: "Jl. Contoh No. 1, Jakarta",
    phone: "08111222333",
    companyEmail: "a@example.com",
    contact: "Bapak Joni",
    taxRegistered: false,
    companyType: CompanyType.CUSTOMER,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "comp-2",
    companyName: "Pelanggan B",
    companyId: "CUST-002",
    address: "Jl. Raya No. 5, Bandung",
    phone: "08123456789",
    companyEmail: "b@example.com",
    contact: "Ibu Ani",
    taxRegistered: false,
    companyType: CompanyType.CUSTOMER,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const dummyEmployees: Employee[] = [
  {
    id: "emp-1",
    name: "Budi Setiawan",
    position: "Service Advisor",
    email: "budi@example.com",
    phoneNumber: "08111111111",
    createdAt: new Date(),
    updatedAt: new Date(),
    address: "",
    role: EmployeeRole.SUPER_ADMIN,
    status: EmployeeStatus.ACTIVE,
    tanggalLahir: new Date(),
    tanggalBergabung: null,
    currentCompanyId: null,
  },
  {
    id: "emp-2",
    name: "Dian Permata",
    position: "Service Advisor",
    email: "dian@example.com",
    phoneNumber: "08222222222",
    createdAt: new Date(),
    updatedAt: new Date(),
    address: "",
    role: EmployeeRole.SUPER_ADMIN,
    status: EmployeeStatus.ACTIVE,
    tanggalLahir: new Date(),
    tanggalBergabung: null,
    currentCompanyId: null,
  },
  {
    id: "emp-3",
    name: "Joko Mulyante",
    position: "Mechanic",
    email: "joko@example.com",
    phoneNumber: "08333333333",
    createdAt: new Date(),
    updatedAt: new Date(),
    address: "",
    role: EmployeeRole.SUPER_ADMIN,
    status: EmployeeStatus.ACTIVE,
    tanggalLahir: new Date(),
    tanggalBergabung: null,
    currentCompanyId: null,
  },
];

const dummySpareParts: SparePart[] = [
  {
    id: "sp-1",
    sku: "OL-001",
    itemName: "Oli Mesin 4L",
    partNumber: "OL-001",
    unit: "Liter",
    stock: 100,
    initialStock: 100,
    minStock: 10,
    price: 300000,
    variant: PartVariant.OEM,
    brand: "Castrol",
    manufacturer: "Castrol",
    compatibility: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sp-2",
    sku: "FU-001",
    itemName: "Filter Udara",
    partNumber: "FU-001",
    unit: "Pcs",
    stock: 50,
    initialStock: 50,
    minStock: 5,
    price: 80000,
    variant: PartVariant.AFTERMARKET,
    brand: "Sakura",
    manufacturer: "Sakura",
    compatibility: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sp-3",
    sku: "KRD-001",
    itemName: "Kampas Rem Depan",
    partNumber: "KRD-001",
    unit: "Set",
    stock: 40,
    initialStock: 40,
    minStock: 5,
    price: 250000,
    variant: PartVariant.OEM,
    brand: "Aisin",
    manufacturer: "Aisin",
    compatibility: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sp-4",
    sku: "FREON-AC",
    itemName: "Freon AC",
    partNumber: "FREON-AC",
    unit: "Kg",
    stock: 30,
    initialStock: 30,
    minStock: 3,
    price: 120000,
    variant: PartVariant.AFTERMARKET,
    brand: "DuPont",
    manufacturer: "DuPont",
    compatibility: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const dummyServices: Service[] = [
  {
    id: "svc-1",
    serviceName: "Service Berkala 50.000 KM",
    category: "Perawatan Rutin",
    subCategory: "Service Besar",
    description: "Service besar termasuk penggantian oli, filter, busi, dll.",
    unitPrice: 400000,
    tasks: [],
    requiredSpareParts: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "svc-2",
    serviceName: "Pengecekan Kaki-kaki",
    category: "Perbaikan",
    subCategory: "Sistem Suspensi",
    description: "Pengecekan komponen kaki-kaki mobil.",
    unitPrice: 150000,
    tasks: [],
    requiredSpareParts: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "svc-3",
    serviceName: "Penggantian Kampas Rem Depan",
    category: "Perbaikan",
    subCategory: "Sistem Rem",
    description: "Penggantian kampas rem depan.",
    unitPrice: 150000,
    tasks: [],
    requiredSpareParts: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "svc-4",
    serviceName: "Pengecekan Sistem AC",
    category: "Perbaikan",
    subCategory: "Sistem Pendingin",
    description: "Pengecekan dan diagnosis sistem AC.",
    unitPrice: 100000,
    tasks: [],
    requiredSpareParts: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const initialEstimates: Estimation[] = [
  {
    id: "est-123",
    estNum: "EST/2025/07/001",
    estimationDate: "2025-07-01T00:00:00Z", // Gunakan string ISO 8601 untuk konsistensi
    requestOdo: 54900,
    actualOdo: 55000,
    remark: "Keluhan suara aneh dari mesin dan AC kurang dingin.",
    notes: "Estimasi ini berlaku selama 7 hari kerja.",
    totalEstimatedAmount: 930000, // Total = 400k + 150k + 300k + 80k = 930k
    woId: "wo-dummy-1",
    vehicleId: "veh-1",
    mechanicId: "emp-3",
    approvedById: "emp-1",
    issuedById: "emp-1", // Asumsi issuedBy
    createdAt: new Date("2025-07-01T09:00:00Z"),
    updatedAt: new Date("2025-07-01T09:00:00Z"),
    estStatus: EstimationStatus.PENDING,
    estimationServices: [
      {
        id: uuidv4(),
        estimationId: "est-123",
        serviceId: "svc-1",
        quantity: 1,
        unitPrice: 400000,
        totalPrice: 400000,
        createdAt: new Date(),
        updatedAt: new Date(),
        service: dummyServices.find((s) => s.id === "svc-1"),
      },
      {
        id: uuidv4(),
        estimationId: "est-123",
        serviceId: "svc-2",
        quantity: 1,
        unitPrice: 150000,
        totalPrice: 150000,
        createdAt: new Date(),
        updatedAt: new Date(),
        service: dummyServices.find((s) => s.id === "svc-2"),
      },
    ],
    estimationItems: [
      {
        id: uuidv4(),
        estimationId: "est-123",
        sparePartId: "sp-1",
        quantity: 1,
        unitPrice: 300000,
        totalPrice: 300000,
        createdAt: new Date(),
        updatedAt: new Date(),
        sparePart: dummySpareParts.find((sp) => sp.id === "sp-1"),
      },
      {
        id: uuidv4(),
        estimationId: "est-123",
        sparePartId: "sp-2",
        quantity: 1,
        unitPrice: 80000,
        totalPrice: 80000,
        createdAt: new Date(),
        updatedAt: new Date(),
        sparePart: dummySpareParts.find((sp) => sp.id === "sp-2"),
      },
    ],
    vehicle: dummyVehicles.find((v) => v.id === "veh-1"),
    customer: dummyCompanies.find((c) => c.id === "comp-1"),
    mechanic: dummyEmployees.find((e) => e.id === "emp-3"),
    approvedBy: dummyEmployees.find((e) => e.id === "emp-1"),
  },
  {
    id: "est-124",
    estNum: "EST/2025/07/002",
    estimationDate: "2025-07-02T00:00:00Z", // Gunakan string ISO 8601 untuk konsistensi
    requestOdo: 69900,
    actualOdo: 70000,
    remark: "Keluhan rem berbunyi dan AC tidak dingin sama sekali.",
    notes: "Harga dapat berubah tergantung ketersediaan suku cadang.",
    totalEstimatedAmount: 620000, // Total = 150k + 100k + 250k + 120k = 620k
    woId: "wo-dummy-2",
    vehicleId: "veh-2",
    mechanicId: "emp-3",
    approvedById: "emp-2",
    issuedById: "emp-2", // Asumsi issuedBy
    createdAt: new Date("2025-07-02T10:30:00Z"),
    updatedAt: new Date("2025-07-02T10:30:00Z"),
    estStatus: EstimationStatus.APPROVED,
    estimationServices: [
      {
        id: uuidv4(),
        estimationId: "est-124",
        serviceId: "svc-3",
        quantity: 1,
        unitPrice: 150000,
        totalPrice: 150000,
        createdAt: new Date(),
        updatedAt: new Date(),
        service: dummyServices.find((s) => s.id === "svc-3"),
      },
      {
        id: uuidv4(),
        estimationId: "est-124",
        serviceId: "svc-4",
        quantity: 1,
        unitPrice: 100000,
        totalPrice: 100000,
        createdAt: new Date(),
        updatedAt: new Date(),
        service: dummyServices.find((s) => s.id === "svc-4"),
      },
    ],
    estimationItems: [
      {
        id: uuidv4(),
        estimationId: "est-124",
        sparePartId: "sp-3",
        quantity: 1,
        unitPrice: 250000,
        totalPrice: 250000,
        createdAt: new Date(),
        updatedAt: new Date(),
        sparePart: dummySpareParts.find((sp) => sp.id === "sp-3"),
      },
      {
        id: uuidv4(),
        estimationId: "est-124",
        sparePartId: "sp-4",
        quantity: 1,
        unitPrice: 120000,
        totalPrice: 120000,
        createdAt: new Date(),
        updatedAt: new Date(),
        sparePart: dummySpareParts.find((sp) => sp.id === "sp-4"),
      },
    ],
    vehicle: dummyVehicles.find((v) => v.id === "veh-2"),
    customer: dummyCompanies.find((c) => c.id === "comp-2"),
    mechanic: dummyEmployees.find((e) => e.id === "emp-3"),
    approvedBy: dummyEmployees.find((e) => e.id === "emp-2"),
  },
];

interface EstimateState {
  estimates: Estimation[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: EstimateState = {
  estimates: initialEstimates,
  status: "idle",
  error: null,
};

// Async Thunks
export const fetchEstimates = createAsyncThunk(
  "estimates/fetchEstimates",
  async () => {
    return new Promise<Estimation[]>((resolve) => {
      setTimeout(() => {
        resolve(initialEstimates);
      }, 500);
    });
  }
);

export const addEstimate = createAsyncThunk(
  "estimates/addEstimate",
  async (newEstimateData: EstimationFormValues) => {
    // Hitung totalEstimatedAmount berdasarkan item dan service
    const calculatedTotalAmount =
      (newEstimateData.partItems?.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      ) || 0) +
      (newEstimateData.serviceItems?.reduce(
        (sum, service) => sum + service.quantity * service.price,
        0
      ) || 0);

    // Buat objek EstimationItem dan EstimationService dari data form
    const estimationItems: EstimationItem[] =
      newEstimateData.partItems?.map((item) => ({
        id: uuidv4(),
        estimationId: "", // Akan diisi setelah estimasi dibuat
        sparePartId: item.sparePartId || "", // Pastikan ada sparePartId
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
        sparePart: dummySpareParts.find((sp) => sp.id === item.sparePartId), // Tambahkan detail sparePart untuk simulasi
      })) || [];

    const estimationServices: EstimationService[] =
      newEstimateData.serviceItems?.map((service) => ({
        id: uuidv4(),
        estimationId: "", // Akan diisi setelah estimasi dibuat
        serviceId: service.serviceId || "", // Pastikan ada serviceId
        quantity: service.quantity,
        unitPrice: service.price, // Pastikan unitPrice ada di TransactionServiceDetails
        totalPrice: service.quantity * service.price,
        createdAt: new Date(),
        updatedAt: new Date(),
        service: dummyServices.find((svc) => svc.id === service.serviceId), // Tambahkan detail service untuk simulasi
      })) || [];

    const newEstimate: Estimation = {
      id: uuidv4(),
      ...newEstimateData,
      totalEstimatedAmount: calculatedTotalAmount, // Gunakan yang dihitung
      createdAt: new Date(),
      updatedAt: new Date(),
      estStatus: EstimationStatus.DRAFT, // Status awal
      estimationItems: estimationItems,
      estimationServices: estimationServices,
      // Tambahkan relasi dummy untuk display
      vehicle: dummyVehicles.find((v) => v.id === newEstimateData.vehicleId),
      customer: dummyCompanies.find(
        (c) =>
          c.id ===
          dummyVehicles.find((v) => v.id === newEstimateData.vehicleId)?.ownerId
      ),
      mechanic: dummyEmployees.find((e) => e.id === newEstimateData.mechanicId),
      approvedBy: dummyEmployees.find(
        (e) => e.id === newEstimateData.approvedById
      ),
      // workOrder: dummyWorkOrders.find(wo => wo.id === newEstimateData.woId), // Jika ada dummy work order
      // issuedById dan issuedBy tidak ada di EstimationFormValues,
      // jadi tidak perlu ditambahkan di sini.
    };

    // Set estimationId untuk item dan service
    newEstimate.estimationItems?.forEach(
      (item) => (item.estimationId = newEstimate.id)
    );
    newEstimate.estimationServices?.forEach(
      (service) => (service.estimationId = newEstimate.id)
    );

    return new Promise<Estimation>((resolve) => {
      setTimeout(() => {
        initialEstimates.push(newEstimate); // <-- KOREKSI: Pastikan ini hanya dipanggil sekali
        resolve(newEstimate);
      }, 500);
    });
  }
);

export const updateEstimate = createAsyncThunk(
  "estimates/updateEstimate",
  async (updatedEstimateData: Estimation) => {
    // Hitung ulang totalEstimatedAmount saat update
    const calculatedTotalAmount =
      (updatedEstimateData.estimationItems?.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      ) || 0) +
      (updatedEstimateData.estimationServices?.reduce(
        (sum, service) => sum + service.quantity * service.unitPrice,
        0
      ) || 0);

    return new Promise<Estimation>((resolve, reject) => {
      setTimeout(() => {
        const index = initialEstimates.findIndex(
          (e) => e.id === updatedEstimateData.id
        );
        if (index !== -1) {
          initialEstimates[index] = {
            ...updatedEstimateData,
            totalEstimatedAmount: calculatedTotalAmount, // Perbarui total
            updatedAt: new Date(),
          };
          resolve(initialEstimates[index]);
        } else {
          reject(new Error("Estimasi tidak ditemukan"));
        }
      }, 500);
    });
  }
);

export const deleteEstimate = createAsyncThunk(
  "estimates/deleteEstimate",
  async (estimateId: string) => {
    return new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        const initialLength = initialEstimates.length;
        const filteredEstimates = initialEstimates.filter(
          (e) => e.id !== estimateId
        );
        if (filteredEstimates.length < initialLength) {
          initialEstimates.splice(
            0,
            initialEstimates.length,
            ...filteredEstimates
          );
          resolve(estimateId);
        } else {
          reject(new Error("Estimasi tidak ditemukan"));
        }
      }, 500);
    });
  }
);

const estimateSlice = createSlice({
  name: "estimates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEstimates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchEstimates.fulfilled,
        (state, action: PayloadAction<Estimation[]>) => {
          state.status = "succeeded";
          state.estimates = action.payload;
        }
      )
      .addCase(fetchEstimates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Gagal memuat estimasi";
      })
      .addCase(
        addEstimate.fulfilled,
        (state, action: PayloadAction<Estimation>) => {
          state.estimates.push(action.payload);
        }
      )
      .addCase(
        updateEstimate.fulfilled,
        (state, action: PayloadAction<Estimation>) => {
          const index = state.estimates.findIndex(
            (estimate) => estimate.id === action.payload.id
          );
          if (index !== -1) {
            state.estimates[index] = action.payload;
          }
        }
      )
      .addCase(
        deleteEstimate.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.estimates = state.estimates.filter(
            (estimate) => estimate.id !== action.payload
          );
        }
      );
  },
});

export default estimateSlice.reducer;
