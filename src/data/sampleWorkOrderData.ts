// src/data/sampleWorkOrderData.ts
import { WorkOrder, WoProgresStatus, WoPriorityType } from "@/types/workOrder";
import { v4 as uuidv4 } from "uuid";

// Company IDs (dari sampleCompanyData.ts)
const companyId1 = "6df3ee3b-8515-41e9-9188-752119154a49"; // PT. Maju Bersama (Customer) - Contoh UUID
const companyId3 = "12e7f86f-2b5d-4f0e-a9c1-54c3e2d1f0a9"; // PT. Transportasi Cepat (Car User) - Contoh UUID
const companyId4 = "0a9b8c7d-e6f5-4a3b-2c1d-0e9f8a7b6c5d"; // Bengkel Prima (Vendor/Internal) - Contoh UUID
const companyId7 = "f7e6d5c4-b3a2-1e0f-9d8c-7b6a5e4d3c2b"; // PT. Global Engineering (Customer) - Contoh UUID
const companyId9 = "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e"; // PT. Armada Wisata (Car User) - Contoh UUID
// Pastikan semua Company IDs yang digunakan di bawah ini didefinisikan di sini.

// Vehicle IDs (dari sampleVehicleData.ts)
const vehicleId1 = "0f249516-72d9-4b68-b7c1-0c5a8e0f2f5f"; // Toyota Avanza
const vehicleId2 = "3b07c2a4-5e9c-4f7d-8a1b-0c5a8e0f2f5f"; // Honda Civic
const vehicleId3 = "b7a6e1d0-2f8c-4a3e-9b0c-5a8e0f2f5f12"; // Suzuki Ertiga
const vehicleId4 = "a1b2c3d4-e5f6-4a3b-2c1d-0e9f8a7b6c5d"; // Mitsubishi Xpander (Contoh baru)
const vehicleId5 = "f9e8d7c6-b5a4-3e2d-1c0b-9a8f7e6d5c4b"; // Nissan Livina (Contoh baru)
const vehicleId6 = "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p"; // Daihatsu Terios (Contoh baru)
const vehicleId7 = "q1w2e3r4-t5y6-7u8i-9o0p-1a2s3d4f5g6h"; // Wuling Confero (Contoh baru)
const vehicleId8 = "z9x8c7v6-b5n4-3m2l-1k0j-9h8g7f6e5d4c"; // Hyundai Creta (Contoh baru)
const vehicleId9 = "a0b9c8d7-e6f5-4g3h-2i1j-0k9l8m7n6o5p"; // Mazda CX-5 (Contoh baru)
const vehicleId10 = "v1b2n3m4-l5k6-7j8h-9g0f-1e2d3c4b5a6s"; // Chery Tiggo 7 Pro (Contoh baru)

// User IDs (dari sampleUserData.ts)
const mechanicId1 = "1e3c8b4a-5f9d-4c7b-a1e3-c8b4a5f9d4c7"; // Ahmad Wijaya (MECHANIC)
const serviceAdvisorId1 = "2a4d9e5b-6c0e-4d8c-b2a4-d9e5b6c0e4d8"; // Budi Santoso (SERVICE_ADVISOR)
const driverId1 = "6f8c7b9a-1d2e-4f5c-b6f8-c7b9a1d2e4f5"; // Faisal Rahman (DRIVER)
const picId1 = "8d2e3c4b-9f0a-4c1d-b8d2-e3c4b9f0a4c1"; // Hadi Kusuma (Customer PIC)

// Location ID (dari sampleLocationData.ts)
const locationId1 = "a1b2c3d4-e5f6-7890-1234-567890abcdef"; // Bengkel Utama Daan Mogot

