// src/types/vehicles.ts

// Import Enums dari Prisma Client
import {
  VehicleType,
  VehicleCategory,
  VehicleFuelType,
  VehicleTransmissionType,
  VehicleStatus,
} from "@prisma/client";

// Interface untuk data mentah yang diterima langsung dari API
export interface RawVehicleApiResponse {
  id: string;
  licensePlate: string;
  vehicleMake: string;
  model: string;
  trimLevel: string | null;
  vinNum: string | null;
  engineNum: string | null;
  chassisNum: string | null;
  yearMade: number;
  color: string;
  vehicleType: string; // Dari API, akan berupa string
  vehicleCategory: string; // Dari API, akan berupa string
  fuelType: string; // Dari API, akan berupa string
  transmissionType: string; // Dari API, akan berupa string
  lastOdometer: number;
  lastServiceDate: string; // Dari API, akan berupa string ISO
  status: string; // Dari API, akan berupa string
  notes: string | null;
  ownerId: string;
  carUserId: string | null;
  createdAt: string; // Dari API, akan berupa string ISO
  updatedAt: string; // Dari API, akan berupa string ISO

  // Relasi opsional jika disertakan dalam respons API
  owner?: {
    id: string;
    companyName: string;
  };
  carUser?: {
    id: string;
    companyName: string;
  };
}

// Interface untuk data Vehicle yang sudah diformat di frontend (dengan Date objects dan Enums)
export interface Vehicle {
  id: string;
  licensePlate: string;
  vehicleMake: string;
  model: string;
  trimLevel: string | null;
  vinNum: string | null;
  engineNum: string | null;
  chassisNum: string | null;
  yearMade: number;
  color: string;
  vehicleType: VehicleType; // Tipe Enum Prisma
  vehicleCategory: VehicleCategory; // Tipe Enum Prisma
  fuelType: VehicleFuelType; // Tipe Enum Prisma
  transmissionType: VehicleTransmissionType; // Tipe Enum Prisma
  lastOdometer: number;
  lastServiceDate: Date; // Date object
  status: VehicleStatus; // Tipe Enum Prisma
  notes: string | null;
  ownerId: string;
  carUserId: string | null;
  createdAt: Date; // Date object
  updatedAt: Date; // Date object

  // Relasi opsional
  owner?: {
    id: string;
    companyName: string;
  };
  carUser?: {
    id: string;
    companyName: string;
  };
}
