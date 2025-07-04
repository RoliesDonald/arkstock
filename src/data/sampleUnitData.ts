import { Unit } from "@/types/unit";
import { v4 as uuidv4 } from "uuid";

export const unitData: Unit[] = [
  {
    id: uuidv4(),
    name: "Pcs",
    description: "Pieces",
    createdAt: new Date("2023-01-01T00:00:00Z"),
    updatedAt: new Date("2023-01-01T00:00:00Z"),
  },
  {
    id: uuidv4(),
    name: "Set",
    description: "Satu set",
    createdAt: new Date("2023-01-01T00:00:00Z"),
    updatedAt: new Date("2023-01-01T00:00:00Z"),
  },
  {
    id: uuidv4(),
    name: "Box",
    description: "Satu kotak",
    createdAt: new Date("2023-01-01T00:00:00Z"),
    updatedAt: new Date("2023-01-01T00:00:00Z"),
  },
  {
    id: uuidv4(),
    name: "Kg",
    description: "Kilogram",
    createdAt: new Date("2023-01-01T00:00:00Z"),
    updatedAt: new Date("2023-01-01T00:00:00Z"),
  },
  {
    id: uuidv4(),
    name: "Liter",
    description: "Liter",
    createdAt: new Date("2023-01-01T00:00:00Z"),
    updatedAt: new Date("2023-01-01T00:00:00Z"),
  },
  {
    id: uuidv4(),
    name: "Meter",
    description: "Meter",
    createdAt: new Date("2023-01-01T00:00:00Z"),
    updatedAt: new Date("2023-01-01T00:00:00Z"),
  },
];
