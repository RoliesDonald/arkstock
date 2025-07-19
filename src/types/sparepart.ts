// src/types/sparepart.ts
import * as z from "zod";

// Enum untuk varian suku cadang
export enum PartVariant {
  OEM = "OEM", // Original Equipment Manufacturer
  AFTERMARKET = "AFTERMARKET", // Suku cadang pengganti
  RECONDITIONED = "RECONDITIONED", // Suku cadang rekondisi
  USED = "USED", // Suku cadang bekas
  GBOX = "GBOX", // Genuine Box
}

// Interface untuk kompatibilitas suku cadang dengan kendaraan tertentu
export interface SparePartCompatibility {
  sparePartId: string;
  vehicleMake: string;
  vehicleModel: string;
  trimLevel?: string | null;
  modelYear?: number | null;
}

// Skema Zod untuk SparePartCompatibility
export const sparePartCompatibilitySchema = z.object({
  sparePartId: z.string().min(1, { message: "Merek kendaraan wajib diisi." }),
  vehicleMake: z.string().min(1, { message: "Model kendaraan wajib diisi." }),
  vehicleModel: z.string().min(1, { message: "Varian kendaraan wajib diisi." }),
  trimLevel: z.string().nullable().optional(),
  modelYear: z.coerce.number().int().nullable().optional(),
});

// Skema Zod untuk form penambahan/edit SparePart
export const sparePartFormSchema = z.object({
  id: z.string().optional(),
  sku: z.string().optional(),
  partName: z
    .string()
    .min(2, { message: "Nama suku cadang wajib diisi (minimal 2 karakter)." }),
  partNumber: z
    .string()
    .min(3, { message: "Nomor part wajib diisi (minimal 3 karakter)." }),
  description: z.string().nullable().optional(),
  unit: z
    .string()
    .min(1, { message: "Satuan wajib diisi (contoh: Pcs, Set, Liter)." }),
  initialStock: z.coerce
    .number()
    .int()
    .min(0, { message: "Stok awal tidak boleh negatif." }),
  minStock: z.coerce
    .number()
    .int()
    .min(0, { message: "Stok minimum tidak boleh negatif." })
    .nullable()
    .optional(),
  price: z.coerce.number().min(0, { message: "Harga tidak boleh negatif." }),
  variant: z.nativeEnum(PartVariant, {
    errorMap: () => ({ message: "Varian suku cadang wajib dipilih." }),
  }),
  brand: z
    .string()
    .min(1, { message: "Merek (brand) suku cadang wajib diisi." })
    .optional()
    .nullable(),
  manufacturer: z
    .string()
    .min(1, { message: "Produsen suku cadang wajib diisi." })
    .optional()
    .nullable(),
  compatibility: z.array(sparePartCompatibilitySchema).optional(),
});

export type SparePartFormValues = z.infer<typeof sparePartFormSchema>;

// Interface untuk SparePart di Redux State (tanggal sebagai string)
export interface SparePart {
  id: string; // UUID
  sku?: string | null;
  partName: string;
  partNumber: string;
  description?: string | null;
  unit: string;
  stock: number;
  minStock?: number | null;
  initialStock: number;
  price: number;
  variant: PartVariant;
  brand?: string | null;
  manufacturer?: string | null;
  SparePartSuitableVehicles?: SparePartCompatibility[];
  createdAt: string; // <-- STRING
  updatedAt: string; // <-- STRING

  invoiceItems?: any[];
  estimationItems?: any[];
  purchaseOrderItems?: any[];
}

// Interface untuk Raw SparePart ApiResponse (tanggal sebagai Date objek)
export interface RawSparePartApiResponse {
  id: string;
  sku?: string | null;
  partName: string;
  partNumber: string;
  description?: string | null;
  unit: string;
  stock: number;
  minStock?: number | null;
  initialStock: number;
  price: number;
  variant: PartVariant;
  brand?: string | null;
  manufacturer?: string | null;
  SparePartSuitableVehicles?: SparePartCompatibility[]; // Asumsi ini tidak punya Date
  createdAt: Date; // <-- DATE
  updatedAt: Date; // <-- DATE

  invoiceItems?: any[];
  estimationItems?: any[];
  purchaseOrderItems?: any[];
}

// Skema untuk item spare part dalam transaksi (InvoiceItem, EstimationItem)
export const transactionPartDetailsSchema = z.object({
  sparePartId: z.string().min(1, { message: "ID suku cadang wajib diisi." }),
  partName: z.string().min(1, { message: "Nama item wajib diisi." }),
  partNumber: z.string().min(1, { message: "Nomor part wajib diisi." }),
  quantity: z.coerce.number().int().min(1).default(1),
  unit: z.string().min(1, { message: "Satuan wajib diisi." }),
  variant: z.nativeEnum(PartVariant, {
    errorMap: () => ({ message: "Varian suku cadang wajib dipilih." }),
  }),
  unitPrice: z.coerce
    .number()
    .min(0.01, { message: "Harga satuan harus lebih dari 0." }),
  totalPrice: z.coerce
    .number()
    .min(0, { message: "Total harga tidak boleh negatif." }),
});

export type TransactionPartDetails = z.infer<
  typeof transactionPartDetailsSchema
>;
