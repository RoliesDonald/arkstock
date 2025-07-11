import * as z from "zod";

import { SparePart } from "./sparepart";
import { Warehouse } from "./warehouse";

export interface WarehouseStock {
  id: string; // UUID unik untuk kombinasi sparePartId dan warehouseId
  sparePartId: string; // FK ke SparePart
  warehouseId: string; // FK ke Warehouse
  currentStock: number; // Jumlah stok saat ini
  createdAt: Date;
  updatedAt: Date;

  // Relasi (opsional, untuk populasi di frontend/API)
  sparePart?: SparePart;
  warehouse?: Warehouse;
}

// untuk update manual
export const warehouseStockFormSchema = z.object({
  id: z.string().uuid().optional(),
  sparePartId: z.string().uuid({ message: "ID Spare Part wajib diisi." }),
  warehouseId: z.string().uuid({ message: "ID Gudang wajib diisi." }),
  currentStock: z.coerce
    .number()
    .int()
    .min(0, { message: "Stok tidak boleh negatif." }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type WarehouseStockFormValues = z.infer<typeof warehouseStockFormSchema>;

// Tipe untuk input create
export type WarehouseStockCreateInput = Omit<
  WarehouseStock,
  "id" | "createdAt" | "updatedAt" | "sparePart" | "warehouse"
>;

// Tipe untuk update
export type WarehouseStockUpdateInput = Omit<
  WarehouseStock,
  "createdAt" | "updatedAt" | "sparePart" | "warehouse" | "id"
>;
