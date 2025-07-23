import { z } from "zod";

export const invoiceItemFormSchema = z.object({
  id: z.string().optional(), // ID opsional karena hanya ada saat edit
  invoiceId: z.string().min(1, "Invoice wajib diisi."),
  sparePartId: z.string().min(1, "Spare Part wajib diisi."),
  quantity: z.number().int().min(1, "Kuantitas minimal 1."),
  unitPrice: z.number().min(0, "Harga satuan tidak boleh negatif."),
  totalPrice: z.number().min(0, "Jumlah total tidak boleh negatif."),
});

// Ekspor tipe InvoiceItemFormValues langsung dari skema Zod
export type InvoiceItemFormValues = z.infer<typeof invoiceItemFormSchema>;
