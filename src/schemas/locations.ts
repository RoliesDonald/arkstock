import { z } from "zod";

export const locationFormSchema = z.object({
  id: z.string().optional(), // ID opsional karena hanya ada saat edit
  name: z.string().min(1, "Nama Lokasi wajib diisi."),
  address: z.string().nullable().optional(),
});

// Ekspor tipe LocationFormValues langsung dari skema Zod
export type LocationFormValues = z.infer<typeof locationFormSchema>;
