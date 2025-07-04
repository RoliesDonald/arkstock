// src/data/samplePurchaseOrderData.ts
import { v4 as uuidv4 } from "uuid";
import { PurchaseOrder, PurchaseOrderStatus } from "@/types/purchaseOrder";

// --- Asumsi ID dari data dummy yang sudah ada ---
// Pastikan ID ini sesuai dengan data Anda di `sampleCompanyData.ts`, `sampleEmployeeData.ts`, dan `sampleSparePartData.ts`
const VENDOR_BENGKEL_PRIMA_ID = "comp-vendor-001"; // ID dari CompanyType.VENDOR
const VENDOR_SOLUSI_LOGISTIK_ID = "comp-sm-001"; // ID dari CompanyType.SUPPLIER (jika juga vendor)

const EMPLOYEE_WAREHOUSE_STAFF_ID = "emp-warehouse-001"; // ID karyawan dengan role WAREHOUSE_STAFF
const EMPLOYEE_WAREHOUSE_MANAGER_ID = "emp-manager-001"; // ID karyawan dengan role WAREHOUSE_MANAGER

const SP_FILTER_OLI_BRIO_ID = "31a2b1c2-d3e4-5f67-8901-234567890123"; // ID Filter Oli Mesin Honda Brio
const SP_BUSI_ERTIGA_ID = "41a2b1c2-d3e4-5f67-8901-234567890123"; // ID Busi Mobil Suzuki Ertiga
const SP_KAMPAS_KOPLING_CANTER_ID = "61a2b1c2-d3e4-5f67-8901-234567890123"; // ID Kampas Kopling Mitsubishi Canter
const SP_AKI_NS40Z_ID = "51a2b1c2-d3e4-5f67-8901-234567890123"; // ID Aki Kering NS40Z

// Data dummy Purchase Order
export const purchaseOrderData: PurchaseOrder[] = [
  {
    id: uuidv4(),
    poNumber: "PO/2024/07/00001",
    date: new Date("2024-07-01T10:00:00Z"),
    vendorId: VENDOR_BENGKEL_PRIMA_ID,
    requestedById: EMPLOYEE_WAREHOUSE_STAFF_ID,
    approvedById: null,
    rejectionReason: null,
    status: PurchaseOrderStatus.PENDING_APPROVAL,
    remark: "Pembelian rutin suku cadang fast-moving.",
    items: [
      {
        id: uuidv4(),
        sparePartId: SP_FILTER_OLI_BRIO_ID,
        itemName: "Filter Oli Mesin Honda Brio",
        partNumber: "OIL-FIL-BRIO001",
        quantity: 10,
        unit: "Pcs", // <-- DITAMBAHKAN
        unitPrice: 85000,
        totalPrice: 850000,
      },
      {
        id: uuidv4(),
        sparePartId: SP_BUSI_ERTIGA_ID,
        itemName: "Busi Mobil Suzuki Ertiga",
        partNumber: "SPK-PLG-ERT001",
        quantity: 20,
        unit: "Pcs", // <-- DITAMBAHKAN
        unitPrice: 25000,
        totalPrice: 500000,
      },
    ],
    totalAmount: 1350000,
    createdAt: new Date("2024-07-01T10:00:00Z"),
    updatedAt: new Date("2024-07-01T10:00:00Z"),
  },
  {
    id: uuidv4(),
    poNumber: "PO/2024/07/00002",
    date: new Date("2024-07-02T11:30:00Z"),
    vendorId: VENDOR_BENGKEL_PRIMA_ID,
    requestedById: EMPLOYEE_WAREHOUSE_STAFF_ID,
    approvedById: EMPLOYEE_WAREHOUSE_MANAGER_ID,
    rejectionReason: null,
    status: PurchaseOrderStatus.APPROVED,
    remark: "Pembelian mendesak untuk perbaikan truk.",
    items: [
      {
        id: uuidv4(),
        sparePartId: SP_KAMPAS_KOPLING_CANTER_ID,
        itemName: "Kampas Kopling Mitsubishi Canter 125PS",
        partNumber: "ME515796",
        quantity: 2,
        unit: "Set", // <-- DITAMBAHKAN
        unitPrice: 1200000,
        totalPrice: 2400000,
      },
    ],
    totalAmount: 2400000,
    createdAt: new Date("2024-07-02T11:30:00Z"),
    updatedAt: new Date("2024-07-02T14:00:00Z"),
  },
  {
    id: uuidv4(),
    poNumber: "PO/2024/07/00003",
    date: new Date("2024-07-03T09:00:00Z"),
    vendorId: VENDOR_SOLUSI_LOGISTIK_ID,
    requestedById: EMPLOYEE_WAREHOUSE_STAFF_ID,
    approvedById: EMPLOYEE_WAREHOUSE_MANAGER_ID,
    rejectionReason: "Stok masih cukup di gudang lain.",
    status: PurchaseOrderStatus.CANCELED,
    remark: "Pengadaan ban cadangan.",
    items: [
      {
        id: uuidv4(),
        sparePartId: SP_AKI_NS40Z_ID,
        itemName: "Aki Kering NS40Z",
        partNumber: "BAT-DRY-NS40Z",
        quantity: 5,
        unit: "Pcs", // <-- DITAMBAHKAN
        unitPrice: 700000,
        totalPrice: 3500000,
      },
    ],
    totalAmount: 3500000,
    createdAt: new Date("2024-07-03T09:00:00Z"),
    updatedAt: new Date("2024-07-03T10:30:00Z"),
  },
];
