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
  vehicleMake: string; // Merek kendaraan (contoh: Toyota, Honda)
  model: string; // Model kendaraan (contoh: Avanza, Civic)
  trimLevel?: string | null; // Varian atau tipe model kendaraan (Opsional & Nullable)
  modelYear?: number | null; // Tahun model kendaraan (Opsional & Nullable)
}

// Skema Zod untuk SparePartCompatibility
export const sparePartCompatibilitySchema = z.object({
  vehicleMake: z.string().min(1, { message: "Merek kendaraan wajib diisi." }),
  model: z.string().min(1, { message: "Model kendaraan wajib diisi." }),
  trimLevel: z.string().nullable().optional(),
  modelYear: z.coerce.number().int().nullable().optional(),
});

// Skema Zod untuk form penambahan/edit SparePart
export const sparePartFormSchema = z.object({
  id: z.string().optional(), // Opsional untuk kasus edit
  sku: z.string().optional(),
  name: z
    .string()
    .min(2, { message: "Nama suku cadang wajib diisi (minimal 2 karakter)." }),
  partNumber: z
    .string()
    .min(3, { message: "Nomor part wajib diisi (minimal 3 karakter)." }),
  description: z.string().optional(), // Deskripsi opsional
  unit: z
    .string()
    .min(1, { message: "Satuan wajib diisi (contoh: Pcs, Set, Liter)." }),
  initialStock: z.coerce
    .number()
    .int()
    .min(0, { message: "Stok awal tidak boleh negatif." }), // Ini hanya untuk inisialisasi awal
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
    .min(1, { message: "Merek (brand) suku cadang wajib diisi." }),
  manufacturer: z
    .string()
    .min(1, { message: "Produsen suku cadang wajib diisi." }),
  compatibility: z.array(sparePartCompatibilitySchema).optional(),
});

export type SparePartFormValues = z.infer<typeof sparePartFormSchema>;

// Interface untuk data SparePart lengkap (termasuk ID dan timestamp)
export interface SparePart {
  id: string; // UUID
  sku: string;
  name: string;
  partNumber: string;
  description?: string | null;
  unit: string;
  // HAPUS BARIS INI: stock: number; // <-- Ini yang menyebabkan error. Stok dikelola di WarehouseStock
  minStock?: number | null;
  price: number;
  variant: PartVariant;
  brand: string;
  manufacturer: string;
  compatibility: SparePartCompatibility[];
  createdAt: Date;
  updatedAt: Date;
}

// Skema untuk item spare part dalam transaksi (InvoiceItem, EstimationItem)
export const transactionPartDetailsSchema = z.object({
  sparePartId: z.string().optional(),
  itemName: z.string().min(1, { message: "Nama item wajib diisi." }),
  partNumber: z.string().min(1, { message: "Nomor part wajib diisi." }),
  quantity: z.coerce.number().int().min(1).default(1),
  unit: z.string().min(1, { message: "Satuan wajib diisi." }),
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
