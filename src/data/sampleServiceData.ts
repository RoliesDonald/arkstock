// src/data/sampleServiceData.ts
import { Service } from "@/types/service";
import { v4 as uuidv4 } from "uuid";

export const serviceData: Service[] = [
  {
    id: uuidv4(),
    serviceName: "Ganti Oli Mesin",
    description: "Penggantian oli mesin dan filter oli.",
    price: 50000, // Harga jasa saja, tidak termasuk oli/filter
    createdAt: new Date("2023-01-01T10:00:00Z"),
    updatedAt: new Date("2024-06-12T14:00:00Z"),
  },
  {
    id: uuidv4(),
    serviceName: "Servis Rem Depan",
    description: "Pengecekan dan penggantian kampas rem depan.",
    price: 75000,
    createdAt: new Date("2023-02-01T11:00:00Z"),
    updatedAt: new Date("2024-06-12T14:05:00Z"),
  },
  {
    id: uuidv4(),
    serviceName: "Tune Up Mesin",
    description:
      "Pembersihan karburator/throttle body, pengecekan busi, filter.",
    price: 150000,
    createdAt: new Date("2023-03-01T12:00:00Z"),
    updatedAt: new Date("2024-06-12T14:10:00Z"),
  },
  {
    id: uuidv4(),
    serviceName: "Spooring Balancing",
    description: "Penyetelan roda dan balancing ban.",
    price: 100000,
    createdAt: new Date("2023-04-01T13:00:00Z"),
    updatedAt: new Date("2024-06-12T14:15:00Z"),
  },
  {
    id: uuidv4(),
    serviceName: "Ganti Ban",
    description: "Jasa penggantian ban saja (tidak termasuk ban).",
    price: 25000,
    createdAt: new Date("2023-05-01T14:00:00Z"),
    updatedAt: new Date("2024-06-12T14:20:00Z"),
  },
  {
    id: uuidv4(),
    serviceName: "Perbaikan AC",
    description: "Pengecekan dan perbaikan sistem AC mobil.",
    price: 200000,
    createdAt: new Date("2023-06-01T15:00:00Z"),
    updatedAt: new Date("2024-06-12T14:25:00Z"),
  },
  {
    id: uuidv4(),
    serviceName: "Kuras Radiator",
    description: "Pengurasan dan pengisian ulang cairan radiator.",
    price: 80000,
    createdAt: new Date("2023-07-01T16:00:00Z"),
    updatedAt: new Date("2024-06-12T14:30:00Z"),
  },
  {
    id: uuidv4(),
    serviceName: "Servis Ringan",
    description: "Pengecekan umum, lampu, cairan, tekanan ban.",
    price: 30000,
    createdAt: new Date("2023-08-01T17:00:00Z"),
    updatedAt: new Date("2024-06-12T14:35:00Z"),
  },
  {
    id: uuidv4(),
    serviceName: "Pembersihan Injektor",
    description: "Membersihkan injektor bahan bakar.",
    price: 120000,
    createdAt: new Date("2023-09-01T18:00:00Z"),
    updatedAt: new Date("2024-06-12T14:40:00Z"),
  },
  {
    id: uuidv4(),
    serviceName: "Inspeksi Kendaraan Lengkap",
    description: "Inspeksi menyeluruh 100+ poin kendaraan.",
    price: 250000,
    createdAt: new Date("2023-10-01T19:00:00Z"),
    updatedAt: new Date("2024-06-12T14:45:00Z"),
  },
];
