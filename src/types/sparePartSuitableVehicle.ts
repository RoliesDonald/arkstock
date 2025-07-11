import * as z from "zod";

// Zod schema untuk join table 'SparePartSuitableVehicle'
export const sparePartSuitableVehicleSchema = z.object({
  sparePartId: z.string().uuid(),
  vehicleMake: z.string().min(1),
  vehicleModel: z.string().min(1),
  trimLevel: z.string().nullable().optional(),
  modelYear: z.coerce.number().int().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SparePartSuitableVehicle = z.infer<
  typeof sparePartSuitableVehicleSchema
>;