export const workOrderData: WorkOrder[] = [
  {
    id: "woid-001",
    woNumber: "WO/BP/2024/001",
    woMaster: "CUST-WO-2024-001",
    date: new Date("2024-06-10T09:00:00Z"),
    settledOdo: 50000,
    remark: "Bunyi kasar dari roda depan saat jalan berlubang.",
    schedule: new Date("2024-06-11T10:00:00Z"),
    serviceLocation: "Bengkel Utama",
    notes: "Sudah di cek, kemungkinan bearing roda.",
    vehicleMake: "Toyota",
    progresStatus: WoProgresStatus.ON_PROCESS,
    priorityType: WoPriorityType.NORMAL,
    vehicleId: vehicleId1,
    customerId: companyId1,
    carUserId: companyId3,
    vendorId: companyId4,
    mechanicId: mechanicId1,
    driverId: null, // Menggunakan null
    driverContact: null, // Menggunakan null
    approvedById: serviceAdvisorId1,
    requestedById: picId1,
    locationId: locationId1,
    createdAt: new Date("2024-06-10T09:00:00Z"),
    updatedAt: new Date("2024-06-10T11:30:00Z"),
  },
  {
    id: "woid-002",
    woNumber: "WO/BP/2024/002",
    woMaster: "CUST-WO-2024-002",
    date: new Date("2024-06-09T14:00:00Z"),
    settledOdo: 15000,
    remark: "Servis berkala 15.000 KM.",
    schedule: new Date("2024-06-10T08:00:00Z"),
    serviceLocation: "Bengkel Cabang Ciledug",
    notes: "Sudah ganti oli, filter oli, cek busi.",
    vehicleMake: "Honda",
    progresStatus: WoProgresStatus.FINISHED,
    priorityType: WoPriorityType.NORMAL,
    vehicleId: vehicleId2,
    customerId: companyId7,
    carUserId: companyId7,
    vendorId: companyId4,
    mechanicId: mechanicId1,
    driverId: driverId1,
    driverContact: "081122334455",
    approvedById: serviceAdvisorId1,
    requestedById: picId1,
    locationId: locationId1,
    createdAt: new Date("2024-06-09T14:00:00Z"),
    updatedAt: new Date("2024-06-10T12:00:00Z"),
  },
  {
    id: "woid-003",
    woNumber: "WO/BP/2024/003",
    woMaster: "CUST-WO-2024-003",
    date: new Date("2024-06-08T10:00:00Z"),
    settledOdo: 30000,
    remark: "AC kurang dingin, perlu dicek refrigerant.",
    schedule: new Date(), // Menggunakan null
    serviceLocation: "Mobile Service",
    notes: null, // Menggunakan null
    vehicleMake: "Suzuki",
    progresStatus: WoProgresStatus.WAITING_APPROVAL,
    priorityType: WoPriorityType.URGENT,
    vehicleId: vehicleId3,
    customerId: companyId1,
    carUserId: companyId1,
    vendorId: companyId4,
    mechanicId: null, // Menggunakan null
    driverId: null, // Menggunakan null
    driverContact: null, // Menggunakan null
    approvedById: null, // Menggunakan null
    requestedById: picId1,
    locationId: locationId1,
    createdAt: new Date("2024-06-08T10:00:00Z"),
    updatedAt: new Date("2024-06-08T15:00:00Z"),
  },
  {
    id: "woid-004",
    woNumber: "WO/BP/2024/004",
    woMaster: "CUST-WO-2024-004",
    date: new Date("2024-06-07T11:00:00Z"),
    settledOdo: 8000,
    remark: "Pergantian ban depan bocor.",
    schedule: new Date("2024-06-07T13:00:00Z"),
    serviceLocation: "Bengkel Utama",
    notes: "Ban sudah diganti, spooring balancing direkomendasikan.",
    vehicleMake: "Mitsubishi",
    progresStatus: WoProgresStatus.FINISHED,
    priorityType: WoPriorityType.NORMAL,
    vehicleId: vehicleId4, // Menggunakan ID kendaraan yang spesifik
    customerId: companyId3,
    carUserId: companyId3,
    vendorId: companyId4,
    mechanicId: mechanicId1,
    driverId: driverId1,
    driverContact: "081122334455",
    approvedById: serviceAdvisorId1,
    requestedById: picId1,
    locationId: locationId1,
    createdAt: new Date("2024-06-07T11:00:00Z"),
    updatedAt: new Date("2024-06-07T16:00:00Z"),
  },
  {
    id: "woid-005",
    woNumber: "WO/BP/2024/005",
    woMaster: "CUST-WO-2024-005",
    date: new Date("2024-06-06T16:00:00Z"),
    settledOdo: 75000,
    remark: "Overhaul mesin, suara mesin kasar dan ngebul.",
    schedule: new Date(), // Menggunakan null
    serviceLocation: "Bengkel Utama",
    notes: null, // Menggunakan null
    vehicleMake: "Nissan",
    progresStatus: WoProgresStatus.WAITING_PART,
    priorityType: WoPriorityType.EMERGENCY,
    vehicleId: vehicleId5, // Menggunakan ID kendaraan yang spesifik
    customerId: companyId1,
    carUserId: companyId3,
    vendorId: companyId4,
    mechanicId: null, // Menggunakan null
    driverId: null, // Menggunakan null
    driverContact: null, // Menggunakan null
    approvedById: null, // Menggunakan null
    requestedById: picId1,
    locationId: locationId1,
    createdAt: new Date("2024-06-06T16:00:00Z"),
    updatedAt: new Date("2024-06-06T17:00:00Z"),
  },
  {
    id: "woid-006",
    woNumber: "WO/BP/2024/006",
    woMaster: "CUST-WO-2024-006",
    date: new Date("2024-06-05T10:00:00Z"),
    settledOdo: 90000,
    remark: "Ganti oli transmisi dan filter.",
    schedule: new Date("2024-06-05T14:00:00Z"),
    serviceLocation: "Bengkel Utama",
    notes: "Transmisi terasa lebih halus.",
    vehicleMake: "Daihatsu",
    progresStatus: WoProgresStatus.FINISHED,
    priorityType: WoPriorityType.NORMAL,
    vehicleId: vehicleId6, // Menggunakan ID kendaraan yang spesifik
    customerId: companyId1,
    carUserId: companyId1,
    vendorId: companyId4,
    mechanicId: mechanicId1,
    driverId: null, // Menggunakan null
    driverContact: null, // Menggunakan null
    approvedById: serviceAdvisorId1,
    requestedById: picId1,
    locationId: locationId1,
    createdAt: new Date("2024-06-05T10:00:00Z"),
    updatedAt: new Date("2024-06-05T16:00:00Z"),
  },
  {
    id: "woid-007",
    woNumber: "WO/BP/2024/007",
    woMaster: "CUST-WO-2024-007",
    date: new Date("2024-06-04T09:30:00Z"),
    settledOdo: 40000,
    remark: "Lampu utama mati, perlu diganti.",
    schedule: new Date("2024-06-04T11:00:00Z"),
    serviceLocation: "Bengkel Utama",
    notes: "Sudah diganti dengan lampu LED H4.",
    vehicleMake: "Wuling",
    progresStatus: WoProgresStatus.FINISHED,
    priorityType: WoPriorityType.NORMAL,
    vehicleId: vehicleId7, // Menggunakan ID kendaraan yang spesifik
    customerId: companyId3,
    carUserId: companyId3,
    vendorId: companyId4,
    mechanicId: mechanicId1,
    driverId: null, // Menggunakan null
    driverContact: null, // Menggunakan null
    approvedById: serviceAdvisorId1,
    requestedById: picId1,
    locationId: locationId1,
    createdAt: new Date("2024-06-04T09:30:00Z"),
    updatedAt: new Date("2024-06-04T12:00:00Z"),
  },
  {
    id: "woid-008",
    woNumber: "WO/BP/2024/008",
    woMaster: "CUST-WO-2024-008",
    date: new Date("2024-06-03T14:00:00Z"),
    settledOdo: 12000,
    remark: "Suara dengung dari bagian belakang.",
    schedule: new Date(), // Menggunakan null
    serviceLocation: "Bengkel Utama",
    notes: null, // Menggunakan null
    vehicleMake: "Hyundai",
    progresStatus: WoProgresStatus.WAITING_APPROVAL,
    priorityType: WoPriorityType.URGENT,
    vehicleId: vehicleId8, // Menggunakan ID kendaraan yang spesifik
    customerId: companyId7,
    carUserId: companyId7,
    vendorId: companyId4,
    mechanicId: null, // Menggunakan null
    driverId: null, // Menggunakan null
    driverContact: null, // Menggunakan null
    approvedById: null, // Menggunakan null
    requestedById: picId1,
    locationId: locationId1,
    createdAt: new Date("2024-06-03T14:00:00Z"),
    updatedAt: new Date("2024-06-03T16:00:00Z"),
  },
  {
    id: "woid-009",
    woNumber: "WO/BP/2024/009",
    woMaster: "CUST-WO-2024-009",
    date: new Date("2024-06-02T10:00:00Z"),
    settledOdo: 45000,
    remark: "Pergantian ban dan spooring balancing.",
    schedule: new Date("2024-06-02T13:00:00Z"),
    serviceLocation: "Bengkel Utama",
    notes: "Ban baru sudah terpasang, siap digunakan.",
    vehicleMake: "Mazda",
    progresStatus: WoProgresStatus.FINISHED,
    priorityType: WoPriorityType.NORMAL,
    vehicleId: vehicleId9, // Menggunakan ID kendaraan yang spesifik
    customerId: companyId1,
    carUserId: companyId1,
    vendorId: companyId4,
    mechanicId: mechanicId1,
    driverId: driverId1,
    driverContact: "081122334455",
    approvedById: serviceAdvisorId1,
    requestedById: picId1,
    locationId: locationId1,
    createdAt: new Date("2024-06-02T10:00:00Z"),
    updatedAt: new Date("2024-06-02T15:00:00Z"),
  },
  {
    id: "woid-010",
    woNumber: "WO/BP/2024/010",
    woMaster: "CUST-WO-2024-010",
    date: new Date("2024-06-01T08:00:00Z"),
    settledOdo: 2000,
    remark: "Servis 1.000 KM pertama.",
    schedule: new Date("2024-06-01T09:00:00Z"),
    serviceLocation: "Bengkel Utama",
    notes: "Pengecekan umum dan ganti oli.",
    vehicleMake: "Chery",
    progresStatus: WoProgresStatus.ON_PROCESS,
    priorityType: WoPriorityType.NORMAL,
    vehicleId: vehicleId10, // Menggunakan ID kendaraan yang spesifik
    customerId: companyId9, // companyId9 sekarang didefinisikan!
    carUserId: companyId9,
    vendorId: companyId4,
    mechanicId: mechanicId1,
    driverId: null, // Menggunakan null
    driverContact: null, // Menggunakan null
    approvedById: serviceAdvisorId1,
    requestedById: picId1,
    locationId: locationId1,
    createdAt: new Date("2024-06-01T08:00:00Z"),
    updatedAt: new Date("2024-06-01T11:00:00Z"),
  },
];
