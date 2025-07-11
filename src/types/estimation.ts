import * as z from "zod";
import { SparePart } from "./sparepart";

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

// Skema Zod untuk form Estimation
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

// Interface untuk EstimationItem (join table) - mencerminkan Prisma
// Ini adalah item spare part yang terkait dengan estimasi
export interface EstimationItem {
  id: string; // UUID
  estimationId: string; // FK ke Estimation
  sparePartId: string; // FK ke SparePart
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  // Relasi (untuk digunakan di frontend jika di-include)
  sparePart?: {
    // Tambahkan detail spare part untuk display
    id: string;
    partName: string;
    partNumber: string;
    unit: string;
    sku?: string | null;
    variant?: SparePart["variant"] | null;
    make?: string | null;
    price?: number;
    description?: string | null;
    stock?: number;
  };
}

// Interface untuk EstimationService (join table) - mencerminkan Prisma
// Ini adalah jasa yang terkait dengan estimasi
export interface EstimationService {
  id: string; // UUID
  estimationId: string; // FK ke Estimation
  serviceId: string; // FK ke Service
  quantity: number;
  unitPrice: number; // Tambahkan unitPrice di sini agar konsisten dengan PricedItem
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  // Relasi (untuk digunakan di frontend jika di-include)
  service?: {
    // Tambahkan detail service untuk display
    id: string;
    serviceName: string;
    description?: string | null;
    price: number;
  };
}

// Interface Estimation lengkap (mencerminkan model Prisma)
export interface Estimation {
  id: string; // UUID
  estimationNumber: string;
  estimationDate: Date;
  requestOdo: number;
  actualOdo: number;
  remark: string;
  notes?: string | null;
  finishedDate?: Date | null; // Bisa null
  totalEstimatedAmount: number;
  workOrderId: string; // FK
  vehicleId: string; // FK
  mechanicId?: string | null; // FK
  accountantId?: string | null; // FK
  approvedById?: string | null; // FK
  createdAt: Date;
  updatedAt: Date;

  // Relasi: array dari join tables, bisa di-include saat fetch
  estimationItems?: EstimationItem[];
  estimationServices?: EstimationService[];

  estStatus: EstimationStatus; // Status estimasi

  // Relasi (untuk display di frontend, jika di-include dari Prisma)
  vehicle?: {
    // Detail kendaraan terkait
    id: string;
    licensePlate: string;
    vehicleMake: string;
    model: string;
    color: string;
    yearMade: number;
    chassisNum?: string | null;
    engineNum?: string | null;
  };
  customer?: {
    // Detail customer terkait (asumsi vehicle punya customerId, atau ambil dari WO)
    id: string;
    companyName: string;
    contact?: string | null;
    address?: string | null;
  };
  mechanic?: {
    // Detail mekanik terkait
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    position?: string | null;
  };
  approvedBy?: {
    // Detail yang menyetujui
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    position?: string | null;
  };
  accountant?: {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    position?: string | null;
  };
  workOrder?: {
    // Detail work order terkait
    id: string;
    workOrderNumber: string;
    workOrderMaster: string;
    date: Date;
  };
}
