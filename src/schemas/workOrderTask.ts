import { z } from "zod";

export const workOrderTaskFormSchema = z
  .object({
    id: z.string().optional(), // ID opsional karena hanya ada saat edit
    workOrderId: z.string().min(1, "Work Order wajib diisi."),
    taskName: z.string().min(1, "Nama Tugas wajib diisi."),
    description: z.string().nullable().optional(),
    status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED", "CANCELED"]),
    assignedToId: z.string().nullable().optional(),
    startTime: z.string().datetime().nullable().optional(), // Tanggal dalam format string ISO untuk form
    endTime: z.string().datetime().nullable().optional(), // Tanggal dalam format string ISO untuk form
    notes: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      // Validasi: Jika status COMPLETED atau FAILED, endTime harus ada
      if ((data.status === "COMPLETED" || data.status === "FAILED") && !data.endTime) {
        return false;
      }
      return true;
    },
    {
      message: "Waktu Selesai wajib diisi jika status Selesai atau Gagal.",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      // Validasi: Jika startTime ada, endTime harus setelah startTime
      if (data.startTime && data.endTime && new Date(data.startTime) > new Date(data.endTime)) {
        return false;
      }
      return true;
    },
    {
      message: "Waktu Selesai harus setelah Waktu Mulai.",
      path: ["endTime"],
    }
  );

// Ekspor tipe WorkOrderTaskFormValues langsung dari skema Zod
export type WorkOrderTaskFormValues = z.infer<typeof workOrderTaskFormSchema>;
