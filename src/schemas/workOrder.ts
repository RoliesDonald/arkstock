import { z } from "zod";
// Import Enums dari Prisma Client
import { WoProgresStatus, WoPriorityType } from "@prisma/client";

export const workOrderFormSchema = z.object({
  id: z.string().optional(), // ID opsional karena hanya ada saat edit
  workOrderNumber: z.string().min(1, "Nomor Work Order wajib diisi."),
  workOrderMaster: z.string().min(1, "Master Work Order wajib diisi."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal WO tidak valid (YYYY-MM-DD)."),
  settledOdo: z.number().int().min(0, "Odometer tidak boleh negatif.").nullable().optional(),
  remark: z.string().min(1, "Remark wajib diisi."),
  schedule: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal jadwal tidak valid (YYYY-MM-DD).")
    .nullable()
    .optional(),
  serviceLocation: z.string().min(1, "Lokasi Servis wajib diisi."),
  notes: z.string().nullable().optional(),
  vehicleMake: z.string().min(1, "Merk Kendaraan wajib diisi."), // Tetap string
  progresStatus: z.nativeEnum(WoProgresStatus, {
    errorMap: () => ({ message: "Status Progres tidak valid." }),
  }),
  priorityType: z.nativeEnum(WoPriorityType, {
    errorMap: () => ({ message: "Tipe Prioritas tidak valid." }),
  }),
  vehicleId: z.string().min(1, "Kendaraan wajib diisi."),
  customerId: z.string().min(1, "Customer wajib diisi."),
  carUserId: z.string().min(1, "Pengguna Kendaraan wajib diisi."),
  vendorId: z.string().min(1, "Vendor wajib diisi."),
  mechanicId: z.string().nullable().optional(),
  driverId: z.string().nullable().optional(),
  driverContact: z.string().nullable().optional(),
  approvedById: z.string().nullable().optional(),
  requestedById: z.string().nullable().optional(),
  locationId: z.string().nullable().optional(),
});

// Ekspor tipe WorkOrderFormValues langsung dari skema Zod
export type WorkOrderFormValues = z.infer<typeof workOrderFormSchema>;
