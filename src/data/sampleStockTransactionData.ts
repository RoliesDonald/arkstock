import { StockTransaction, TransactionType } from "@/types/stockTransaction";
import { v4 as uuidv4 } from "uuid";

// Asumsi ID spare part dari sampleSparePartData.ts
// Anda perlu memastikan ID ini sesuai dengan data spare part Anda yang sebenarnya
const SP_KAMPAS_REM_AVANZA_ID = "21a2b1c2-d3e4-5f67-8901-234567890123"; // Ganti dengan ID asli dari sampleSparePartData.ts
const SP_FILTER_OLI_BRIO_ID = "31a2b1c2-d3e4-5f67-8901-234567890123"; // Ganti dengan ID asli dari sampleSparePartData.ts
const SP_BUSI_ERTIGA_ID = "41a2b1c2-d3e4-5f67-8901-234567890123"; // Ganti dengan ID asli dari sampleSparePartData.ts
const SP_AKI_NS40Z_ID = "51a2b1c2-d3e4-5f67-8901-234567890123"; // Ganti dengan ID asli dari sampleSparePartData.ts
const SP_KAMPAS_KOPLING_CANTER_ID = "61a2b1c2-d3e4-5f67-8901-234567890123"; // Ganti dengan ID asli dari sampleSparePartData.ts

// Asumsi ID gudang dari sampleWarehouseData.ts
const WH_MESS_ID = "wh-mess-001";
const WH_BM14_ID = "wh-bm14-002";
const WH_BM15_ID = "wh-bm15-003";
const WH_BM16_ID = "wh-bm16-004";
const WH_ALYA_ID = "wh-alya-005";
const WH_SECA_ID = "wh-seca-006";

