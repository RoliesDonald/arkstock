import { z } from "zod";

export const workOrderServiceFormSchema = z.object({
  id: z.string().optional(), // ID opsional karena hanya ada saat edit
  workOrderId: z.string().min(1, "Work Order wajib diisi."),
  serviceId: z.string().min(1, "Jasa wajib diisi."),
  quantity: z.number().int().min(1, "Kuantitas minimal 1."),
  unitPrice: z.number().min(0, "Harga satuan tidak boleh negatif."),
  totalPrice: z.number().min(0, "Jumlah total tidak boleh negatif."),
});

// Ekspor tipe WorkOrderServiceFormValues langsung dari skema Zod
export type WorkOrderServiceFormValues = z.infer<typeof workOrderServiceFormSchema>;
