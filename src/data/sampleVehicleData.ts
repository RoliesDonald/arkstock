//  ID perusahaan dari sampleCompanyData.ts
const companyId1 = "PTMB-001"; // PT. Maju Bersama
const companyId3 = "PTTC-003"; // PT. Transportasi Cepat
const companyId7 = "PTGE-007"; // PT. Global Engineering
const companyId9 = "PTAW-009"; // PT. Armada Wisata

export enum VehicleType {
  PASSENGER = "PASSENGER",
  COMMERCIAL = "COMMERCIAL",
  MOTORCYCLE = "MOTORCYCLE",
  TRUCK = "TRUCK",
}

export enum VehicleFuelType {
  GASOLINE = "GASOLINE",
  DIESEL = "DIESEL",
  ELECTRIC = "ELECTRIC",
  HYBRID = "HYBRID",
}

export enum VehicleTransmissionType {
  MANUAL = "MANUAL",
  AUTOMATIC = "AUTOMATIC",
  CVT = "CVT",
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  vehicleMake: string;
  model: string;
  trimLevel?: string;
  modelYear?: number;
  bodyStyle?: string;
  vinNum: string;
  engineNum: string;
  companyId: string;
  chassisNum?: string | null; // Nomor sasis
  yearMade: number;
  color: string;
  vehicleType: VehicleType;
  fuelType: VehicleFuelType;
  transmissionType: VehicleTransmissionType;
  lastOdometer: number;
  lastServiceDate: Date;
  ownerId: string; // ID perusahaan/customer pemilik
  carUserId?: string | null; // ID perusahaan/user yang menggunakan (jika berbeda dari owner)
  status: string; // Contoh: Active, Inactive, Sold
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const vehicleData: Vehicle[] = [
  {
    id: "0f249516-72d9-4b68-b7c1-0c5a8e0f2f5f",
    licensePlate: "B 1234 ABC",
    vehicleMake: "Toyota",
    model: "Avanza",
    trimLevel: "G",
    vinNum: "MHKF123456V678901",
    engineNum: "K3-VE-901234567",
    chassisNum: "ABCDEF1234567890",
    yearMade: 2018,
    color: "Hitam",
    vehicleType: VehicleType.PASSENGER,
    fuelType: VehicleFuelType.GASOLINE,
    transmissionType: VehicleTransmissionType.MANUAL,
    lastOdometer: 65000,
    lastServiceDate: new Date("2024-05-20T00:00:00Z"),
    ownerId: "comp-001", // ID dummy company/customer
    carUserId: "user-001", // ID dummy user
    status: "Active",
    notes: "Unit rental aktif.",
    createdAt: new Date("2023-01-10T00:00:00Z"),
    updatedAt: new Date("2024-06-17T00:00:00Z"),
    companyId: "",
  },
  {
    id: "3b07c2a4-5e9c-4f7d-8a1b-0c5a8e0f2f5f",
    licensePlate: "B 5678 CDE",
    vehicleMake: "Honda",
    model: "Mobilio",
    trimLevel: "E",
    vinNum: "MHKF987654H321098",
    engineNum: "L15Z1-123456789",
    chassisNum: "XYZABC1234567890",
    yearMade: 2019,
    color: "Putih",
    vehicleType: VehicleType.PASSENGER,
    fuelType: VehicleFuelType.GASOLINE,
    transmissionType: VehicleTransmissionType.AUTOMATIC,
    lastOdometer: 45000,
    lastServiceDate: new Date("2024-04-15T00:00:00Z"),
    ownerId: "comp-002",
    carUserId: null,
    status: "Active",
    notes: "Milik pribadi.",
    createdAt: new Date("2023-02-01T00:00:00Z"),
    updatedAt: new Date("2024-06-10T00:00:00Z"),
    companyId: "",
  },
  {
    id: "b7a6e1d0-2f8c-4a3e-9b0c-5a8e0f2f5f12",
    licensePlate: "D 7777 FFF",
    vehicleMake: "Suzuki",
    model: "Ertiga",
    trimLevel: "GL",
    vinNum: "MHKF000111A222333",
    engineNum: "K15B-998877665",
    chassisNum: "QWERTY1234567890",
    yearMade: 2020,
    color: "Silver",
    vehicleType: VehicleType.PASSENGER,
    fuelType: VehicleFuelType.GASOLINE,
    transmissionType: VehicleTransmissionType.MANUAL,
    lastOdometer: 30000,
    lastServiceDate: new Date("2024-03-01T00:00:00Z"),
    ownerId: "comp-003",
    carUserId: null,
    status: "Active",
    notes: "Operasional perusahaan.",
    createdAt: new Date("2023-03-15T00:00:00Z"),
    updatedAt: new Date("2024-05-01T00:00:00Z"),
    companyId: "",
  },
  {
    id: "honda-brio-id",
    licensePlate: "B 4567 XYZ",
    vehicleMake: "Honda",
    model: "Brio",
    trimLevel: "RS",
    yearMade: 2021,
    color: "Kuning",
    vehicleType: VehicleType.PASSENGER,
    fuelType: VehicleFuelType.GASOLINE,
    transmissionType: VehicleTransmissionType.CVT,
    lastOdometer: 20000,
    lastServiceDate: new Date("2024-06-01T00:00:00Z"),
    ownerId: "comp-001",
    status: "Active",
    createdAt: new Date("2023-04-01T00:00:00Z"),
    updatedAt: new Date("2024-06-10T00:00:00Z"),
    vinNum: "",
    engineNum: "",
    companyId: "",
  },
  {
    id: "toyota-agya-id",
    licensePlate: "B 8888 POP",
    vehicleMake: "Toyota",
    model: "Agya",
    trimLevel: "TRD",
    yearMade: 2020,
    color: "Merah",
    vehicleType: VehicleType.PASSENGER,
    fuelType: VehicleFuelType.GASOLINE,
    transmissionType: VehicleTransmissionType.AUTOMATIC,
    lastOdometer: 35000,
    lastServiceDate: new Date("2024-02-01T00:00:00Z"),
    ownerId: "comp-002",
    status: "Active",
    createdAt: new Date("2023-05-10T00:00:00Z"),
    updatedAt: new Date("2024-06-05T00:00:00Z"),
    vinNum: "",
    engineNum: "",
    companyId: "",
  },
  {
    id: "daihatsu-ayla-id",
    licensePlate: "B 9999 ABC",
    vehicleMake: "Daihatsu",
    model: "Ayla",
    trimLevel: "X",
    yearMade: 2020,
    color: "Abu-abu",
    vehicleType: VehicleType.PASSENGER,
    fuelType: VehicleFuelType.GASOLINE,
    transmissionType: VehicleTransmissionType.MANUAL,
    lastOdometer: 40000,
    lastServiceDate: new Date("2024-01-15T00:00:00Z"),
    ownerId: "comp-003",
    status: "Active",
    createdAt: new Date("2023-06-20T00:00:00Z"),
    updatedAt: new Date("2024-05-25T00:00:00Z"),
    vinNum: "",
    engineNum: "",
    companyId: "",
  },
  {
    id: "suzuki-swift-id",
    licensePlate: "B 1111 TTT",
    vehicleMake: "Suzuki",
    model: "Swift",
    trimLevel: "GT",
    yearMade: 2017,
    color: "Biru",
    vehicleType: VehicleType.PASSENGER,
    fuelType: VehicleFuelType.GASOLINE,
    transmissionType: VehicleTransmissionType.AUTOMATIC,
    lastOdometer: 70000,
    lastServiceDate: new Date("2024-04-01T00:00:00Z"),
    ownerId: "comp-001",
    status: "Active",
    createdAt: new Date("2023-07-05T00:00:00Z"),
    updatedAt: new Date("2024-06-12T00:00:00Z"),
    vinNum: "",
    engineNum: "",
    companyId: "",
  },
];

export const getUniqueVehicleMake = (): string[] => {
  const makes = new Set<string>();
  vehicleData.forEach((vehicle) => makes.add(vehicle.vehicleMake));
  return Array.from(makes).sort();
};

export const getModelsByMake = (make: string): string[] => {
  const models = new Set<string>();
  vehicleData
    .filter((vehicle) => vehicle.vehicleMake === make)
    .forEach((vehicle) => models.add(vehicle.model));
  return Array.from(models).sort();
};