export const stockTransactionData: StockTransaction[] = [
  // Transaksi IN (Masuk ke Gudang Mess)
  {
    id: uuidv4(),
    date: new Date("2024-01-05T10:00:00Z"),
    sparePartId: SP_KAMPAS_REM_AVANZA_ID,
    quantity: 20,
    transactionType: TransactionType.IN,
    sourceWarehouseId: WH_MESS_ID,
    targetWarehouseId: null,
    remark: "Pembelian dari Supplier A",
    createdAt: new Date("2024-01-05T10:00:00Z"),
    updatedAt: new Date("2024-01-05T10:00:00Z"),
  },
  {
    id: uuidv4(),
    date: new Date("2024-01-05T10:05:00Z"),
    sparePartId: SP_FILTER_OLI_BRIO_ID,
    quantity: 30,
    transactionType: TransactionType.IN,
    sourceWarehouseId: WH_MESS_ID,
    targetWarehouseId: null,
    remark: "Pembelian dari Supplier B",
    createdAt: new Date("2024-01-05T10:05:00Z"),
    updatedAt: new Date("2024-01-05T10:05:00Z"),
  },
  {
    id: uuidv4(),
    date: new Date("2024-01-06T11:00:00Z"),
    sparePartId: SP_BUSI_ERTIGA_ID,
    quantity: 50,
    transactionType: TransactionType.IN,
    sourceWarehouseId: WH_MESS_ID,
    targetWarehouseId: null,
    remark: "Pembelian awal",
    createdAt: new Date("2024-01-06T11:00:00Z"),
    updatedAt: new Date("2024-01-06T11:00:00Z"),
  },
  {
    id: uuidv4(),
    date: new Date("2024-01-07T12:00:00Z"),
    sparePartId: SP_AKI_NS40Z_ID,
    quantity: 10,
    transactionType: TransactionType.IN,
    sourceWarehouseId: WH_MESS_ID,
    targetWarehouseId: null,
    remark: "Pembelian dari Supplier C",
    createdAt: new Date("2024-01-07T12:00:00Z"),
    updatedAt: new Date("2024-01-07T12:00:00Z"),
  },
  {
    id: uuidv4(),
    date: new Date("2024-01-08T13:00:00Z"),
    sparePartId: SP_KAMPAS_KOPLING_CANTER_ID,
    quantity: 15,
    transactionType: TransactionType.IN,
    sourceWarehouseId: WH_MESS_ID,
    targetWarehouseId: null,
    remark: "Pembelian dari Supplier D",
    createdAt: new Date("2024-01-08T13:00:00Z"),
    updatedAt: new Date("2024-01-08T13:00:00Z"),
  },

  // Transaksi OUT (Keluar dari Gudang Mess)
  {
    id: uuidv4(),
    date: new Date("2024-01-10T14:00:00Z"),
    sparePartId: SP_KAMPAS_REM_AVANZA_ID,
    quantity: 5,
    transactionType: TransactionType.OUT,
    sourceWarehouseId: WH_MESS_ID,
    targetWarehouseId: null,
    remark: "Digunakan untuk WO-001",
    createdAt: new Date("2024-01-10T14:00:00Z"),
    updatedAt: new Date("2024-01-10T14:00:00Z"),
  },
  {
    id: uuidv4(),
    date: new Date("2024-01-11T15:00:00Z"),
    sparePartId: SP_FILTER_OLI_BRIO_ID,
    quantity: 10,
    transactionType: TransactionType.OUT,
    sourceWarehouseId: WH_MESS_ID,
    targetWarehouseId: null,
    remark: "Digunakan untuk WO-002",
    createdAt: new Date("2024-01-11T15:00:00Z"),
    updatedAt: new Date("2024-01-11T15:00:00Z"),
  },
  {
    id: uuidv4(),
    date: new Date("2024-01-12T16:00:00Z"),
    sparePartId: SP_BUSI_ERTIGA_ID,
    quantity: 10,
    transactionType: TransactionType.OUT,
    sourceWarehouseId: WH_MESS_ID,
    targetWarehouseId: null,
    remark: "Digunakan untuk WO-003",
    createdAt: new Date("2024-01-12T16:00:00Z"),
    updatedAt: new Date("2024-01-12T16:00:00Z"),
  },

  // Transaksi TRANSFER_OUT dari Gudang Mess ke Gudang BM-14
  {
    id: uuidv4(),
    date: new Date("2024-01-15T10:00:00Z"),
    sparePartId: SP_KAMPAS_REM_AVANZA_ID,
    quantity: 5,
    transactionType: TransactionType.TRANSFER_OUT,
    sourceWarehouseId: WH_MESS_ID,
    targetWarehouseId: WH_BM14_ID,
    remark: "Transfer ke Cabang Surabaya",
    createdAt: new Date("2024-01-15T10:00:00Z"),
    updatedAt: new Date("2024-01-15T10:00:00Z"),
  },
  // Transaksi TRANSFER_IN di Gudang BM-14
  {
    id: uuidv4(),
    date: new Date("2024-01-15T10:00:00Z"), // Tanggal sama dengan TRANSFER_OUT
    sparePartId: SP_KAMPAS_REM_AVANZA_ID,
    quantity: 5,
    transactionType: TransactionType.TRANSFER_IN,
    sourceWarehouseId: WH_BM14_ID, // Gudang penerima
    targetWarehouseId: WH_MESS_ID, // Gudang pengirim (untuk referensi, bisa null juga)
    remark: "Penerimaan dari Gudang Mess",
    createdAt: new Date("2024-01-15T10:00:00Z"),
    updatedAt: new Date("2024-01-15T10:00:00Z"),
  },

  // Transaksi TRANSFER_OUT dari Gudang Mess ke Gudang SECA
  {
    id: uuidv4(),
    date: new Date("2024-01-16T11:00:00Z"),
    sparePartId: SP_FILTER_OLI_BRIO_ID,
    quantity: 5,
    transactionType: TransactionType.TRANSFER_OUT,
    sourceWarehouseId: WH_MESS_ID,
    targetWarehouseId: WH_SECA_ID,
    remark: "Transfer ke Mekanik SECA-001",
    createdAt: new Date("2024-01-16T11:00:00Z"),
    updatedAt: new Date("2024-01-16T11:00:00Z"),
  },
  // Transaksi TRANSFER_IN di Gudang SECA
  {
    id: uuidv4(),
    date: new Date("2024-01-16T11:00:00Z"),
    sparePartId: SP_FILTER_OLI_BRIO_ID,
    quantity: 5,
    transactionType: TransactionType.TRANSFER_IN,
    sourceWarehouseId: WH_SECA_ID,
    targetWarehouseId: WH_MESS_ID,
    remark: "Penerimaan dari Gudang Mess",
    createdAt: new Date("2024-01-16T11:00:00Z"),
    updatedAt: new Date("2024-01-16T11:00:00Z"),
  },

  // Contoh transaksi di gudang BM-14 (OUT)
  {
    id: uuidv4(),
    date: new Date("2024-01-18T09:00:00Z"),
    sparePartId: SP_KAMPAS_REM_AVANZA_ID,
    quantity: 2,
    transactionType: TransactionType.OUT,
    sourceWarehouseId: WH_BM14_ID,
    targetWarehouseId: null,
    remark: "Digunakan untuk WO-BM14-001",
    createdAt: new Date("2024-01-18T09:00:00Z"),
    updatedAt: new Date("2024-01-18T09:00:00Z"),
  },
];
