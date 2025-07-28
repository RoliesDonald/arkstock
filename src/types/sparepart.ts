// Import Enums dari Prisma Client
import { PartVariant, SparePartCategory, SparePartStatus } from "@prisma/client";

// Interface untuk data mentah yang diterima langsung dari API
export interface RawSparePartApiResponse {
  id: string;
  partNumber: string;
  sku: string | null;
  partName: string;
  variant: string; // Dari API, akan berupa string
  make: string | null;
  price: number; // Dari API, bisa berupa number atau string, kita asumsikan number
  unit: string;
  description: string | null;
  stock: number; // Dari API, akan berupa number
  initialStock: number; // Dari API, akan berupa number
  brand: string | null;
  manufacturer: string | null;
  category: string; // Dari API, akan berupa string
  status: string; // Dari API, akan berupa string
  createdAt: string; // Dari API, akan berupa string ISO
  updatedAt: string; // Dari API, akan berupa string ISO
}

// Interface untuk data SparePart yang sudah diformat di frontend (dengan Date objects dan Enums)
export interface SparePart {
  id: string;
  partNumber: string;
  sku: string | null;
  partName: string;
  variant: PartVariant; // Tipe Enum Prisma
  make: string | null;
  price: number; // Tetap number untuk penggunaan di frontend
  unit: string;
  description: string | null;
  stock: number;
  initialStock: number;
  brand: string | null;
  manufacturer: string | null;
  category: SparePartCategory; // Tipe Enum Prisma
  status: SparePartStatus; // Tipe Enum Prisma
  createdAt: Date; // Date object
  updatedAt: Date; // Date object
}
