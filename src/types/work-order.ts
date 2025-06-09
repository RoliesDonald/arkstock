// src/types/work-order.d.ts
import * as z from "zod";

// Enum WoProgressStatus yang diperbarui
export enum WoProgressStatus {
  DRAFT = "Draft",
  REQUESTED = "Requested",
  PENDING_APPROVAL_RENTAL = "Pending by Rental",
  PENDING_VENDOR_ASSIGN = "Pending by Vendor",
  ON_PROCESS = "On Process",
  WAITING_PART = "Waiting Part",
  WAITING_ESTIMATION_APPROVAL = "Waiting Estimation",
  FINISHED = "Finished",
  INVOICED = "Invoiced",
  NEW = "NEW",
  CANCELED = "Canceled",
  REJECTED = "Rejected",
}

// Enum WoPriorityType yang diperbarui
export enum WoPriorityType {
  NORMAL = "Normal",
  URGENT = "Urgent",
  EMERGENCY = "Emergency",
}

// Skema Zod untuk validasi form
export const workOrderFormSchema = z.object({
  woNumber: z.string().min(1, { message: "Nomor WO wajib diisi." }),
  woMaster: z.string().min(1, { message: "Nomor WO Master wajib diisi." }),
  date: z.date({
    required_error: "Tanggal request wajib diisi.",
  }),
  vehicleMake: z.string().min(1, { message: "Merk kendaraan wajib diisi." }),
  model: z.string().min(1, { message: "Model kendaraan wajib diisi." }),
  trimLevel: z.string().nullable().optional(),
  licensePlate: z.string().min(1, { message: "Plat nomor wajib diisi." }),
  vinNum: z.string().min(1, { message: "Nomor VIN wajib diisi." }),
  engineNum: z.string().min(1, { message: "Nomor mesin wajib diisi." }),
  settledOdo: z.coerce
    .number()
    .min(0, { message: "Odometer wajib diisi dan harus angka." }),
  customer: z.string().min(1, { message: "Customer wajib diisi." }),
  carUser: z.string().min(1, { message: "Pengguna mobil wajib diisi." }),
  vendor: z.string().min(1, { message: "Vendor wajib diisi." }),
  remark: z.string().min(1, { message: "Keterangan/keluhan wajib diisi." }),
  mechanic: z.string().min(1, { message: "Mekanik wajib diisi." }),
  schedule: z.date({
    required_error: "Tanggal jadwal wajib diisi.",
  }),
  vehicleLocation: z
    .string()
    .min(1, { message: "Lokasi kendaraan wajib diisi." }),
  notes: z.string().nullable().optional(),
  driver: z.string().nullable().optional(),
  driverContact: z.string().nullable().optional(),
  approvedBy: z.string().nullable().optional(),
  custPicContact: z.string().nullable().optional(),
  requestBy: z.string().nullable().optional(),
  progresStatus: z.nativeEnum(WoProgressStatus, {
    // Menggunakan enum yang baru
    required_error: "Status progres wajib dipilih.",
  }),
  priorityType: z.nativeEnum(WoPriorityType, {
    // Menggunakan enum yang baru
    required_error: "Tipe prioritas wajib dipilih.",
  }),
});

// Infer type dari skema Zod
export type WorkOrderFormValues = z.infer<typeof workOrderFormSchema>;
