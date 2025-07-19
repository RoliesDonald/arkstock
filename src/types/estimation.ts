// src/types/estimation.ts
import * as z from "zod";
import { SparePart, RawSparePartApiResponse } from "./sparepart";
import { Service, RawServiceApiResponse } from "./services"; // Import Service dan RawServiceApiResponse
import { Vehicle, RawVehicleApiResponse } from "./vehicle";
import { Company, RawCompanyApiResponse } from "./companies";
import { Employee, RawEmployeeApiResponse } from "./employee";
import { WorkOrder, RawWorkOrderApiResponse } from "./workOrder";

export const transactionPartDetailsSchema = z.object({
  sparePartId: z.string().min(1, { message: "ID Spare Part wajib diisi." }),
  quantity: z.coerce.number().int().min(1, { message: "Kuantitas minimal 1." }),
  unitPrice: z.coerce
    .number()
    .min(0, { message: "Harga satuan tidak boleh negatif." }),
});

export const transactionServiceDetailsSchema = z.object({
  serviceId: z.string().min(1, { message: "Jasa wajib dipilih." }),
  quantity: z.coerce
    .number()
    .int()
    .min(1, { message: "Kuantitas minimal 1." })
    .default(1),
  unitPrice: z.coerce
    .number()
    .min(0, { message: "Harga satuan tidak boleh negatif." }),
});

export enum EstimationStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

export const estimationFormSchema = z.object({
  id: z.string().optional(),
  estNum: z.string().min(1, { message: "Nomor Estimasi wajib diisi." }),
  estimationDate: z.date({ required_error: "Tanggal Estimasi wajib diisi." }),
  requestOdo: z.coerce
    .number()
    .int()
    .min(0, { message: "Odometer request tidak boleh negatif." }),
  actualOdo: z.coerce
    .number()
    .int()
    .min(0, { message: "Odometer aktual tidak boleh negatif." }),
  remark: z.string().min(1, { message: "Keluhan/remark wajib diisi." }),
  notes: z.string().optional().nullable(),
  finishedDate: z.date().optional().nullable(),
  totalEstimatedAmount: z.coerce
    .number()
    .min(0, { message: "Total estimasi tidak boleh negatif." }),
  workOrderId: z.string().uuid({ message: "ID Work Order tidak valid." }),
  vehicleId: z.string().uuid({ message: "ID Kendaraan tidak valid." }),
  mechanicId: z.string().optional().nullable(),
  approvedById: z.string().optional().nullable(),
  accountantId: z.string().optional().nullable(),
  partItems: z.array(transactionPartDetailsSchema).optional(),
  serviceItems: z.array(transactionServiceDetailsSchema).optional(),
});

export type EstimationFormValues = z.infer<typeof estimationFormSchema>;

// --- INTERFACES UNTUK REDUX STATE (TANGGAL SEBAGAI STRING) ---

// Interface untuk EstimationItem (join table) - mencerminkan Prisma, untuk Redux State
export interface EstimationItem {
  id: string; // UUID
  estimationId: string; // FK ke Estimation
  sparePartId: string; // FK ke SparePart
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string; // <-- STRING
  updatedAt: string; // <-- STRING
  // Relasi (untuk digunakan di frontend jika di-include)
  sparePart?: SparePart; // <-- Menggunakan SparePart yang sudah terdefinisi
}

// Interface untuk EstimationService (join table) - mencerminkan Prisma, untuk Redux State
export interface EstimationService {
  id: string; // UUID
  estimationId: string; // FK ke Estimation
  serviceId: string; // FK ke Service
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string; // <-- STRING
  updatedAt: string; // <-- STRING
  // Relasi (untuk digunakan di frontend jika di-include)
  service?: Service; // <-- Menggunakan interface Service yang sudah terdefinisi
}

// Interface Estimation lengkap (mencerminkan model Prisma, untuk Redux State)
export interface Estimation {
  id: string; // UUID
  estimationNumber: string;
  estimationDate: string; // <-- STRING
  requestOdo: number;
  actualOdo: number;
  remark: string;
  notes?: string | null;
  finishedDate?: string | null; // <-- STRING atau null
  totalEstimatedAmount: number;
  workOrderId: string; // FK
  vehicleId: string; // FK
  mechanicId?: string | null; // FK
  accountantId?: string | null; // FK
  approvedById?: string | null; // FK
  createdAt: string; // <-- STRING
  updatedAt: string; // <-- STRING

  // Relasi: array dari join tables, bisa di-include saat fetch
  estimationItems?: EstimationItem[];
  estimationServices?: EstimationService[];

  estStatus: EstimationStatus; // Status estimasi

  // Relasi (untuk display di frontend, jika di-include dari Prisma)
  vehicle?: Vehicle; // <-- Menggunakan Vehicle (yang sudah string)
  customer?: Company; // <-- Menggunakan Company (yang sudah string)
  mechanic?: Employee; // <-- Menggunakan Employee (yang sudah string)
  approvedBy?: Employee; // <-- Menggunakan Employee (yang sudah string)
  accountant?: Employee; // <-- Menggunakan Employee (yang sudah string)
  workOrder?: WorkOrder; // <-- Menggunakan WorkOrder (yang sudah string)
}

// --- INTERFACES UNTUK DATA MENTAH DARI API (TANGGAL SEBAGAI DATE OBJEK) ---

// Interface untuk Raw EstimationItem ApiResponse
export interface RawEstimationItemApiResponse {
  id: string;
  estimationId: string;
  sparePartId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date; // <-- DATE
  updatedAt: Date; // <-- DATE
  sparePart?: RawSparePartApiResponse; // <-- RawSparePartApiResponse
}

// Interface untuk Raw EstimationService ApiResponse
export interface RawEstimationServiceApiResponse {
  id: string;
  estimationId: string;
  serviceId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date; // <-- DATE
  updatedAt: Date; // <-- DATE
  service?: RawServiceApiResponse; // <-- RawServiceApiResponse
}

// Interface untuk Raw Estimation ApiResponse
export interface RawEstimationApiResponse {
  id: string;
  estimationNumber: string;
  estimationDate: Date; // <-- DATE
  requestOdo: number;
  actualOdo: number;
  remark: string;
  notes?: string | null;
  finishedDate?: Date | null; // <-- DATE atau null
  totalEstimatedAmount: number;
  workOrderId: string;
  vehicleId: string;
  mechanicId?: string | null;
  accountantId?: string | null;
  approvedById?: string | null;
  createdAt: Date; // <-- DATE
  updatedAt: Date; // <-- DATE

  estimationItems?: RawEstimationItemApiResponse[]; // <-- RawEstimationItemApiResponse
  estimationServices?: RawEstimationServiceApiResponse[]; // <-- RawEstimationServiceApiResponse

  estStatus: EstimationStatus;

  vehicle?: RawVehicleApiResponse; // <-- RawVehicleApiResponse
  customer?: RawCompanyApiResponse; // <-- RawCompanyApiResponse
  mechanic?: RawEmployeeApiResponse; // <-- RawEmployeeApiResponse
  approvedBy?: RawEmployeeApiResponse; // <-- RawEmployeeApiResponse
  accountant?: RawEmployeeApiResponse; // <-- RawEmployeeApiResponse
  workOrder?: RawWorkOrderApiResponse; // <-- RawWorkOrderApiResponse
}
