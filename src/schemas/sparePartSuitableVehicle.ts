import { z } from "zod";

export const sparePartSuitableVehicleFormSchema = z.object({
  // Tidak ada ID karena ini adalah composite key, dan kita tidak mengirim ID untuk POST/PUT
  sparePartId: z.string().min(1, "Spare Part wajib diisi."),
  vehicleMake: z.string().min(1, "Merek kendaraan wajib diisi."),
  vehicleModel: z.string().min(1, "Model kendaraan wajib diisi."),
  trimLevel: z.string().nullable().optional(),
  modelYear: z
    .number()
    .int()
    .min(1900, "Tahun model tidak valid.")
    .max(2100, "Tahun model tidak valid.")
    .nullable()
    .optional(),
});

// Ekspor tipe SparePartSuitableVehicleFormValues langsung dari skema Zod
export type SparePartSuitableVehicleFormValues = z.infer<typeof sparePartSuitableVehicleFormSchema>;
