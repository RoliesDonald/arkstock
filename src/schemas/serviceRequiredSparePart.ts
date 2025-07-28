import { z } from "zod";

export const serviceRequiredSparePartFormSchema = z.object({
  id: z.string().optional(), // ID opsional karena hanya ada saat edit
  serviceId: z.string().min(1, "Jasa wajib diisi."),
  sparePartId: z.string().min(1, "Spare Part wajib diisi."),
  quantity: z.number().int().min(1, "Kuantitas minimal 1."),
});

// Ekspor tipe ServiceRequiredSparePartFormValues langsung dari skema Zod
export type ServiceRequiredSparePartFormValues = z.infer<typeof serviceRequiredSparePartFormSchema>;
