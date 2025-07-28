import { z } from "zod";
// Import Enums dari Prisma Client
import { UnitType, UnitCategory } from "@prisma/client";

export const unitFormSchema = z.object({
  id: z.string().optional(), // ID opsional karena hanya ada saat edit
  name: z.string().min(1, "Nama Unit wajib diisi."),
  symbol: z.string().nullable().optional(),
  unitType: z.nativeEnum(UnitType, {
    errorMap: () => ({ message: "Tipe Unit tidak valid." }),
  }),
  unitCategory: z.nativeEnum(UnitCategory, {
    errorMap: () => ({ message: "Kategori Unit tidak valid." }),
  }),
  description: z.string().nullable().optional(),
});

// Ekspor tipe UnitFormValues langsung dari skema Zod
export type UnitFormValues = z.infer<typeof unitFormSchema>;
