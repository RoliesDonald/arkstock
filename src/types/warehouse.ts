import * as z from "zod";

export enum WarehouseType {
  CENTRAL_WAREHOUSE = "CENTRAL_WAREHOUSE",
  BRANCH_WAREHOUSE = "BRANCH_WAREHOUSE",
  SERVICE_CAR_WAREHOUSE = "SERVICE_CAR_WAREHOUSE",
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  warehouseType: WarehouseType;
  createdAt: Date;
  updatedAt: Date;
}

export const warehouseFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Nama Gudang wajib diisi." }),
  location: z.string().min(1, { message: "Lokasi wajib di isi" }),
  warehouseType: z.nativeEnum(WarehouseType, {
    errorMap: () => ({ message: "Tipe Gudang wajib dipilih." }),
  }),
});

export type WarehouseFormValues = z.infer<typeof warehouseFormSchema>;
export type WarehouseCreateInput = Omit<
  Warehouse,
  "id" | "createdAt" | "updatedAt"
>;

export type WarehouseUpdateInput = Omit<Warehouse, "createdAt" | "updatedAt">;
