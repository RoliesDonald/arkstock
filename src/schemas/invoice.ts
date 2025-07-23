import { z } from "zod";
import { InvoiceStatus } from "@prisma/client";

export const invoiceFormSchema = z.object({
  id: z.string().optional(), // ID opsional karena hanya ada saat edit
  invoiceNumber: z.string().min(1, "Nomor Invoice wajib diisi."),
  invoiceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal invoice tidak valid (YYYY-MM-DD)."),
  requestOdo: z.number().int().min(0, "Odometer permintaan tidak boleh negatif."),
  actualOdo: z.number().int().min(0, "Odometer aktual tidak boleh negatif."),
  remark: z.string().nullable().optional(),
  finishedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal selesai tidak valid (YYYY-MM-DD)."),
  totalAmount: z.number().min(0, "Jumlah total tidak boleh negatif."),
  status: z.nativeEnum(InvoiceStatus, {
    errorMap: () => ({ message: "Status Invoice tidak valid." }),
  }),
  workOrderId: z.string().min(1, "Work Order wajib diisi."),
  vehicleId: z.string().min(1, "Kendaraan wajib diisi."),
  accountantId: z.string().nullable().optional(),
  approvedById: z.string().nullable().optional(),
});

// Ekspor tipe InvoiceFormValues langsung dari skema Zod
export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
