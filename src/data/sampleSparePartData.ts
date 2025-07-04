// src/data/sampleSparePartData.ts
import { SparePart, PartVariant } from "@/types/sparepart";
import { v4 as uuidv4 } from "uuid";

export const sparePartData: SparePart[] = [
  {
    id: "21a2b1c2-d3e4-5f67-8901-234567890123",
    sku: "SKU-KRM-AVZ-001",
    name: "Kampas Rem Depan Avanza",
    partNumber: "BRK-PAD-FRT-AVZ",
    description: "Kampas rem depan untuk Toyota Avanza tahun 2012-2020.",
    unit: "Set",
    // stock: 50, // <-- HAPUS BARIS INI JIKA ADA
    minStock: 10,
    price: 300000,
    variant: PartVariant.OEM,
    brand: "Toyota",
    manufacturer: "PT Astra Daihatsu Motor",
    compatibility: [
      { vehicleMake: "Toyota", model: "Avanza", modelYear: 2012 },
      { vehicleMake: "Toyota", model: "Avanza", modelYear: 2020 },
      { vehicleMake: "Daihatsu", model: "Xenia", modelYear: 2012 },
      { vehicleMake: "Daihatsu", model: "Xenia", modelYear: 2020 },
    ],
    createdAt: new Date("2023-01-15T09:00:00Z"),
    updatedAt: new Date("2024-06-25T14:30:00Z"),
  },
  {
    id: "31a2b1c2-d3e4-5f67-8901-234567890123",
    sku: "SKU-FIL-OLI-BRIO-001",
    name: "Filter Oli Mesin Honda Brio",
    partNumber: "OIL-FIL-BRIO001",
    description: "Filter oli mesin untuk Honda Brio semua tahun.",
    unit: "Pcs",
    // stock: 100, // <-- HAPUS BARIS INI JIKA ADA
    minStock: 20,
    price: 85000,
    variant: PartVariant.AFTERMARKET,
    brand: "Sakura",
    manufacturer: "PT Sakura Filter Indonesia",
    compatibility: [
      { vehicleMake: "Honda", model: "Brio" },
      { vehicleMake: "Honda", model: "Mobilio" },
      { vehicleMake: "Honda", model: "Jazz" },
    ],
    createdAt: new Date("2023-02-20T10:00:00Z"),
    updatedAt: new Date("2024-06-20T11:00:00Z"),
  },
  {
    id: "41a2b1c2-d3e4-5f67-8901-234567890123",
    sku: "SKU-BUSI-ERT-001",
    name: "Busi Mobil Suzuki Ertiga",
    partNumber: "SPK-PLG-ERT001",
    description: "Busi standar untuk Suzuki Ertiga.",
    unit: "Pcs",
    // stock: 75, // <-- HAPUS BARIS INI JIKA ADA
    minStock: 15,
    price: 25000,
    variant: PartVariant.OEM,
    brand: "NGK",
    manufacturer: "PT NGK Busi Indonesia",
    compatibility: [
      { vehicleMake: "Suzuki", model: "Ertiga" },
      { vehicleMake: "Suzuki", model: "Swift" },
    ],
    createdAt: new Date("2023-03-10T11:00:00Z"),
    updatedAt: new Date("2024-05-10T09:00:00Z"),
  },
  {
    id: "51a2b1c2-d3e4-5f67-8901-234567890123",
    sku: "SKU-AKI-NS40Z-001",
    name: "Aki Kering NS40Z",
    partNumber: "BAT-DRY-NS40Z",
    description: "Aki kering bebas perawatan NS40Z.",
    unit: "Pcs",
    // stock: 20, // <-- HAPUS BARIS INI JIKA ADA
    minStock: 5,
    price: 700000,
    variant: PartVariant.AFTERMARKET,
    brand: "Yuasa",
    manufacturer: "PT Yuasa Battery Indonesia",
    compatibility: [], // Kompatibilitas umum, tidak spesifik model
    createdAt: new Date("2023-04-01T12:00:00Z"),
    updatedAt: new Date("2024-06-01T10:00:00Z"),
  },
  {
    id: "61a2b1c2-d3e4-5f67-8901-234567890123",
    sku: "SKU-KOP-CANTER-001",
    name: "Kampas Kopling Mitsubishi Canter 125PS",
    partNumber: "ME515796",
    description: "Kampas kopling untuk truk Mitsubishi Canter 125PS.",
    unit: "Set",
    // stock: 15, // <-- HAPUS BARIS INI JIKA ADA
    minStock: 3,
    price: 1200000,
    variant: PartVariant.OEM,
    brand: "Mitsubishi",
    manufacturer: "PT Krama Yudha Tiga Berlian Motors",
    compatibility: [
      { vehicleMake: "Mitsubishi", model: "Canter", trimLevel: "FE74" },
    ],
    createdAt: new Date("2023-05-05T13:00:00Z"),
    updatedAt: new Date("2024-06-15T08:00:00Z"),
  },
];
