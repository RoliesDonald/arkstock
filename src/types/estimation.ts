import { EstimationStatus } from "@prisma/client";

// Interface untuk data mentah yang diterima langsung dari API
export interface RawEstimationApiResponse {
  id: string;
  estimationNumber: string;
  estimationDate: string; // Dari API, akan berupa string ISO
  requestOdo: number;
  actualOdo: number;
  remark: string;
  notes: string | null;
  finishedDate: string | null; // Dari API, akan berupa string ISO
  totalEstimatedAmount: number; // Dari API, bisa berupa number atau string
  status: string; // Dari API, akan berupa string
  workOrderId: string;
  vehicleId: string;
  mechanicId: string | null;
  accountantId: string | null;
  approvedById: string | null;
  createdAt: string; // Dari API, akan berupa string ISO
  updatedAt: string; // Dari API, akan berupa string ISO

  // Relasi opsional jika disertakan dalam respons API
  workOrder?: {
    id: string;
    workOrderNumber: string;
  };
  vehicle?: {
    id: string;
    licensePlate: string;
    vehicleMake: string;
    model: string;
  };
  mechanic?: {
    id: string;
    name: string;
  };
  accountant?: {
    id: string;
    name: string;
  };
  approvedBy?: {
    id: string;
    name: string;
  };
  // estimationItems dan estimationServices tidak langsung di sini untuk kesederhanaan
}

// Interface untuk data Estimation yang sudah diformat di frontend (dengan Date objects dan Enums)
export interface Estimation {
  id: string;
  estimationNumber: string;
  estimationDate: Date; // Date object
  requestOdo: number;
  actualOdo: number;
  remark: string;
  notes: string | null;
  finishedDate: Date | null; // Date object
  totalEstimatedAmount: number;
  status: EstimationStatus; // Tipe Enum Prisma
  workOrderId: string;
  vehicleId: string;
  mechanicId: string | null;
  accountantId: string | null;
  approvedById: string | null;
  createdAt: Date; // Date object
  updatedAt: Date; // Date object

  // Relasi opsional
  workOrder?: {
    id: string;
    workOrderNumber: string;
  };
  vehicle?: {
    id: string;
    licensePlate: string;
    vehicleMake: string;
    model: string;
  };
  mechanic?: {
    id: string;
    name: string;
  };
  accountant?: {
    id: string;
    name: string;
  };
  approvedBy?: {
    id: string;
    name: string;
  };
}

// CATATAN: EstimationFormValues TIDAK didefinisikan di sini.
// Ia akan didefinisikan di src/schemas/estimation.ts menggunakan z.infer.
