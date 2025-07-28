// src/types/units.ts

// Import Enums dari Prisma Client
import { UnitType, UnitCategory } from "@prisma/client";

// Interface untuk data mentah yang diterima langsung dari API
export interface RawUnitApiResponse {
  id: string;
  name: string;
  symbol: string | null;
  unitType: string; // Dari API, akan berupa string
  unitCategory: string; // Dari API, akan berupa string
  description: string | null;
  createdAt: string; // Dari API, akan berupa string ISO
  updatedAt: string; // Dari API, akan berupa string ISO
}

// Interface untuk data Unit yang sudah diformat di frontend (dengan Date objects dan Enums)
export interface Unit {
  id: string;
  name: string;
  symbol: string | null;
  unitType: UnitType;
  unitCategory: UnitCategory;
  description: string | null;
  createdAt: Date; // Date object
  updatedAt: Date; // Date object
}

// CATATAN: UnitFormValues TIDAK didefinisikan di sini.
// Ia akan didefinisikan di src/schemas/unit.ts menggunakan z.infer.
