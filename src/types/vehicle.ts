// src/types/vehicle.ts
import * as z from "zod";
import { Company, RawCompanyApiResponse } from "./companies"; // Import RawCompanyApiResponse
import { WorkOrder, RawWorkOrderApiResponse } from "./workOrder"; // Import RawWorkOrderApiResponse
import { Invoice, RawInvoiceApiResponse } from "./invoice"; // Asumsi RawInvoiceApiResponse ada, jika tidak, perlu dibuat
import { Estimation, RawEstimationApiResponse } from "./estimation"; // Import RawEstimationApiResponse

export enum VehicleType {
  PASSENGER = "PASSENGER",
  COMMERCIAL = "COMMERCIAL",
  MOTORCYCLE = "MOTORCYCLE",
}

export enum VehicleCategory {
  // kendaraan Passenger
  SEDAN = "SEDAN", //Civic
  HATCH_BACK = "HATCH_BACK", //YARIS, BRIO
  MPV = "MPV", // AVANZA, XPANDER
  SUV = "SUV", // contoh: PAJERO, FORTUNER
  CROSSOVER = "CROSSOVER", // contoh: HONDA HR-V, TOYOTA RAIZE
  COUPE = "COUPE", // 2 Pintu sporty
  CABRIOLET = "CABRIOLET", // Atap bisa dibuka Mazda MX-5 BMW Z4
  STATION_WAGON = "STATION_WAGON", // Bagasi besar, volvo v60
  ROADSTER = "ROADSTER", // Sedan Sport 2 Pintu
  MINI_VAN = "MINI_VAN", // Suzuki APV

  //kendaraan Commercial
  PICKUP = "PICKUP", // L300, Toyota hilux (single cabin atau double cabin)
  SMALL_VAN = "SMALL_VAN", // Granmax, Suzuki Carry
  MINI_BUS = "MINI_BUS", // HiAce, Elf penumpang
  LIGHT_TRUCK = "LIGHT_TRUCK", // TRAGA, Canter FE71
  BOX_TRUCK = "BOX_TRUCK", // cargo tertutup
  WING_BOX = "WING_BOX", // truk dengan pintu disamping di buka ke atas
  DUMP_TRUCK = "DUMP_TRUCK", // bak terbuka untuk raw material
  TANKER_TRUCK = "TANKER-TRUCK", // truk tanki BBM dll
  TRAILER = "TRAILER", // truck gandeng panjang untuk logistik
  FLATBED_TRUCK = "FLATBED_TRUCK", // bak tanpa dinding samping dan belakang
  REFRIGERATED_TRUCK = "REFRIGERATED_TRUCK", // truck dengan pendingin
  CAR_CARRIER = "CAR_CARRIER",
  CONCRETE_MIXER_TRUCK = "CONCRETE_MIXER_TRUCK",
  LOG_CARRIER_TRUCK = "LOG_CARRIER_TRUCK",

  // bus
  MEDIUM_BUS = "MEDIUM_BUS",
  BIG_BUS = "BIG_BUS",

  // sepeda motor
  SCOOTER = "SCOOTER",
  CUB_BIKE = "CUB_BIKE",
  SPORT_BIKE = "SPORT_BIKE",
  NAKED_BIKE = "NAKED_BIKE",
  CRUISER = "CRUISER",
  TOURING_BIKE = "TOURING_BIKE",
  TRAIL_DUAL = "TRAIL_DUAL",
  E_BIKE = "E_BIKE",
  ATV = "ALL_TERRAIN_VEHICLE",
  MOPED = "MOPED",
}

export enum VehicleFuelType {
  GASOLINE = "GASOLINE",
  DIESEL = "DIESEL",
  HYBRID = "HYBRID",
  ELECTRIC = "ELECTRIC",
  LPG = "LPG",
  CNG = "CNG",
}

export enum VehicleTransmissionType {
  MANUAL = "MANUAL",
  AUTOMATIC = "AUTOMATIC", // Camry,CR-V
  CVT = "CVT", //BRIO CVT, Yaris CVT, Nissan X-trail
  AMT = "AMT", // Karimun Wagon R AGS, Wuling Confero AMT
  SEMI_AUTOMATIC = "SEMI_AUTOMATIC", // Fortuner, Pajero Sport
  DTC_DSG = "DCT_DSG", // VW GOLF DSG, Hyundai i30DCT, BMW M Series DCT
  ELECTRIC_CVT = "E_CVTELECTRIC_CVT", //Toyota Prius, Corolla Cross Hybrid
}

export enum VehicleStatus {
  ACTIVE = "ACTIVE", // Aktif dan siap digunakan
  AVAILABLE = "AVAILABLE", // Tersedia untuk disewakan/dipinjamkan
  IN_MAINTENANCE = "IN_MAINTENANCE", // Sedang dalam perawatan/perbaikan
  RENTED = "RENTED", // Sedang disewa/dipinjam
  OUT_OF_SERVICE = "OUT_OF_SERVICE", // Tidak dapat digunakan karena rusak/alasan lain
  BRAKE_DOWN = "BRAKE_DOWN", // Rusak total, tidak bisa digunakan
  ON_HOLD = "ON_HOLD", // Ditunda/ditangguhkan
}

