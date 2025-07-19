import { z } from "zod";
import { SparePart, RawSparePartApiResponse } from "./sparepart";
import { InvoiceService, RawInvoiceServiceApiResponse } from "./invoice";
import {
  EstimationService,
  RawEstimationServiceApiResponse,
} from "./estimation";

// RequiredSparePart interface (for Redux State)
export interface RequiredSparePart {
  serviceId?: string;
  sparePartId: string;
  quantity: number;
  sparePart?: SparePart; // <-- Ini adalah objek SparePart yang sudah diformat (string dates)
}

// Raw RequiredSparePart interface (for API Response)
export interface RawRequiredSparePartApiResponse {
  serviceId?: string;
  sparePartId: string;
  quantity: number;
  sparePart?: RawSparePartApiResponse; // <-- Ini adalah objek RawSparePartApiResponse (Date objects)
}

// Service schema (menggunakan serviceName)
export const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  serviceName: z.string().min(1, { message: "Nama layanan wajib diisi." }), // <-- Diubah dari 'name' ke 'serviceName'
  category: z.string(),
  subCategory: z.string(),
  description: z.string().nullable().optional(),
  price: z.number().min(0.01, { message: "Harga layanan harus lebih dari 0." }),
  tasks: z.array(z.string()),
  // requiredSpareParts di sini hanya mendefinisikan struktur dasar untuk validasi Zod.
  // Relasi 'sparePart' yang lengkap akan ditambahkan di interface di bawah.
  requiredSpareParts: z
    .array(
      z.object({
        sparePartId: z
          .string()
          .min(1, { message: "ID Spare Part wajib diisi." }),
        quantity: z
          .number()
          .int()
          .min(1, { message: "Kuantitas harus minimal 1." }),
      })
    )
    .nullable()
    .optional(),
});

// Main Service type (untuk Redux State)
export type Service = z.infer<typeof serviceSchema> & {
  createdAt: string;
  updatedAt: string;
  requiredSpareParts?: RequiredSparePart[]; // <-- Menggunakan RequiredSparePart
  invoiceServices?: InvoiceService[];
  estimationServices?: EstimationService[];
};

// Raw Service ApiResponse (tanggal sebagai Date objek)
export type RawServiceApiResponse = z.infer<typeof serviceSchema> & {
  createdAt: Date;
  updatedAt: Date;
  requiredSpareParts?: RawRequiredSparePartApiResponse[]; // <-- Menggunakan RawRequiredSparePartApiResponse
  invoiceServices?: RawInvoiceServiceApiResponse[];
  estimationServices?: RawEstimationServiceApiResponse[];
};

// Service form schema (omit id, createdAt, updatedAt)
export const serviceFormSchema = serviceSchema.omit({
  id: true,
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;

// TransactionServiceDetails schema (sudah menggunakan serviceName)
export const transactionServiceDetailsSchema = z.object({
  id: z.string().optional(),
  serviceId: z.string().uuid(),
  serviceName: z.string().min(1, { message: "Nama layanan wajib diisi." }),
  description: z.string().optional().nullable(),
  price: z.number().min(0.01, { message: "Harga layanan harus lebih dari 0." }),
  quantity: z.number().int().min(1).default(1),
  totalPrice: z
    .number()
    .min(0, { message: "Total harga tidak boleh negatif." }),
});

export type TransactionServiceDetails = z.infer<
  typeof transactionServiceDetailsSchema
>;
