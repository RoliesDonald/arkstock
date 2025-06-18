// src/data/sampleSparePartData.ts
import { v4 as uuidv4 } from "uuid";
import { SparePart, PartVariant } from "@/types/sparepart"; // Import tipe yang diperlukan
import { generateSku } from "@/lib/skuFormatter"; // Import fungsi generateSku

export const sparePartData: SparePart[] = [
  {
    id: uuidv4(),
    // PERBAIKAN: Menggunakan 'name' dan memastikan nilainya string
    name: "Kampas Rem Depan Avanza",
    partNumber: "BRK-PAD-FRT-AVZ001",
    description: "Kampas rem depan untuk Toyota Avanza tahun 2012-2020.",
    unit: "Set",
    // PERBAIKAN: Menggunakan 'stock' dan 'minStock' yang konsisten dengan SparePart interface
    stock: 15,
    minStock: 5,
    price: 350000,
    variant: PartVariant.AFTERMARKET,
    // PERBAIKAN: Menambahkan brand dan manufacturer
    brand: "Akebono",
    manufacturer: "Akebono Brake Industry Co., Ltd.",
    compatibility: [
      {
        vehicleMake: "Toyota",
        model: "Avanza",
        trimLevel: "G",
        modelYear: 2012,
      },
      {
        vehicleMake: "Daihatsu",
        model: "Xenia",
        trimLevel: "G-10",
        modelYear: 2012,
      },
    ],
    createdAt: new Date("2024-01-01T10:00:00Z"),
    updatedAt: new Date("2024-06-15T11:00:00Z"), // PERBAIKAN: updateAt menjadi updatedAt
    // PERBAIKAN: Menghasilkan SKU menggunakan generateSku
    sku: generateSku("BRK-PAD-FRT-AVZ001", PartVariant.AFTERMARKET, "Akebono"),
    // PERBAIKAN: Menghapus properti 'make' yang tidak ada di interface SparePart
  },
  {
    id: uuidv4(),
    name: "Filter Oli Mesin Honda Brio",
    partNumber: "OIL-FIL-BRIO001",
    description: "Filter oli mesin original untuk Honda Brio.",
    unit: "Pcs",
    stock: 25,
    minStock: 10,
    price: 85000,
    variant: PartVariant.NEW,
    brand: "Denso",
    manufacturer: "Denso Corporation",
    compatibility: [
      { vehicleMake: "Honda", model: "Brio" },
      { vehicleMake: "Honda", model: "Mobilio" },
      { vehicleMake: "Honda", model: "Jazz" },
    ],
    createdAt: new Date("2024-02-10T09:30:00Z"),
    updatedAt: new Date("2024-06-16T10:15:00Z"),
    sku: generateSku("OIL-FIL-BRIO001", PartVariant.NEW, "Denso"),
  },
  {
    id: uuidv4(),
    name: "Busi Mobil Suzuki Ertiga",
    partNumber: "SPK-PLG-ERT001",
    description: "Busi standar untuk Suzuki Ertiga.",
    unit: "Pcs",
    stock: 40,
    minStock: 15,
    price: 25000,
    variant: PartVariant.AFTERMARKET,
    brand: "NGK",
    manufacturer: "NGK Spark Plug Co., Ltd.",
    compatibility: [
      { vehicleMake: "Suzuki", model: "Ertiga" },
      { vehicleMake: "Suzuki", model: "Swift" },
    ],
    createdAt: new Date("2024-03-05T14:00:00Z"),
    updatedAt: new Date("2024-06-17T09:00:00Z"),
    sku: generateSku("SPK-PLG-ERT001", PartVariant.AFTERMARKET, "NGK"),
  },
  {
    id: uuidv4(),
    name: "Aki Kering NS40Z",
    partNumber: "BAT-DRY-NS40Z",
    description: "Aki kering untuk berbagai jenis mobil kecil.",
    unit: "Pcs",
    stock: 8,
    minStock: 3,
    price: 700000,
    variant: PartVariant.AFTERMARKET,
    brand: "GS Astra",
    manufacturer: "PT. Astra Otoparts Tbk.",
    compatibility: [
      { vehicleMake: "Honda", model: "Brio" },
      { vehicleMake: "Honda", model: "Jazz" },
      { vehicleMake: "Toyota", model: "Agya" },
      { vehicleMake: "Daihatsu", model: "Ayla" },
    ],
    createdAt: new Date("2024-04-20T16:00:00Z"),
    updatedAt: new Date("2024-06-17T14:30:00Z"),
    sku: generateSku("BAT-DRY-NS40Z", PartVariant.AFTERMARKET, "GS Astra"),
  },
  {
    // Contoh untuk Mitsubishi Canter 125ps
    id: uuidv4(),
    name: "Kampas Kopling Mitsubishi Canter 125PS",
    partNumber: "ME515796",
    description: "Kampas kopling original untuk Mitsubishi Canter 125PS.",
    unit: "Pcs",
    stock: 10,
    minStock: 2,
    price: 1200000,
    variant: PartVariant.NEW,
    brand: "Mitsubishi Fuso",
    manufacturer: "Mitsubishi Fuso Truck and Bus Corporation",
    compatibility: [
      { vehicleMake: "Mitsubishi Fuso", model: "Canter 125PS" },
      { vehicleMake: "Mitsubishi Fuso", model: "Canter FE74" },
    ],
    createdAt: new Date("2024-06-18T08:00:00Z"),
    updatedAt: new Date("2024-06-18T08:00:00Z"),
    sku: generateSku("ME515796", PartVariant.NEW, "Mitsubishi Fuso"),
  },
];
