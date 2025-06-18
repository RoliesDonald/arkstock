// src/types/vehicle.ts
import * as z from "zod";

export const vehicleFormSchema = z.object({
  licensePlate: z.string().min(1, { message: "Nomor plat wajib diisi." }),
  vehicleMake: z.string().min(1, { message: "Merk kendaraan wajib diisi." }),
  model: z.string().min(1, { message: "Model kendaraan wajib diisi." }),
  trimLevel: z.string().optional(),
  modelYear: z.coerce
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 2)
    .optional(),
  bodyStyle: z.string().optional(),
  color: z.string().optional(),
  vinNum: z.string().optional(),
  engineNum: z.string().optional(),
  settledOdo: z.coerce
    .number()
    .int()
    .min(0, { message: "Odometer tidak boleh negatif." }),
  ownerId: z.string().min(1, { message: "ID pemilik wajib diisi." }),
  carUserId: z
    .string()
    .min(1, { message: "ID pengguna kendaraan wajib diisi." }),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

export interface Vehicle {
  id: string; // UUID
  licensePlate: string;
  vehicleMake: string;
  model: string;
  trimLevel?: string;
  modelYear?: number;
  bodyStyle?: string;
  color?: string;
  vinNum?: string;
  engineNum?: string;
  settledOdo: number;
  ownerId: string;
  carUserId: string;
  createdAt: Date;
  updatedAt: Date;

  // Relasi (tidak diisi di form, hanya di entitas lengkap)
  // owner?: Company;
  // carUser?: Company;
  // workOrders?: WorkOrder[];
  // invoices?: Invoice[];
  // estimations?: Estimation[];
}
