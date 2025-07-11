import * as z from "zod";
import { Vehicle } from "./vehicle";
import { Company } from "./companies";
import { Employee } from "./employee";
import { Invoice } from "./invoice";
import { Estimation } from "./estimation";

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
  id: z.string().optional(),
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
  schedule: z.date().optional().nullable(),
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
  workOrderNumber: string;
  workOrderMaster: string;
  date: Date;
  settledOdo: number | null;
  remark: string;
  schedule?: Date | null;
  serviceLocation: string;
  notes?: string | null;
  vehicleMake: string; // Bisa diambil dari relasi Vehicle
  progresStatus: WoProgresStatus;
  priorityType: WoPriorityType;
  vehicleId: string;
  customerId: string;
  carUserId: string;
  vendorId: string;
  mechanicId?: string | null;
  driverId?: string | null;
  driverContact?: string | null;
  approvedById?: string | null;
  requestedById?: string | null;
  locationId?: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relasi (tidak diisi di form, hanya di entitas lengkap)
  vehicle?: Vehicle;
  customer?: Company;
  carUser?: Company;
  vendor?: Company;
  mechanic?: Employee;
  driver?: Employee;
  approvedBy?: Employee;
  requestedBy?: Employee;
  invoice?: Invoice;
  estimation?: Estimation;
  location?: Location;
}
