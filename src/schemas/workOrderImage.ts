import { z } from "zod";

export const workOrderImageFormSchema = z.object({
  id: z.string().optional(), // ID opsional karena hanya ada saat edit
  workOrderId: z.string().min(1, "Work Order wajib diisi."),
  imageUrl: z.string().url("URL Gambar tidak valid.").min(1, "URL Gambar wajib diisi."),
  description: z.string().nullable().optional(),
  uploadedBy: z.string().nullable().optional(), // ID karyawan yang mengunggah
});

// Ekspor tipe WorkOrderImageFormValues langsung dari skema Zod
export type WorkOrderImageFormValues = z.infer<typeof workOrderImageFormSchema>;
