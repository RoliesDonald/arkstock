import { Warehouse } from "@/types/warehouse";
import { v4 as uuidv4 } from "uuid";

export const warehouseData: Warehouse[] = [
  {
    id: "wh-mess-001",
    name: "Gudang Mess",
    location: "Kantor Pusat, Jakarta",
    isMainWarehouse: true,
    createdAt: new Date("2023-01-01T08:00:00Z"),
    updatedAt: new Date("2024-06-20T10:00:00Z"),
  },
  {
    id: "wh-bm14-002",
    name: "Gudang BM-14",
    location: "Cabang Surabaya",
    isMainWarehouse: false,
    createdAt: new Date("2023-02-10T09:00:00Z"),
    updatedAt: new Date("2024-06-20T10:05:00Z"),
  },
  {
    id: "wh-bm15-003",
    name: "Gudang BM-15",
    location: "Cabang Bandung",
    isMainWarehouse: false,
    createdAt: new Date("2023-03-15T10:00:00Z"),
    updatedAt: new Date("2024-06-20T10:10:00Z"),
  },
  {
    id: "wh-bm16-004",
    name: "Gudang BM-16",
    location: "Cabang Semarang",
    isMainWarehouse: false,
    createdAt: new Date("2023-04-20T11:00:00Z"),
    updatedAt: new Date("2024-06-20T10:15:00Z"),
  },
  {
    id: "wh-alya-005",
    name: "Gudang Alya",
    location: "Cabang Yogyakarta",
    isMainWarehouse: false,
    createdAt: new Date("2023-05-25T12:00:00Z"),
    updatedAt: new Date("2024-06-20T10:20:00Z"),
  },
  {
    id: "wh-seca-006",
    name: "Gudang SECA (Sub-Gudang Mess)",
    location: "Mobile Operasional (Sub-Gudang Mess)",
    isMainWarehouse: false, // Ini adalah sub-gudang
    createdAt: new Date("2023-06-01T13:00:00Z"),
    updatedAt: new Date("2024-06-20T10:25:00Z"),
  },
];
