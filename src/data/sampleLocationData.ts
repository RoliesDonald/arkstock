// src/data/sampleLocationData.ts
import { Location } from "@/types/location";
import { v4 as uuidv4 } from "uuid";

export const locationData: Location[] = [
  {
    id: uuidv4(),
    name: "Bengkel Utama Daan Mogot",
    address: "Jl. Daan Mogot Raya No. 1, Jakarta Barat",
    createdAt: new Date("2023-01-01T08:00:00Z"),
    updatedAt: new Date("2024-06-12T15:00:00Z"),
  },
  {
    id: uuidv4(),
    name: "Bengkel Cabang Sudirman",
    address: "Jl. Jend. Sudirman No. 10, Jakarta Pusat",
    createdAt: new Date("2023-03-15T09:00:00Z"),
    updatedAt: new Date("2024-06-12T15:05:00Z"),
  },
  {
    id: uuidv4(),
    name: "Pusat Logistik Cikarang",
    address: "Kawasan Industri Delta Silicon, Cikarang",
    createdAt: new Date("2023-06-01T10:00:00Z"),
    updatedAt: new Date("2024-06-12T15:10:00Z"),
  },
  {
    id: uuidv4(),
    name: "Depo Kendaraan Bandung",
    address: "Jl. Soekarno Hatta No. 200, Bandung",
    createdAt: new Date("2023-09-10T11:00:00Z"),
    updatedAt: new Date("2024-06-12T15:15:00Z"),
  },
  {
    id: uuidv4(),
    name: "Workshop Mobile Service",
    address: undefined, // Lokasi tidak tetap
    createdAt: new Date("2024-01-20T12:00:00Z"),
    updatedAt: new Date("2024-06-12T15:20:00Z"),
  },
];