export const vehicleFormSchema = z.object({
  id: z.string().optional(), // Opsional karena auto-generated saat create
  licensePlate: z.string().min(1, { message: "Plat nomor wajib diisi." }),
  vehicleMake: z.string().min(1, { message: "Merk kendaraan wajib diisi." }),
  model: z.string().min(1, { message: "Model kendaraan wajib diisi." }),
  trimLevel: z.string().nullable().optional(),
  vinNum: z.string().nullable().optional(),
  engineNum: z.string().nullable().optional(),
  chassisNum: z.string().nullable().optional(),
  yearMade: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1), // Tahun tidak boleh di masa depan
  color: z.string().min(1, { message: "Warna wajib diisi." }),
  vehicleType: z.nativeEnum(VehicleType),
  vehicleCategory: z.nativeEnum(VehicleCategory),
  fuelType: z.nativeEnum(VehicleFuelType),
  transmissionType: z.nativeEnum(VehicleTransmissionType),
  lastOdometer: z.number().int().min(0),
  lastServiceDate: z
    .string() // <-- Biarkan string jika form mengirim string ISO
    .datetime("tanggal servis tidak valid.")
    .nullable(),
  ownerId: z
    .string()
    .uuid("ID pemilik tidak valid")
    .min(1, { message: "Pemilik wajib dipilih." }), // ID Perusahaan Rental
  carUserId: z
    .string()
    .uuid("ID pengguna kendaraan tidak valid")
    .nullable()
    .optional(), // ID Pengguna Kendaraan (opsional)
  // UPDATED: Status kendaraan menggunakan enum VehicleStatus
  status: z.nativeEnum(VehicleStatus, {
    required_error: "Status kendaraan wajib dipilih.",
  }),
  notes: z.string().nullable().optional(),
  // createdAt dan updatedAt tidak perlu di form schema karena di-handle backend/slice
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

// --- INTERFACE UNTUK REDUX STATE (TANGGAL SEBAGAI STRING) ---
export interface Vehicle {
  id: string;
  licensePlate: string;
  vehicleMake: string;
  model: string;
  trimLevel: string | null;
  vinNum: string | null; // Vehicle Identification Number
  engineNum: string | null; // Nomor Mesin
  chassisNum: string | null; // Nomor Sasis
  yearMade: number;
  color: string;
  vehicleType: VehicleType;
  vehicleCategory: VehicleCategory;
  fuelType: VehicleFuelType;
  transmissionType: VehicleTransmissionType;
  lastOdometer: number; // Odometer terakhir tercatat (KM)
  lastServiceDate: string; // <-- STRING
  ownerId: string; // ID perusahaan pemilik (Perusahaan Rental)
  carUserId: string | null; // ID perusahaan yang menggunakan/menyewa (Pelanggan/Penyewa)
  status: VehicleStatus; // Status operasional kendaraan (e.g., Active, In Maintenance, Rented, Sold)
  notes: string | null; // Catatan tambahan
  createdAt: string; // <-- STRING
  updatedAt: string; // <-- STRING
  // Relasi:
  owner?: Company; // Objek perusahaan pemilik (jika di-populate)
  carUser?: Company; // Objek pengguna kendaraan (jika di-populate)
  workOrders?: WorkOrder[];
  invoices?: Invoice[];
  estimation?: Estimation[];
}

// --- INTERFACE UNTUK DATA MENTAH DARI API (TANGGAL SEBAGAI DATE OBJEK) ---
export interface RawVehicleApiResponse {
  id: string;
  licensePlate: string;
  vehicleMake: string;
  model: string;
  trimLevel: string | null;
  vinNum: string | null;
  engineNum: string | null;
  chassisNum: string | null;
  yearMade: number;
  color: string;
  vehicleType: VehicleType;
  vehicleCategory: VehicleCategory;
  fuelType: VehicleFuelType;
  transmissionType: VehicleTransmissionType;
  lastOdometer: number;
  lastServiceDate: Date; // <-- DATE
  ownerId: string;
  carUserId: string | null;
  status: VehicleStatus;
  notes: string | null;
  createdAt: Date; // <-- DATE
  updatedAt: Date; // <-- DATE
  // Relasi:
  owner?: RawCompanyApiResponse; // <-- RawCompanyApiResponse
  carUser?: RawCompanyApiResponse; // <-- RawCompanyApiResponse
  workOrders?: RawWorkOrderApiResponse[]; // <-- RawWorkOrderApiResponse
  invoices?: RawInvoiceApiResponse[]; // <-- RawInvoiceApiResponse
  estimation?: RawEstimationApiResponse[]; // <-- RawEstimationApiResponse
}
