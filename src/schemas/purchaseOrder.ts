import { z } from "zod";
// Import Enums dari Prisma Client
import { PurchaseOrderStatus } from "@prisma/client";

export const purchaseOrderFormSchema = z.object({
  id: z.string().optional(), // ID opsional karena hanya ada saat edit
  poNumber: z.string().min(1, "Nomor PO wajib diisi."),
  poDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal PO tidak valid (YYYY-MM-DD)."),
  supplierId: z.string().min(1, "Supplier wajib diisi."),
  deliveryAddress: z.string().nullable().optional(),
  subtotal: z.number().min(0, "Subtotal tidak boleh negatif."),
  tax: z.number().min(0, "Pajak tidak boleh negatif."),
  totalAmount: z.number().min(0, "Jumlah total tidak boleh negatif."),
  deliveryDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal pengiriman tidak valid (YYYY-MM-DD).")
    .nullable()
    .optional(),
  status: z.nativeEnum(PurchaseOrderStatus, {
    errorMap: () => ({ message: "Status PO tidak valid." }),
  }),
  requestedById: z.string().nullable().optional(),
  approvedById: z.string().nullable().optional(),
  remark: z.string().nullable().optional(),
  rejectionReason: z.string().nullable().optional(),
});

// Ekspor tipe PurchaseOrderFormValues langsung dari skema Zod
export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderFormSchema>;
