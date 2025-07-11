import { Estimation, EstimationStatus } from "@/types/estimation";
import { PartVariant, TransactionPartDetails } from "@/types/sparepart";
import { TransactionServiceDetails } from "@/types/services";
import { v4 as uuidv4 } from "uuid";

// Asumsi ID dari data dummy WorkOrder, Vehicle, User, SparePart, Service
const woId1 = "0f249516-72d9-4b68-b7c1-0c5a8e0f2f5f"; // WO/BP/2024/001
const woId3 = "b7a6e1d0-2f8c-4a3e-9b0c-5a8e0f2f5f12"; // WO/BP/2024/003 (AC kurang dingin)

const vehicleId1 = "0f249516-72d9-4b68-b7c1-0c5a8e0f2f5f"; // Toyota Avanza
const vehicleId3 = "b7a6e1d0-2f8c-4a3e-9b0c-5a8e0f2f5f12"; // Suzuki Ertiga

const mechanicId1 = "1e3c8b4a-5f9d-4c7b-a1e3-c8b4a5f9d4c7"; // Ahmad Wijaya
const serviceAdvisorId1 = "2a4d9e5b-6c0e-4d8c-b2a4-d9e5b6c0e4d8"; // Budi Santoso

const sparePartId1 = "6f8c7b9a-1d2e-4f5c-b6f8-c7b9a1d2e4f5"; // Kampas Rem Depan Avanza
const sparePartId10 = "ac1d2e3f-4b5c-6d7e-8f9a-0b1c2d3e4f5a"; // Filter AC Honda HR-V

const serviceId2 = "f1g2h3i4-j5k6-7l8m-9n0o-p1q2r3s4t5u6"; // Servis Rem Depan
const serviceId6 = "b7c8d9e0-f1a2-3b4c-5d6e-7f8a9b0c1d2e"; // Perbaikan AC

const estPartItem1: TransactionPartDetails = {
  sparePartId: sparePartId1,
  partNumber: "BRK-PAD-FRT-AVZ",
  itemName: "Kampas Rem Depan Avanza",
  variant: PartVariant.OEM,
  unit: "Set",
  quantity: 1,
  unitPrice: 350000,
  totalPrice: 350000,
};

const estPartItem2: TransactionPartDetails = {
  sparePartId: sparePartId10,
  partNumber: "AC-FILTER-HRV",
  itemName: "Filter AC Honda HR-V",
  variant: PartVariant.AFTERMARKET,
  unit: "Pcs",
  quantity: 1,
  unitPrice: 90000,
  totalPrice: 90000,
};

const estServiceItem1: TransactionServiceDetails = {
  serviceId: serviceId2,
  serviceName: "Servis Rem Depan",
  description: "Pengecekan dan penggantian kampas rem depan.",
  price: 75000,
  quantity: 1,
  totalPrice: 75000,
};

const estServiceItem2: TransactionServiceDetails = {
  serviceId: serviceId6,
  serviceName: "Perbaikan AC",
  description: "Pengecekan dan perbaikan sistem AC mobil.",
  price: 200000,
  quantity: 1,
  totalPrice: 200000,
};

export const estimationData: Estimation[] = [
  {
    id: uuidv4(),
    estNum: "EST-BP-2024-001",
    estimationDate: new Date("2024-06-10T10:00:00Z"),
    requestOdo: 50000,
    actualOdo: 50000,
    remark: "Estimasi perbaikan bunyi kasar roda depan.",
    finishedDate: undefined,
    totalEstimatedAmount: estPartItem1.totalPrice + estServiceItem1.totalPrice, // 350k + 75k = 425k
    woId: woId1,
    vehicleId: vehicleId1,
    mechanicId: mechanicId1,
    approvedById: serviceAdvisorId1,
    createdAt: new Date("2024-06-10T10:00:00Z"),
    updatedAt: new Date("2024-06-10T10:00:00Z"),
    estimationItems: [
      {
        id: uuidv4(),
        estimationId: "",
        sparePartId: estPartItem1.sparePartId || "",
        quantity: estPartItem1.quantity,
        unitPrice: estPartItem1.unitPrice,
        totalPrice: estPartItem1.totalPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    estimationServices: [
      {
        id: uuidv4(),
        estimationId: "",
        serviceId: estServiceItem1.serviceId,
        quantity: estServiceItem1.quantity,
        totalPrice: estServiceItem1.totalPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
        unitPrice: 0,
      },
    ],
    estStatus: EstimationStatus.DRAFT,
  },
  {
    id: uuidv4(),
    estNum: "EST-BP-2024-002",
    estimationDate: new Date("2024-06-08T11:00:00Z"),
    requestOdo: 30000,
    actualOdo: 30000,
    remark: "Estimasi perbaikan AC kurang dingin.",
    finishedDate: undefined,
    totalEstimatedAmount: estPartItem2.totalPrice + estServiceItem2.totalPrice, // 90k + 200k = 290k
    woId: woId3,
    vehicleId: vehicleId3,
    mechanicId: undefined,
    approvedById: undefined,
    createdAt: new Date("2024-06-08T11:00:00Z"),
    updatedAt: new Date("2024-06-08T11:00:00Z"),
    estimationItems: [
      {
        id: uuidv4(),
        estimationId: "",
        sparePartId: estPartItem2.sparePartId || "",
        quantity: estPartItem2.quantity,
        unitPrice: estPartItem2.unitPrice,
        totalPrice: estPartItem2.totalPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    estimationServices: [
      {
        id: uuidv4(),
        estimationId: "",
        serviceId: estServiceItem2.serviceId,
        quantity: estServiceItem2.quantity,
        totalPrice: estServiceItem2.totalPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
        unitPrice: 0,
      },
    ],
    estStatus: EstimationStatus.DRAFT,
  },
  {
    id: uuidv4(),
    estNum: "EST-BP-2024-003",
    estimationDate: new Date("2024-06-05T09:00:00Z"),
    requestOdo: 75000,
    actualOdo: 75000,
    remark: "Estimasi overhaul mesin.",
    finishedDate: undefined,
    totalEstimatedAmount: 1500000, // Contoh
    woId: "dummy-wo-id-5", // WO/BP/2024/005
    vehicleId: "dummy-vehicle-id-5",
    mechanicId: undefined,
    approvedById: undefined,
    createdAt: new Date("2024-06-05T09:00:00Z"),
    updatedAt: new Date("2024-06-05T09:00:00Z"),
    estimationItems: [],
    estimationServices: [],
    estStatus: EstimationStatus.DRAFT,
  },
];
