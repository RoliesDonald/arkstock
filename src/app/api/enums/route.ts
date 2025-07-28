import { NextResponse } from "next/server";
import {
  EmployeeRole,
  EmployeeStatus,
  Gender,
  PartVariant,
  SparePartCategory,
  SparePartStatus,
  EmployeePosition,
} from "@prisma/client";

export async function GET() {
  try {
    const enums = {
      SparePartCategory: Object.values(SparePartCategory),
      SparePartStatus: Object.values(SparePartStatus),
      PartVariant: Object.values(PartVariant),
      EmployeeRole: Object.values(EmployeeRole),
      EmployeePosition: Object.values(EmployeePosition),
      EmployeeStatus: Object.values(EmployeeStatus),
      Gender: Object.values(Gender),
    };

    return NextResponse.json(enums);
  } catch (error) {
    console.error("Error fetching enums:", error);
    return NextResponse.json({ message: "Failed to fetch enums" }, { status: 500 });
  }
}
