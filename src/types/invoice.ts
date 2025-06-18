// src/types/invoice.ts
import * as z from "zod";
// --- PENTING: Impor TransactionPartDetails dari sparepart.ts ---
import {
  TransactionPartDetails,
  transactionPartDetailsSchema,
} from "./sparepart";
import {
  TransactionServiceDetails,
  transactionServiceDetailsSchema,
} from "./service"; // Impor dari service.ts

export enum InvoiceStatus {
  DRAFT = "Draft",
  PENDING = "Pending",
  SENT = "Sent",
  PAID = "Paid",
  PARTIALLY_PAID = "Partially Paid",
  OVERDUE = "Overdue",
  CANCELLED = "Cancelled",
  REJECTED = "Rejected",
}

// skema zod untuk InvoiceItem (untuk form)
export const invoiceItemSchema = z.object({
  itemName: z.string().min(1, { message: "Nama item wajib diisi." }),
  partNumber: z.string().min(1, { message: "Nomor part wajib diisi." }),
  quantity: z.coerce.number().int().min(1, { message: "Kuantitas minimal 1." }),
  unit: z.string().min(1, { message: "Satuan wajib diisi." }),
  unitPrice: z.coerce
    .number()
    .min(0, { message: "Harga satuan tidak boleh negatif." }),
});

// Skema Zod untuk form Invoice
export const invoiceFormSchema = z.object({
  invNum: z.string().min(1, { message: "Nomor Invoice wajib diisi." }),
  invoiceDate: z.date({ required_error: "Tanggal Invoice wajib diisi." }),
  requestOdo: z.coerce
    .number()
    .int()
    .min(0, { message: "Odometer request tidak boleh negatif." }),
  actualOdo: z.coerce
    .number()
    .int()
    .min(0, { message: "Odometer aktual tidak boleh negatif." }),
  remark: z.string().min(1, { message: "Keluhan/remark wajib diisi." }),
  finishedDate: z.date({ required_error: "Tanggal selesai wajib diisi." }),
  totalAmount: z.coerce
    .number()
    .min(0, { message: "Total jumlah tidak boleh negatif." }), // Ini harus dihitung
  woId: z.string().uuid({ message: "ID Work Order tidak valid." }),
  vehicleId: z.string().uuid({ message: "ID Kendaraan tidak valid." }),
  mechanicId: z.string().optional().nullable(),
  approvedById: z.string().optional().nullable(),
  // Untuk form, daftar item bisa langsung berupa array dari detailnya
  partItems: z
    .array(
      transactionPartDetailsSchema.omit({ partId: true, totalPrice: true })
    ) // Omit ID & TotalPrice di input form
    .min(0, { message: "Setidaknya satu item spare part bisa ditambahkan." })
    .optional(),
  serviceItems: z
    .array(
      transactionServiceDetailsSchema.omit({
        serviceId: true,
        totalPrice: true,
      })
    ) // Omit ID & TotalPrice di input form
    .min(0, { message: "Setidaknya satu item layanan bisa ditambahkan." })
    .optional(),
  // Status di form (untuk tampilan UI/draft)
  status: z.nativeEnum(InvoiceStatus, {
    required_error: "Status faktur wajib dipilih.",
  }),
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

// Interface untuk InvoiceItem (join table) - mencerminkan Prisma
export interface InvoiceItem {
  id: string; // UUID
  invoiceId: string; // FK
  sparePartId: string; // FK
  quantity: number;
  unitPrice: number; // Decimal di Prisma, number di TS
  totalPrice: number; // Decimal di Prisma, number di TS
  createdAt: Date;
  updatedAt: Date;
  // Relasi:
  // invoice?: Invoice;
  // sparePart?: SparePart;
}

// Interface untuk InvoiceService (join table) - mencerminkan Prisma
export interface InvoiceService {
  id: string; // UUID
  invoiceId: string; // FK
  serviceId: string; // FK
  quantity: number;
  totalPrice: number; // Decimal di Prisma, number di TS
  createdAt: Date;
  updatedAt: Date;
  // Relasi:
  // invoice?: Invoice;
  // service?: Service;
}

// Interface Invoice lengkap (mencerminkan model Prisma)
export interface Invoice {
  id: string; // UUID
  invNum: string;
  invoiceDate: Date;
  requestOdo: number;
  actualOdo: number;
  remark: string;
  finishedDate: Date;
  totalAmount: number; // Decimal di Prisma, number di TS
  woId: string; // FK
  vehicleId: string; // FK
  mechanicId?: string | null; // FK
  approvedById?: string | null; // FK
  createdAt: Date;
  updatedAt: Date;

  // Status UI-specific (tidak ada di Prisma Anda)
  status?: InvoiceStatus;

  // Relasi: array dari join tables
  invoiceItems?: InvoiceItem[];
  invoiceServices?: InvoiceService[];

  // Relasi (untuk display, jika di-include dari Prisma)
  // workOrder?: WorkOrder;
  // vehicle?: Vehicle;
  // mechanic?: User;
  // approvedBy?: User;
}
