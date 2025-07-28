import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua kendaraan yang cocok dengan spare part
export async function GET() {
  try {
    const sparePartSuitableVehicles = await prisma.sparePartSuitableVehicle.findMany({
      include: {
        sparePart: {
          select: {
            id: true,
            partNumber: true,
            partName: true,
          },
        },
      },
      orderBy: {
        sparePartId: "asc", // Order by the composite key parts
        vehicleMake: "asc",
        vehicleModel: "asc",
      },
    });
    return NextResponse.json(sparePartSuitableVehicles, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching spare part suitable vehicles:", error);
    return NextResponse.json(
      { message: "Failed to fetch spare part suitable vehicles", error: error.message },
      { status: 500 }
    );
  }
}

// Membuat entri kendaraan yang cocok dengan spare part baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sparePartId, vehicleMake, vehicleModel, trimLevel, modelYear } = body;

    const newSparePartSuitableVehicle = await prisma.sparePartSuitableVehicle.create({
      data: {
        sparePart: { connect: { id: sparePartId } },
        vehicleMake,
        vehicleModel,
        trimLevel,
        modelYear: modelYear ? parseInt(modelYear) : null,
      },
      include: {
        // Sertakan relasi yang sama seperti GET untuk konsistensi respons
        sparePart: {
          select: {
            id: true,
            partNumber: true,
            partName: true,
          },
        },
      },
    });
    return NextResponse.json(newSparePartSuitableVehicle, { status: 201 });
  } catch (error: any) {
    console.error("Error creating spare part suitable vehicle:", error);
    return NextResponse.json(
      { message: "Failed to create spare part suitable vehicle", error: error.message },
      { status: 500 }
    );
  }
}
