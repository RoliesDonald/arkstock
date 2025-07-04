import { WarehouseStock } from "@/types/warehouseStok";
import { v4 as uuidv4 } from "uuid";

// Asumsi ID spare part dari sampleSparePartData.ts
// Anda perlu memastikan ID ini sesuai dengan data spare part Anda yang sebenarnya
const SP_KAMPAS_REM_AVANZA_ID = "21a2b1c2-d3e4-5f67-8901-234567890123";
const SP_FILTER_OLI_BRIO_ID = "31a2b1c2-d3e4-5f67-8901-234567890123";
const SP_BUSI_ERTIGA_ID = "41a2b1c2-d3e4-5f67-8901-234567890123";
const SP_AKI_NS40Z_ID = "51a2b1c2-d3e4-5f67-8901-234567890123";
const SP_KAMPAS_KOPLING_CANTER_ID = "61a2b1c2-d3e4-5f67-8901-234567890123";

// Asumsi ID gudang dari sampleWarehouseData.ts
const WH_MESS_ID = "wh-mess-001";
const WH_BM14_ID = "wh-bm14-002";
const WH_BM15_ID = "wh-bm15-003";
const WH_BM16_ID = "wh-bm16-004";
const WH_ALYA_ID = "wh-alya-005";
const WH_SECA_ID = "wh-seca-006";

export const warehouseStockData: WarehouseStock[] = [
  // Stok di Gudang Mess
  {
    id: uuidv4(), // ID unik untuk entri stok ini
    sparePartId: SP_KAMPAS_REM_AVANZA_ID,
    warehouseId: WH_MESS_ID,
    currentStock: 10, // 20 (IN) - 5 (OUT) - 5 (TRANSFER_OUT) = 10
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-06-20T11:00:00Z"),
  },
  {
    id: uuidv4(),
    sparePartId: SP_FILTER_OLI_BRIO_ID,
    warehouseId: WH_MESS_ID,
    currentStock: 15, // 30 (IN) - 10 (OUT) - 5 (TRANSFER_OUT) = 15
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-06-20T11:00:00Z"),
  },
  {
    id: uuidv4(),
    sparePartId: SP_BUSI_ERTIGA_ID,
    warehouseId: WH_MESS_ID,
    currentStock: 40, // 50 (IN) - 10 (OUT) = 40
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-06-20T11:00:00Z"),
  },
  {
    id: uuidv4(),
    sparePartId: SP_AKI_NS40Z_ID,
    warehouseId: WH_MESS_ID,
    currentStock: 10, // 10 (IN) = 10
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-06-20T11:00:00Z"),
  },
  {
    id: uuidv4(),
    sparePartId: SP_KAMPAS_KOPLING_CANTER_ID,
    warehouseId: WH_MESS_ID,
    currentStock: 15, // 15 (IN) = 15
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-06-20T11:00:00Z"),
  },

  // Stok di Gudang BM-14
  {
    id: uuidv4(),
    sparePartId: SP_KAMPAS_REM_AVANZA_ID,
    warehouseId: WH_BM14_ID,
    currentStock: 3, // 5 (TRANSFER_IN) - 2 (OUT) = 3
    createdAt: new Date("2024-01-15T10:00:00Z"),
    updatedAt: new Date("2024-06-20T11:00:00Z"),
  },

  // Stok di Gudang SECA
  {
    id: uuidv4(),
    sparePartId: SP_FILTER_OLI_BRIO_ID,
    warehouseId: WH_SECA_ID,
    currentStock: 5, // 5 (TRANSFER_IN) = 5
    createdAt: new Date("2024-01-16T11:00:00Z"),
    updatedAt: new Date("2024-06-20T11:00:00Z"),
  },

  // Stok di gudang lain (BM-15, BM-16, Alya) yang mungkin kosong atau belum ada transaksi
  {
    id: uuidv4(),
    sparePartId: SP_BUSI_ERTIGA_ID,
    warehouseId: WH_BM15_ID,
    currentStock: 0,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: uuidv4(),
    sparePartId: SP_AKI_NS40Z_ID,
    warehouseId: WH_BM16_ID,
    currentStock: 0,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: uuidv4(),
    sparePartId: SP_KAMPAS_KOPLING_CANTER_ID,
    warehouseId: WH_ALYA_ID,
    currentStock: 0,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
];
