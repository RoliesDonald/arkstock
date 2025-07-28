import { z } from "zod";

export const invoiceServiceFormSchema = z.object({
  id: z.string().optional(), // ID opsional karena hanya ada saat edit
  invoiceId: z.string().min(1, "Invoice wajib diisi."),
  serviceId: z.string().min(1, "Jasa wajib diisi."),
  quantity: z.number().int().min(1, "Kuantitas minimal 1."),
  unitPrice: z.number().min(0, "Harga satuan tidak boleh negatif."),
  totalPrice: z.number().min(0, "Jumlah total tidak boleh negatif."),
});

// Ekspor tipe InvoiceServiceFormValues langsung dari skema Zod
export type InvoiceServiceFormValues = z.infer<typeof invoiceServiceFormSchema>;
