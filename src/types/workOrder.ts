// src/types/workOrder.ts
import * as z from "zod";

export enum WoProgresStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  ON_PROCESS = "ON_PROCESS",
  WAITING_APPROVAL = "WAITING_APPROVAL",
  WAITING_PART = "WAITING_PART",
  FINISHED = "FINISHED",
  CANCELED = "CANCELED",
  INVOICE_CREATED = "INVOICE_CREATED",
}

export enum WoPriorityType {
  NORMAL = "NORMAL",
  URGENT = "URGENT",
  EMERGENCY = "EMERGENCY",
}

// Skema Zod untuk form WorkOrder
export const workOrderFormSchema = z.object({
  woNumber: z.string().optional(),
  woMaster: z.string().min(1, { message: "Nomor WO Master wajib diisi." }),
  date: z.date({ required_error: "Tanggal WO wajib diisi." }),
  settledOdo: z.coerce
    .number()
    .int()
    .min(0, { message: "Odometer tidak boleh negatif." })
    .nullable()
    .optional(),
  remark: z.string().min(1, { message: "Keluhan/kerusakan wajib diisi." }),
  schedule: z.date().optional(),
  serviceLocation: z.string().min(1, { message: "Lokasi servis wajib diisi." }),
  notes: z.string().optional().nullable(),
  vehicleMake: z.string().min(1, { message: "Merk kendaraan wajib diisi." }), // Ini mungkin redundan jika vehicleId ada
  progresStatus: z.nativeEnum(WoProgresStatus),
  priorityType: z.nativeEnum(WoPriorityType),
  vehicleId: z.string().min(1, { message: "Kendaraan wajib dipilih." }),
  customerId: z.string().min(1, { message: "Customer wajib dipilih." }),
  carUserId: z
    .string()
    .min(1, { message: "Pengguna kendaraan wajib dipilih." }),
  vendorId: z.string().min(1, { message: "Vendor (bengkel) wajib dipilih." }),
  mechanicId: z.string().optional().nullable(),
  driverId: z.string().optional().nullable(),
  driverContact: z.string().optional().nullable(),
  approvedById: z.string().optional().nullable(),
  requestedById: z.string().optional().nullable(),
  locationId: z.string().optional().nullable(),
});

export type WorkOrderFormValues = z.infer<typeof workOrderFormSchema>;

export interface WorkOrder {
  id: string; // UUID
  woNumber: string;
  woMaster: string;
  date: Date;
  settledOdo: number | null;
  remark: string;
  schedule?: Date | null;
  serviceLocation: string;
  notes?: string | null;
  vehicleMake: string; // Bisa diambil dari relasi Vehicle
  progresStatus: WoProgresStatus;
  priorityType: WoPriorityType;
  vehicleId: string; // FK
  customerId: string; // FK
  carUserId: string; // FK
  vendorId: string; // FK
  mechanicId?: string | null; // FK
  driverId?: string | null; // FK
  driverContact?: string | null;
  approvedById?: string | null; // FK
  requestedById?: string | null; // FK
  locationId?: string | null; // FK
  createdAt: Date;
  updatedAt: Date;

  // Relasi (tidak diisi di form, hanya di entitas lengkap)
  // vehicle?: Vehicle;
  // customer?: Company;
  // carUser?: Company;
  // vendor?: Company;
  // mechanic?: User;
  // driver?: User;
  // approvedBy?: User;
  // requestedBy?: User;
  // invoice?: Invoice;
  // estimation?: Estimation;
  // Location?: Location;
}
