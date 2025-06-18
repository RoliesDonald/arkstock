// src/types/estimation.ts
import * as z from "zod";
// --- PENTING: Impor TransactionPartDetails dari sparepart.ts ---
import { transactionPartDetailsSchema } from "./sparepart";
import { transactionServiceDetailsSchema } from "./service"; // Impor dari service.ts

export enum EstimationStatus {
  DRAFT = "Draft",
  PENDING = "Pending",
  SENT = "Sent",
  CANCELLED = "Cancelled",
  APPROVED = "Approved",
}

// Skema Zod untuk form Estimation
export const estimationFormSchema = z.object({
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
  finishedDate: z.date().optional().nullable(),
  totalEstimatedAmount: z.coerce
    .number()
    .min(0, { message: "Total estimasi tidak boleh negatif." }),
  woId: z.string().uuid({ message: "ID Work Order tidak valid." }),
  vehicleId: z.string().uuid({ message: "ID Kendaraan tidak valid." }),
  mechanicId: z.string().optional().nullable(),
  approvedById: z.string().optional().nullable(),
  // Untuk form, daftar item bisa langsung berupa array dari detailnya
  partItems: z
    .array(
      transactionPartDetailsSchema.omit({ partId: true, totalPrice: true })
    )
    .min(0, { message: "Setidaknya satu item part bisa ditambahkan." })
    .optional(),
  serviceItems: z
    .array(
      transactionServiceDetailsSchema.omit({
        serviceId: true,
        totalPrice: true,
      })
    )
    .min(0, { message: "Setidaknya satu item layanan bisa ditambahkan." })
    .optional(),
});

export type EstimationFormValues = z.infer<typeof estimationFormSchema>;

// Interface untuk EstimationItem (join table) - mencerminkan Prisma
export interface EstimationItem {
  id: string; // UUID
  estimationId: string; // FK
  sparePartId: string; // FK
  quantity: number;
  unitPrice: number; // Decimal di Prisma, number di TS
  totalPrice: number; // Decimal di Prisma, number di TS
  createdAt: Date;
  updatedAt: Date;
  // Relasi:
  // estimation?: Estimation;
  // sparePart?: SparePart;
}

// Interface untuk EstimationService (join table) - mencerminkan Prisma
export interface EstimationService {
  id: string; // UUID
  estimationId: string; // FK
  serviceId: string; // FK
  quantity: number;
  totalPrice: number; // Decimal di Prisma, number di TS
  createdAt: Date;
  updatedAt: Date;
  // Relasi:
  // estimation?: Estimation;
  // service?: Service;
}

// Interface Estimation lengkap (mencerminkan model Prisma)
export interface Estimation {
  id: string; // UUID
  estNum: string;
  estimationDate: Date;
  requestOdo: number;
  actualOdo: number;
  remark: string;
  finishedDate?: Date;
  totalEstimatedAmount: number; // Decimal di Prisma, number di TS
  woId: string; // FK
  vehicleId: string; // FK
  mechanicId?: string | null; // FK
  approvedById?: string | null; // FK
  createdAt: Date;
  updatedAt: Date;

  // Relasi: array dari join tables
  estimationItems?: EstimationItem[];
  estimationServices?: EstimationService[];

  estStatus?: EstimationStatus;

  // Relasi (untuk display, jika di-include dari Prisma)
  // workOrder?: WorkOrder;
  // vehicle?: Vehicle;
  // mechanic?: User;
  // approvedBy?: User;
}
