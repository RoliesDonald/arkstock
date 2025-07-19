// src/types/workOrder.ts
import * as z from "zod";
import { Vehicle, RawVehicleApiResponse } from "./vehicle"; // Import Vehicle dan RawVehicleApiResponse
import { Company, RawCompanyApiResponse } from "./companies"; // Import Company dan RawCompanyApiResponse
import { Employee, RawEmployeeApiResponse } from "./employee"; // Import Employee dan RawEmployeeApiResponse
import { Invoice } from "./invoice"; // Asumsi ini sudah string atau akan difix
import { Estimation } from "./estimation"; // Asumsi ini sudah string atau akan difix

export enum WoProgresStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  ON_PROCESS = "ON_PROCESS",
  WAITING_APPROVAL = "WAITING_APPROVAL",
  WAITING_PART = "WAITING_PART",
  FINISHED = "FINISHED",
  CANCELED = "CANCELED",
  INVOICE_CREATED = "INVOICE_CREATED",
}

export enum WoPriorityType {
  NORMAL = "NORMAL",
  URGENT = "URGENT",
  EMERGENCY = "EMERGENCY",
}

// Skema Zod untuk form WorkOrder
export const workOrderFormSchema = z.object({
  id: z.string().optional(),
  woNumber: z.string().optional(),
  woMaster: z.string().min(1, { message: "Nomor WO Master wajib diisi." }),
  date: z.date({ required_error: "Tanggal WO wajib diisi." }),
  settledOdo: z.coerce
    .number()
    .int()
    .min(0, { message: "Odometer tidak boleh negatif." })
    .nullable()
    .optional(),
  remark: z.string().min(1, { message: "Keluhan/kerusakan wajib diisi." }),
  schedule: z.date().optional().nullable(),
  serviceLocation: z.string().min(1, { message: "Lokasi servis wajib diisi." }),
  notes: z.string().optional().nullable(),
  vehicleMake: z.string().min(1, { message: "Merk kendaraan wajib diisi." }),
  progresStatus: z.nativeEnum(WoProgresStatus),
  priorityType: z.nativeEnum(WoPriorityType),
  vehicleId: z.string().min(1, { message: "Kendaraan wajib dipilih." }),
  customerId: z.string().min(1, { message: "Customer wajib dipilih." }),
  carUserId: z
    .string()
    .min(1, { message: "Pengguna kendaraan wajib dipilih." }),
  vendorId: z.string().min(1, { message: "Vendor (bengkel) wajib dipilih." }),
  mechanicId: z.string().optional().nullable(),
  driverId: z.string().optional().nullable(),
  driverContact: z.string().optional().nullable(),
  approvedById: z.string().optional().nullable(),
  requestedById: z.string().optional().nullable(),
  locationId: z.string().optional().nullable(),
});

export type WorkOrderFormValues = z.infer<typeof workOrderFormSchema>;

// Interface WorkOrder untuk Redux State (tanggal sebagai string)
export interface WorkOrder {
  id: string; // UUID
  workOrderNumber: string;
  workOrderMaster: string;
  date: string; // <-- STRING
  settledOdo: number | null;
  remark: string;
  schedule?: string | null; // <-- STRING atau null
  serviceLocation: string;
  notes?: string | null;
  vehicleMake: string;
  progresStatus: WoProgresStatus;
  priorityType: WoPriorityType;
  vehicleId: string;
  customerId: string;
  carUserId: string;
  vendorId: string;
  mechanicId?: string | null;
  driverId?: string | null;
  driverContact?: string | null;
  approvedById?: string | null;
  requestedById?: string | null;
  locationId?: string | null;
  createdAt: string; // <-- STRING
  updatedAt: string; // <-- STRING

  // Relasi (tidak diisi di form, hanya di entitas lengkap)
  vehicle?: Vehicle; // <-- Vehicle (yang sudah string)
  customer?: Company; // <-- Company (yang sudah string)
  carUser?: Company; // <-- Company (yang sudah string)
  vendor?: Company; // <-- Company (yang sudah string)
  mechanic?: Employee; // <-- Employee (yang sudah string)
  driver?: Employee; // <-- Employee (yang sudah string)
  approvedBy?: Employee; // <-- Employee (yang sudah string)
  requestedBy?: Employee; // <-- Employee (yang sudah string)
  invoice?: Invoice; // Asumsi ini sudah string atau akan difix
  estimation?: Estimation; // Asumsi ini sudah string atau akan difix
  location?: Location; // Asumsi ini sudah string atau akan difix (jika ada Date)
}

// Interface Raw WorkOrder ApiResponse (tanggal sebagai Date objek)
export interface RawWorkOrderApiResponse {
  id: string;
  workOrderNumber: string;
  workOrderMaster: string;
  date: Date; // <-- DATE
  settledOdo: number | null;
  remark: string;
  schedule?: Date | null; // <-- DATE atau null
  serviceLocation: string;
  notes?: string | null;
  vehicleMake: string;
  progresStatus: WoProgresStatus;
  priorityType: WoPriorityType;
  vehicleId: string;
  customerId: string;
  carUserId: string;
  vendorId: string;
  mechanicId?: string | null;
  driverId?: string | null;
  driverContact?: string | null;
  approvedById?: string | null;
  requestedById?: string | null;
  locationId?: string | null;
  createdAt: Date; // <-- DATE
  updatedAt: Date; // <-- DATE

  // Relasi (untuk digunakan di API Response)
  vehicle?: RawVehicleApiResponse; // <-- RawVehicleApiResponse
  customer?: RawCompanyApiResponse; // <-- RawCompanyApiResponse
  carUser?: RawCompanyApiResponse; // <-- RawCompanyApiResponse
  vendor?: RawCompanyApiResponse; // <-- RawCompanyApiResponse
  mechanic?: RawEmployeeApiResponse; // <-- RawEmployeeApiResponse
  driver?: RawEmployeeApiResponse; // <-- RawEmployeeApiResponse
  approvedBy?: RawEmployeeApiResponse; // <-- RawEmployeeApiResponse
  requestedBy?: RawEmployeeApiResponse; // <-- RawEmployeeApiResponse
  invoice?: Invoice; // Asumsi ini akan di-handle di slice masing-masing
  estimation?: Estimation; // Asumsi ini akan di-handle di slice masing-masing
  location?: any; // Jika Location punya Date, buat RawLocationApiResponse
}
