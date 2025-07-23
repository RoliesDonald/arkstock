import { z } from "zod";
// Import Enums dari Prisma Client
import { PartVariant, SparePartCategory, SparePartStatus } from "@prisma/client";

export const sparePartFormSchema = z.object({
  id: z.string().optional(), // ID opsional karena hanya ada saat edit
  partNumber: z.string().min(1, "Nomor Part wajib diisi."),
  sku: z.string().nullable().optional(),
  partName: z.string().min(1, "Nama Part wajib diisi."),
  variant: z.nativeEnum(PartVariant, {
    errorMap: () => ({ message: "Varian Part tidak valid." }),
  }),
  make: z.string().nullable().optional(),
  price: z.number().min(0, "Harga tidak boleh negatif."),
  unit: z.string().min(1, "Unit wajib diisi."),
  description: z.string().nullable().optional(),
  stock: z.number().int().min(0, "Stok tidak boleh negatif.").optional(), // Opsional karena mungkin tidak diisi saat create
  initialStock: z.number().int().min(0, "Stok awal tidak boleh negatif.").optional(), // Opsional
  brand: z.string().nullable().optional(),
  manufacturer: z.string().nullable().optional(),
  category: z.nativeEnum(SparePartCategory, {
    errorMap: () => ({ message: "Kategori Spare Part tidak valid." }),
  }),
  status: z.nativeEnum(SparePartStatus, {
    errorMap: () => ({ message: "Status Spare Part tidak valid." }),
  }),
});

// Ekspor tipe SparePartFormValues langsung dari skema Zod
export type SparePartFormValues = z.infer<typeof sparePartFormSchema>;
