// src/app/api/vehicles/[vehicleId]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail kendaraan berdasarkan ID
export async function GET(request: Request, { params }: { params: { vehicleId: string } }) {
  const { vehicleId } = params;
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        owner: {
          select: {
            id: true,
            companyName: true,
          },
        },
        carUser: {
          select: {
            id: true,
            companyName: true,
          },
        },
        // Anda bisa menyertakan relasi lain yang relevan untuk detail di sini
        // Misalnya: workOrders, invoices, estimations
      },
    });

    if (!vehicle) {
      return NextResponse.json({ message: "Vehicle not found" }, { status: 404 });
    }
    return NextResponse.json(vehicle, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json({ message: "Failed to fetch vehicle", error: error.message }, { status: 500 });
  }
}

// Memperbarui kendaraan
export async function PUT(request: Request, { params }: { params: { vehicleId: string } }) {
  const { vehicleId } = params;
  try {
    const body = await request.json();
    const {
      licensePlate,
      vehicleMake,
      model,
      trimLevel,
      vinNum,
      engineNum,
      chassisNum,
      yearMade,
      color,
      vehicleType,
      vehicleCategory,
      fuelType,
      transmissionType,
      lastOdometer,
      lastServiceDate,
      status,
      notes,
      ownerId,
      carUserId,
    } = body;

    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        licensePlate,
        vehicleMake,
        model,
        trimLevel,
        vinNum,
        engineNum,
        chassisNum,
        yearMade: parseInt(yearMade),
        color,
        vehicleType,
        vehicleCategory,
        fuelType,
        transmissionType,
        lastOdometer: parseInt(lastOdometer),
        lastServiceDate: new Date(lastServiceDate),
        status,
        notes,
        owner: { connect: { id: ownerId } },
        carUser: carUserId ? { connect: { id: carUserId } } : { disconnect: true },
      },
      include: {
        // Sertakan relasi yang sama seperti GET untuk konsistensi respons
        owner: {
          select: {
            id: true,
            companyName: true,
          },
        },
        carUser: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });
    return NextResponse.json(updatedVehicle, { status: 200 });
  } catch (error: any) {
    console.error("Error updating vehicle:", error);
    return NextResponse.json({ message: "Failed to update vehicle", error: error.message }, { status: 500 });
  }
}

// Menghapus kendaraan
export async function DELETE(request: Request, { params }: { params: { vehicleId: string } }) {
  const { vehicleId } = params;
  try {
    await prisma.vehicle.delete({
      where: { id: vehicleId },
    });
    return NextResponse.json({ message: "Vehicle deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting vehicle:", error);
    return NextResponse.json({ message: "Failed to delete vehicle", error: error.message }, { status: 500 });
  }
}
