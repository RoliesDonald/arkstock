// src/data/sampleInvoiceData.ts

import {
  Invoice,
  InvoiceStatus,
  InvoiceItem,
  InvoiceService,
} from "@/types/invoice";
import { v4 as uuidv4 } from "uuid";

// Asumsi ID dari data dummy WorkOrder, SparePart, Service
// PASTIKAN ID INI SESUAI DENGAN ID ASLI DI FILE DATA DUMMY ANDA
// (Contoh ID dari workOrderData, sampleSparePartData, sampleServiceData)
const woId1 = "0f249516-72d9-4b68-b7c1-0c5a8e0f2f5f";
const woId2 = "3b07c2a4-5e9c-4f7d-8a1b-0c5a8e0f2f5f";
const woId3 = "b7a6e1d0-2f8c-4a3e-9b0c-5a8e0f2f5f12";

const sparePartId1 = "6f8c7b9a-1d2e-4f5c-b6f8-c7b9a1d2e4f5"; // Kampas Rem Depan Avanza
const sparePartId2 = "c1b2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6"; // Filter Oli Mesin Honda Brio

const serviceId1 = "e9f0d1c2-b3a4-5d6e-7f8a-9b0c1d2e3f4a"; // Ganti Oli Mesin
const serviceId2 = "f1g2h3i4-j5k6-7l8m-9n0o-p1q2r3s4t5u6"; // Servis Rem Depan

export const invoiceData: Invoice[] = [
  {
    id: uuidv4(),
    invNum: "INV-BP-2024-001",
    date: new Date("2024-06-11T16:00:00Z"),
    requestOdo: 50000,
    actualOdo: 50000,
    remark: "Perbaikan bunyi kasar roda depan.",
    finished: new Date("2024-06-11T15:00:00Z"),
    totalAmount: 425000,
    woId: woId1,
    woMaster: "WO 2025/27454",
    vehicleMake: "Toyota",
    model: "Avanza",
    licensePlate: "L 1234 XY",
    vinNum: "MHKF123456V678901",
    engineNum: "K3-VE-901234567",
    customer: "PT. Rental Mobil Sejahtera",
    carUser: "PT. Rental Mobil Sejahtera",
    mechanic: "Ahmad Wijaya",
    approvedBy: "Budi Santoso",
    invoiceItems: [
      {
        id: uuidv4(),
        invoiceId: "", // Akan diisi saat disimpan di DB
        sparePartId: sparePartId1,
        itemName: "Kampas Rem Depan Avanza", // Ditambahkan
        partNumber: "BRK-PAD-FRT-AVZ001", // Ditambahkan
        quantity: 1,
        unit: "Set", // Ditambahkan
        unitPrice: 350000,
        totalPrice: 350000,
        createdAt: new Date("2024-06-11T16:00:00Z"),
        updatedAt: new Date("2024-06-11T16:00:00Z"),
      },
    ],
    invoiceServices: [
      {
        id: uuidv4(),
        invoiceId: "", // Akan diisi saat disimpan di DB
        serviceId: serviceId1,
        serviceName: "Ganti Oli Mesin", // Ditambahkan
        description: "Penggantian oli mesin dan filter oli.", // Ditambahkan
        quantity: 1,
        price: 75000,
        totalPrice: 75000,
        createdAt: new Date("2024-06-11T16:00:00Z"),
        updatedAt: new Date("2024-06-11T16:00:00Z"),
      },
    ],
    status: InvoiceStatus.PAID,
    createdAt: new Date("2024-06-11T16:00:00Z"),
    updatedAt: new Date("2024-06-11T16:00:00Z"),
  },
  {
    id: uuidv4(),
    invNum: "INV-BP-2024-002",
    date: new Date("2024-06-10T15:00:00Z"),
    requestOdo: 15000,
    actualOdo: 15000,
    remark: "Servis berkala 15.000 KM.",
    finished: new Date("2024-06-10T14:00:00Z"),
    totalAmount: 330000,
    woId: woId2,
    woMaster: "WO 2025/27455",
    vehicleMake: "Honda",
    model: "Mobilio",
    licensePlate: "B 5678 CD",
    vinNum: "MHKF987654H321098",
    engineNum: "L15Z1-123456789",
    customer: "CV. Usaha Mandiri",
    carUser: "Bapak Budi",
    mechanic: "Ahmad Wijaya",
    approvedBy: "Budi Santoso",
    invoiceItems: [
      {
        id: uuidv4(),
        invoiceId: "",
        sparePartId: sparePartId2,
        itemName: "Filter Oli Mesin Honda Brio", // Ditambahkan
        partNumber: "OIL-FIL-BRIO001", // Ditambahkan
        quantity: 1,
        unit: "Pcs", // Ditambahkan
        unitPrice: 280000,
        totalPrice: 280000,
        createdAt: new Date("2024-06-10T15:00:00Z"),
        updatedAt: new Date("2024-06-10T15:00:00Z"),
      },
    ],
    invoiceServices: [
      {
        id: uuidv4(),
        invoiceId: "",
        serviceId: serviceId2,
        serviceName: "Servis Rem Depan", // Ditambahkan
        description: "Pengecekan, pembersihan, dan penyetelan rem depan.", // Ditambahkan
        quantity: 1,
        price: 50000,
        totalPrice: 50000,
        createdAt: new Date("2024-06-10T15:00:00Z"),
        updatedAt: new Date("2024-06-10T15:00:00Z"),
      },
    ],
    status: InvoiceStatus.SENT,
    createdAt: new Date("2024-06-10T15:00:00Z"),
    updatedAt: new Date("2024-06-10T15:00:00Z"),
  },
  {
    id: uuidv4(),
    invNum: "INV-BP-2024-003",
    date: new Date("2024-06-08T17:00:00Z"),
    requestOdo: 30000,
    actualOdo: 30000,
    remark: "Estimasi AC kurang dingin, menunggu persetujuan.",
    finished: new Date("2024-06-08T12:00:00Z"),
    totalAmount: 0,
    woId: woId3,
    woMaster: "WO 2025/27456",
    vehicleMake: "Suzuki",
    model: "Ertiga",
    licensePlate: "D 7777 EF",
    vinNum: "MHKF000111A222333",
    engineNum: "K15B-998877665",
    customer: "PT. Logistik Cepat",
    carUser: "Ibu Desi",
    mechanic: null,
    approvedBy: null,
    invoiceItems: [],
    invoiceServices: [],
    status: InvoiceStatus.DRAFT,
    createdAt: new Date("2024-06-08T17:00:00Z"),
    updatedAt: new Date("2024-06-08T17:00:00Z"),
  },
];
