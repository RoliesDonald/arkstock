import { WoProgresStatus, WoPriorityType } from "@prisma/client";

// Interface untuk data mentah yang diterima langsung dari API
export interface RawWorkOrderApiResponse {
  id: string;
  workOrderNumber: string;
  workOrderMaster: string;
  date: string; // Dari API, akan berupa string ISO
  settledOdo: number | null;
  remark: string;
  schedule: string | null; // Dari API, akan berupa string ISO
  serviceLocation: string;
  notes: string | null;
  vehicleMake: string;
  progresStatus: string; // Dari API, akan berupa string
  priorityType: string; // Dari API, akan berupa string
  vehicleId: string;
  customerId: string;
  carUserId: string;
  vendorId: string;
  mechanicId: string | null;
  driverId: string | null;
  driverContact: string | null;
  approvedById: string | null;
  requestedById: string | null;
  locationId: string | null;
  createdAt: string; // Dari API, akan berupa string ISO
  updatedAt: string; // Dari API, akan berupa string ISO

  // Relasi opsional jika disertakan dalam respons API
  vehicle?: {
    id: string;
    licensePlate: string;
    vehicleMake: string; // Untuk menampilkan di detail
    model: string;
  };
  customer?: {
    id: string;
    companyName: string;
  };
  carUser?: {
    id: string;
    companyName: string;
  };
  vendor?: {
    id: string;
    companyName: string;
  };
  mechanic?: {
    id: string;
    name: string;
  };
  driver?: {
    id: string;
    name: string;
  };
  approvedBy?: {
    id: string;
    name: string;
  };
  requestedBy?: {
    id: string;
    name: string;
  };
  location?: {
    id: string;
    name: string;
  };
}

// Interface untuk data WorkOrder yang sudah diformat di frontend (dengan Date objects dan Enums)
export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  workOrderMaster: string;
  date: Date; // Date object
  settledOdo: number | null;
  remark: string;
  schedule: Date | null; // Date object
  serviceLocation: string;
  notes: string | null;
  vehicleMake: string;
  progresStatus: WoProgresStatus; // Tipe Enum Prisma
  priorityType: WoPriorityType; // Tipe Enum Prisma
  vehicleId: string;
  customerId: string;
  carUserId: string;
  vendorId: string;
  mechanicId: string | null;
  driverId: string | null;
  driverContact: string | null;
  approvedById: string | null;
  requestedById: string | null;
  locationId: string | null;
  createdAt: Date; // Date object
  updatedAt: Date; // Date object

  // Relasi opsional
  vehicle?: {
    id: string;
    licensePlate: string;
    vehicleMake: string;
    model: string;
  };
  customer?: {
    id: string;
    companyName: string;
  };
  carUser?: {
    id: string;
    companyName: string;
  };
  vendor?: {
    id: string;
    companyName: string;
  };
  mechanic?: {
    id: string;
    name: string;
  };
  driver?: {
    id: string;
    name: string;
  };
  approvedBy?: {
    id: string;
    name: string;
  };
  requestedBy?: {
    id: string;
    name: string;
  };
  location?: {
    id: string;
    name: string;
  };
}

// CATATAN: WorkOrderFormValues TIDAK didefinisikan di sini.
// Ia akan didefinisikan di src/schemas/workOrder.ts menggunakan z.infer.
