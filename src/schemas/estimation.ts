import { z } from "zod";
// Import Enums dari Prisma Client
import { EstimationStatus } from "@prisma/client";

export const estimationFormSchema = z.object({
  id: z.string().optional(), // ID opsional karena hanya ada saat edit
  estimationNumber: z.string().min(1, "Nomor Estimasi wajib diisi."),
  estimationDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal estimasi tidak valid (YYYY-MM-DD)."),
  requestOdo: z.number().int().min(0, "Odometer permintaan tidak boleh negatif."),
  actualOdo: z.number().int().min(0, "Odometer aktual tidak boleh negatif."),
  remark: z.string().min(1, "Remark wajib diisi."),
  notes: z.string().nullable().optional(),
  finishedDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal selesai tidak valid (YYYY-MM-DD).")
    .nullable()
    .optional(),
  totalEstimatedAmount: z.number().min(0, "Jumlah estimasi tidak boleh negatif."),
  status: z.nativeEnum(EstimationStatus, {
    errorMap: () => ({ message: "Status Estimasi tidak valid." }),
  }),
  workOrderId: z.string().min(1, "Work Order wajib diisi."),
  vehicleId: z.string().min(1, "Kendaraan wajib diisi."),
  mechanicId: z.string().nullable().optional(),
  accountantId: z.string().nullable().optional(),
  approvedById: z.string().nullable().optional(),
});

// Ekspor tipe EstimationFormValues langsung dari skema Zod
export type EstimationFormValues = z.infer<typeof estimationFormSchema>;
