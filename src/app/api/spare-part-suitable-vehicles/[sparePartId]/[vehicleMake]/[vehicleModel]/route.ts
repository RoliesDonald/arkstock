// src/app/api/spare-part-suitable-vehicles/[sparePartId]/[vehicleMake]/[vehicleModel]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail kendaraan yang cocok dengan spare part berdasarkan composite ID
export async function GET(
  request: Request,
  { params }: { params: { sparePartId: string; vehicleMake: string; vehicleModel: string } }
) {
  const { sparePartId, vehicleMake, vehicleModel } = params;
  try {
    const sparePartSuitableVehicle = await prisma.sparePartSuitableVehicle.findUnique({
      where: {
        sparePartId_vehicleMake_vehicleModel: {
          // Menggunakan composite key
          sparePartId: sparePartId,
          vehicleMake: vehicleMake,
          vehicleModel: vehicleModel,
        },
      },
      include: {
        sparePart: {
          select: {
            id: true,
            partNumber: true,
            partName: true,
          },
        },
      },
    });

    if (!sparePartSuitableVehicle) {
      return NextResponse.json({ message: "Spare Part Suitable Vehicle not found" }, { status: 404 });
    }
    return NextResponse.json(sparePartSuitableVehicle, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching spare part suitable vehicle:", error);
    return NextResponse.json(
      { message: "Failed to fetch spare part suitable vehicle", error: error.message },
      { status: 500 }
    );
  }
}

// Memperbarui entri kendaraan yang cocok dengan spare part
export async function PUT(
  request: Request,
  { params }: { params: { sparePartId: string; vehicleMake: string; vehicleModel: string } }
) {
  const { sparePartId, vehicleMake, vehicleModel } = params;
  try {
    const body = await request.json();
    const { trimLevel, modelYear } = body; // Hanya field yang bisa diupdate

    const updatedSparePartSuitableVehicle = await prisma.sparePartSuitableVehicle.update({
      where: {
        sparePartId_vehicleMake_vehicleModel: {
          // Menggunakan composite key
          sparePartId: sparePartId,
          vehicleMake: vehicleMake,
          vehicleModel: vehicleModel,
        },
      },
      data: {
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
    return NextResponse.json(updatedSparePartSuitableVehicle, { status: 200 });
  } catch (error: any) {
    console.error("Error updating spare part suitable vehicle:", error);
    return NextResponse.json(
      { message: "Failed to update spare part suitable vehicle", error: error.message },
      { status: 500 }
    );
  }
}

// Menghapus entri kendaraan yang cocok dengan spare part
export async function DELETE(
  request: Request,
  { params }: { params: { sparePartId: string; vehicleMake: string; vehicleModel: string } }
) {
  const { sparePartId, vehicleMake, vehicleModel } = params;
  try {
    await prisma.sparePartSuitableVehicle.delete({
      where: {
        sparePartId_vehicleMake_vehicleModel: {
          // Menggunakan composite key
          sparePartId: sparePartId,
          vehicleMake: vehicleMake,
          vehicleModel: vehicleModel,
        },
      },
    });
    return NextResponse.json(
      { message: "Spare Part Suitable Vehicle deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting spare part suitable vehicle:", error);
    return NextResponse.json(
      { message: "Failed to delete spare part suitable vehicle", error: error.message },
      { status: 500 }
    );
  }
}
