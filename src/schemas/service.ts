import { z } from "zod";

export const serviceFormSchema = z.object({
  id: z.string().optional(), // ID opsional karena hanya ada saat edit
  name: z.string().min(1, "Nama Jasa wajib diisi."),
  description: z.string().nullable().optional(),
  price: z.number().min(0, "Harga tidak boleh negatif."),
  category: z.string().nullable().optional(),
  subCategory: z.string().nullable().optional(),
  tasks: z.array(z.string()).optional(), // Array of strings, opsional
});

// Ekspor tipe ServiceFormValues langsung dari skema Zod
export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
