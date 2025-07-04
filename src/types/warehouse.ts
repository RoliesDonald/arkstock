import * as z from "zod";

import React from "react";

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  isMainWarehouse: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const warehouseFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Nama Gudang wajib diisi." }),
  location: z.string().min(1, { message: "Lokasi wajib di isi" }),
  isMainWarehouse: z.boolean().default(false),
});

export type WarehouseFormValues = z.infer<typeof warehouseFormSchema>;
export type WarehouseCreateInput = Omit<
  Warehouse,
  "id" | "createdAt" | "updatedAt"
>;

export type WarehouseUpdateInput = Omit<Warehouse, "createdAt" | "updatedAt">;
