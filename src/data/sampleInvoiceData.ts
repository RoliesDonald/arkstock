// src/data/sampleInvoiceData.ts
import {
  Invoice,
  InvoiceStatus,
  InvoiceItem,
  InvoiceService,
} from "@/types/invoice";
import { PartVariant, TransactionPartDetails } from "@/types/sparepart";
import { TransactionServiceDetails } from "@/types/service";
import { v4 as uuidv4 } from "uuid";

// Asumsi ID dari data dummy WorkOrder, Vehicle, User, SparePart, Service
const woId1 = "0f249516-72d9-4b68-b7c1-0c5a8e0f2f5f"; // WO/BP/2024/001
const woId2 = "3b07c2a4-5e9c-4f7d-8a1b-0c5a8e0f2f5f"; // WO/BP/2024/002
const woId3 = "b7a6e1d0-2f8c-4a3e-9b0c-5a8e0f2f5f12"; // WO/BP/2024/003

const vehicleId1 = "0f249516-72d9-4b68-b7c1-0c5a8e0f2f5f"; // Toyota Avanza
const vehicleId2 = "3b07c2a4-5e9c-4f7d-8a1b-0c5a8e0f2f5f"; // Honda Civic
const vehicleId3 = "b7a6e1d0-2f8c-4a3e-9b0c-5a8e0f2f5f12"; // Suzuki Ertiga

const mechanicId1 = "1e3c8b4a-5f9d-4c7b-a1e3-c8b4a5f9d4c7"; // Ahmad Wijaya
const serviceAdvisorId1 = "2a4d9e5b-6c0e-4d8c-b2a4-d9e5b6c0e4d8"; // Budi Santoso

const sparePartId1 = "6f8c7b9a-1d2e-4f5c-b6f8-c7b9a1d2e4f5"; // Kampas Rem Depan Avanza
const sparePartId2 = "c1b2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6"; // Oli Mesin

const serviceId1 = "e9f0d1c2-b3a4-5d6e-7f8a-9b0c1d2e3f4a"; // Ganti Oli Mesin
const serviceId2 = "f1g2h3i4-j5k6-7l8m-9n0o-p1q2r3s4t5u6"; // Servis Rem Depan

// Contoh data item dan service yang akan digunakan untuk membuat InvoiceItem/InvoiceService
const samplePartItem1: TransactionPartDetails = {
  partId: sparePartId1,
  partNumber: "BRK-PAD-FRT-AVZ",
  partName: "Kampas Rem Depan Avanza",
  variant: PartVariant.AFTERMARKET,
  unit: "Set",
  quantity: 1,
  unitPrice: 350000,
  totalPrice: 350000,
};

const samplePartItem2: TransactionPartDetails = {
  partId: sparePartId2,
  partNumber: "OIL-ENG-SYN-4L",
  partName: "Oli Mesin Full Sintetik 4L",
  variant: PartVariant.OEM,
  unit: "Liter",
  quantity: 1,
  unitPrice: 280000,
  totalPrice: 280000,
};

const sampleServiceItem1: TransactionServiceDetails = {
  serviceId: serviceId1,
  serviceName: "Ganti Oli Mesin",
  description: "Penggantian oli mesin.",
  price: 50000,
  quantity: 1,
  totalPrice: 50000,
};

const sampleServiceItem2: TransactionServiceDetails = {
  serviceId: serviceId2,
  serviceName: "Servis Rem Depan",
  description: "Pengecekan dan penggantian kampas.",
  price: 75000,
  quantity: 1,
  totalPrice: 75000,
};

export const invoiceData: Invoice[] = [
  {
    id: uuidv4(),
    invNum: "INV-BP-2024-001",
    date: new Date("2024-06-11T16:00:00Z"),
    requestOdo: 50000,
    actualOdo: 50000,
    remark: "Perbaikan bunyi kasar roda depan.",
    finishedDate: new Date("2024-06-11T15:00:00Z"),
    totalAmount: samplePartItem1.totalPrice + sampleServiceItem2.totalPrice, // 350000 + 75000 = 425000
    woId: woId1,
    vehicleId: vehicleId1,
    mechanicId: mechanicId1,
    approvedById: serviceAdvisorId1,
    status: InvoiceStatus.PAID,
    createdAt: new Date("2024-06-11T16:00:00Z"),
    updatedAt: new Date("2024-06-11T16:00:00Z"),
    // Ini adalah representasi di frontend yang mungkin di-inflate dari invoiceItems/invoiceServices
    invoiceItems: [
      {
        id: uuidv4(),
        invoiceId: "",
        sparePartId: samplePartItem1.partId,
        quantity: samplePartItem1.quantity,
        unitPrice: samplePartItem1.unitPrice,
        totalPrice: samplePartItem1.totalPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    invoiceServices: [
      {
        id: uuidv4(),
        invoiceId: "",
        serviceId: sampleServiceItem2.serviceId,
        quantity: sampleServiceItem2.quantity,
        totalPrice: sampleServiceItem2.totalPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: uuidv4(),
    invNum: "INV-BP-2024-002",
    invoiceDate: new Date("2024-06-10T15:00:00Z"),
    requestOdo: 15000,
    actualOdo: 15000,
    remark: "Servis berkala 15.000 KM.",
    finishedDate: new Date("2024-06-10T14:00:00Z"),
    totalAmount: samplePartItem2.totalPrice + sampleServiceItem1.totalPrice, // 280000 + 50000 = 330000
    woId: woId2,
    vehicleId: vehicleId2,
    mechanicId: mechanicId1,
    approvedById: serviceAdvisorId1,
    status: InvoiceStatus.SENT,
    createdAt: new Date("2024-06-10T15:00:00Z"),
    updatedAt: new Date("2024-06-10T15:00:00Z"),
    invoiceItems: [
      {
        id: uuidv4(),
        invoiceId: "",
        sparePartId: samplePartItem2.partId,
        quantity: samplePartItem2.quantity,
        unitPrice: samplePartItem2.unitPrice,
        totalPrice: samplePartItem2.totalPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    invoiceServices: [
      {
        id: uuidv4(),
        invoiceId: "",
        serviceId: sampleServiceItem1.serviceId,
        quantity: sampleServiceItem1.quantity,
        totalPrice: sampleServiceItem1.totalPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: uuidv4(),
    invNum: "INV-BP-2024-003",
    invoiceDate: new Date("2024-06-08T17:00:00Z"),
    requestOdo: 30000,
    actualOdo: 30000,
    remark: "Estimasi AC kurang dingin, menunggu persetujuan.",
    finishedDate: new Date("2024-06-08T12:00:00Z"),
    totalAmount: 0, // Belum ada item/service karena menunggu persetujuan
    woId: woId3,
    vehicleId: vehicleId3,
    mechanicId: null,
    approvedById: null,
    status: InvoiceStatus.DRAFT,
    createdAt: new Date("2024-06-08T17:00:00Z"),
    updatedAt: new Date("2024-06-08T17:00:00Z"),
    invoiceItems: [],
    invoiceServices: [],
  },
];
