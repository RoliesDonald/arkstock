import { WarehouseType } from "@prisma/client";

// Interface untuk data mentah yang diterima langsung dari API
export interface RawWarehouseApiResponse {
  id: string;
  name: string;
  location: string;
  warehouseType: string; // Dari API, akan berupa string
  createdAt: string; // Dari API, akan berupa string ISO
  updatedAt: string; // Dari API, akan berupa string ISO
}

// Interface untuk data Warehouse yang sudah diformat di frontend (dengan Date objects dan Enums)
export interface Warehouse {
  id: string;
  name: string;
  location: string;
  warehouseType: WarehouseType; // Tipe Enum Prisma
  createdAt: Date; // Date object
  updatedAt: Date; // Date object
}
