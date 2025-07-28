import { z } from "zod";
// Import Enums dari Prisma Client
import { WarehouseType } from "@prisma/client";

export const warehouseFormSchema = z.object({
  id: z.string().optional(), // ID opsional karena hanya ada saat edit
  name: z.string().min(1, "Nama Gudang wajib diisi."),
  location: z.string().min(1, "Lokasi Gudang wajib diisi."),
  warehouseType: z.nativeEnum(WarehouseType, {
    errorMap: () => ({ message: "Tipe Gudang tidak valid." }),
  }),
});

// Ekspor tipe WarehouseFormValues langsung dari skema Zod
export type WarehouseFormValues = z.infer<typeof warehouseFormSchema>;
