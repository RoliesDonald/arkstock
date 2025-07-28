import { z } from "zod";

export const warehouseStockFormSchema = z.object({
  id: z.string().optional(), // ID opsional karena hanya ada saat edit
  sparePartId: z.string().min(1, "Spare Part wajib diisi."),
  warehouseId: z.string().min(1, "Gudang wajib diisi."),
  currentStock: z.number().int().min(0, "Stok saat ini tidak boleh negatif."),
});

// Ekspor tipe WarehouseStockFormValues langsung dari skema Zod
export type WarehouseStockFormValues = z.infer<typeof warehouseStockFormSchema>;
