// src/data/samplePurchaseOrderData.ts
import {
  PurchaseOrder,
  PurchaseOrderStatus,
  PurchaseOrderItem,
} from "@/types/purchaseOrder";
import { TransactionPartDetails, PartVariant } from "@/types/sparepart";
import { v4 as uuidv4 } from "uuid";

// Asumsi ID dari data dummy Company, User, SparePart
const supplierId2 = "CVA-002"; // CV. Jaya Abadi (Vendor)
const supplierId6 = "UDBP-006"; // UD. Baja Perkasa (Supplier)

const requestedById1 = "d8c7b6a5-e4d3-c2b1-a0e9-f8d7c6b5a4e3"; // Indra Pratama (Warehouse Manager)
const approvedById1 = "b2a1c0d9-e8f7-6a5b-4c3d-2e1f0a9b8c7d"; // Joko Wijoyo (Accounting Manager)

const sparePartId1 = "6f8c7b9a-1d2e-4f5c-b6f8-c7b9a1d2e4f5"; // Kampas Rem Depan Avanza
const sparePartId2 = "c1b2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6"; // Oli Mesin Full Sintetik 4L
const sparePartId3 = "ac1d2e3f-4b5c-6d7e-8f9a-0b1c2d3e4f5a"; // Filter Udara Toyota Yaris

const poPartItem1: TransactionPartDetails = {
  partId: sparePartId1,
  partNumber: "BRK-PAD-FRT-AVZ",
  partName: "Kampas Rem Depan Avanza",
  variant: PartVariant.OEM,
  unit: "Set",
  quantity: 10,
  unitPrice: 300000,
  totalPrice: 3000000,
};

const poPartItem2: TransactionPartDetails = {
  partId: sparePartId2,
  partNumber: "OIL-ENG-SYN-4L",
  partName: "Oli Mesin Full Sintetik 4L",
  variant: PartVariant.GBOX,
  unit: "Liter",
  quantity: 50,
  unitPrice: 250000,
  totalPrice: 12500000,
};

const poPartItem3: TransactionPartDetails = {
  partId: sparePartId3,
  partNumber: "AIR-FILT-YARIS",
  partName: "Filter Udara Toyota Yaris",
  variant: PartVariant.AFTERMARKET,
  unit: "Pcs",
  quantity: 20,
  unitPrice: 70000,
  totalPrice: 1400000,
};

export const purchaseOrderData: PurchaseOrder[] = [
  {
    id: uuidv4(),
    poNum: "PO-JAYA-2024-001",
    poDate: new Date("2024-06-05T10:00:00Z"),
    supplierId: supplierId2, // CV. Jaya Abadi
    deliveryAddress: "Gudang Utama Bengkel Prima",
    subtotal: poPartItem1.totalPrice,
    tax: poPartItem1.totalPrice * 0.11, // 11% PPN
    totalAmount: poPartItem1.totalPrice * 1.11, // 3000000 * 1.11 = 3330000
    deliveryDate: new Date("2024-06-12T00:00:00Z"),
    status: PurchaseOrderStatus.RECEIVED,
    requestedById: requestedById1,
    approvedById: approvedById1,
    remark: "Pembelian kampas rem reguler.",
    createdAt: new Date("2024-06-05T10:00:00Z"),
    updatedAt: new Date("2024-06-12T10:00:00Z"),
    orderItems: [
      {
        id: uuidv4(),
        poId: "",
        sparePartId: poPartItem1.partId,
        quantity: poPartItem1.quantity,
        unitPrice: poPartItem1.unitPrice,
        totalPrice: poPartItem1.totalPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: uuidv4(),
    poNum: "PO-JAYA-2024-002",
    poDate: new Date("2024-06-10T14:00:00Z"),
    supplierId: supplierId2, // CV. Jaya Abadi
    deliveryAddress: "Gudang Utama Bengkel Prima",
    subtotal: poPartItem2.totalPrice + poPartItem3.totalPrice,
    tax: (poPartItem2.totalPrice + poPartItem3.totalPrice) * 0.11,
    totalAmount: (poPartItem2.totalPrice + poPartItem3.totalPrice) * 1.11, // (12.5jt + 1.4jt) * 1.11 = 15.429.000
    deliveryDate: new Date("2024-06-17T00:00:00Z"),
    status: PurchaseOrderStatus.ORDERED,
    requestedById: requestedById1,
    approvedById: approvedById1,
    remark: "Pembelian oli dan filter udara stok rutin.",
    createdAt: new Date("2024-06-10T14:00:00Z"),
    updatedAt: new Date("2024-06-10T14:00:00Z"),
    orderItems: [
      {
        id: uuidv4(),
        poId: "",
        sparePartId: poPartItem2.partId,
        quantity: poPartItem2.quantity,
        unitPrice: poPartItem2.unitPrice,
        totalPrice: poPartItem2.totalPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        poId: "",
        sparePartId: poPartItem3.partId,
        quantity: poPartItem3.quantity,
        unitPrice: poPartItem3.unitPrice,
        totalPrice: poPartItem3.totalPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: uuidv4(),
    poNum: "PO-BAJA-2024-001",
    poDate: new Date("2024-06-11T09:00:00Z"),
    supplierId: supplierId6, // UD. Baja Perkasa
    deliveryAddress: "Gudang Utama Bengkel Prima",
    subtotal: 5000000,
    tax: 5000000 * 0.11,
    totalAmount: 5000000 * 1.11, // 5.550.000
    deliveryDate: new Date("2024-06-25T00:00:00Z"),
    status: PurchaseOrderStatus.PENDING_APPROVAL,
    requestedById: requestedById1,
    approvedById: undefined,
    remark: "Pengadaan khusus shock absorber.",
    createdAt: new Date("2024-06-11T09:00:00Z"),
    updatedAt: new Date("2024-06-11T09:00:00Z"),
    orderItems: [], // Akan diisi setelah disetujui
  },
];
