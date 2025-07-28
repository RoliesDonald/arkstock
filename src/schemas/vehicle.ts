import { z } from "zod";
// Import Enums dari Prisma Client
import {
  VehicleType,
  VehicleCategory,
  VehicleFuelType,
  VehicleTransmissionType,
  VehicleStatus,
} from "@prisma/client";

export const vehicleFormSchema = z.object({
  id: z.string().optional(), // ID opsional karena hanya ada saat edit
  licensePlate: z.string().min(1, "Nomor Plat wajib diisi."),
  vehicleMake: z.string().min(1, "Merk Kendaraan wajib diisi."),
  model: z.string().min(1, "Model wajib diisi."),
  trimLevel: z.string().nullable().optional(),
  vinNum: z.string().nullable().optional(),
  engineNum: z.string().nullable().optional(),
  chassisNum: z.string().nullable().optional(),
  yearMade: z
    .number()
    .int()
    .min(1900, "Tahun pembuatan minimal 1900.")
    .max(new Date().getFullYear() + 1, "Tahun pembuatan tidak boleh di masa depan."),
  color: z.string().min(1, "Warna wajib diisi."),
  vehicleType: z.nativeEnum(VehicleType, {
    errorMap: () => ({ message: "Tipe Kendaraan tidak valid." }),
  }),
  vehicleCategory: z.nativeEnum(VehicleCategory, {
    errorMap: () => ({ message: "Kategori Kendaraan tidak valid." }),
  }),
  fuelType: z.nativeEnum(VehicleFuelType, {
    errorMap: () => ({ message: "Tipe Bahan Bakar tidak valid." }),
  }),
  transmissionType: z.nativeEnum(VehicleTransmissionType, {
    errorMap: () => ({ message: "Tipe Transmisi tidak valid." }),
  }),
  lastOdometer: z.number().int().min(0, "Odometer tidak boleh negatif."),
  lastServiceDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal servis terakhir tidak valid (YYYY-MM-DD)."),
  status: z.nativeEnum(VehicleStatus, {
    errorMap: () => ({ message: "Status Kendaraan tidak valid." }),
  }),
  notes: z.string().nullable().optional(),
  ownerId: z.string().min(1, "Pemilik wajib diisi."), // ID Perusahaan pemilik
  carUserId: z.string().nullable().optional(), // ID Perusahaan pengguna (jika ada)
});

// Ekspor tipe VehicleFormValues langsung dari skema Zod
export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;
