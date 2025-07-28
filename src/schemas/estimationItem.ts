import { z } from "zod";

export const estimationItemFormSchema = z.object({
  id: z.string().optional(), // ID opsional karena hanya ada saat edit
  estimationId: z.string().min(1, "Estimasi wajib diisi."),
  sparePartId: z.string().min(1, "Spare Part wajib diisi."),
  quantity: z.number().int().min(1, "Kuantitas minimal 1."),
  price: z.number().min(0, "Harga tidak boleh negatif."),
  subtotal: z.number().min(0, "Subtotal tidak boleh negatif."),
});

// Ekspor tipe EstimationItemFormValues langsung dari skema Zod
export type EstimationItemFormValues = z.infer<typeof estimationItemFormSchema>;
