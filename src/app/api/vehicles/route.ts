// src/app/api/vehicles/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua kendaraan
export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        owner: {
          // Sertakan pemilik (Company)
          select: {
            id: true,
            companyName: true,
          },
        },
        carUser: {
          // Sertakan pengguna mobil (Company)
          select: {
            id: true,
            companyName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(vehicles, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json({ message: "Failed to fetch vehicles", error: error.message }, { status: 500 });
  }
}

// Membuat kendaraan baru
export async function POST(request: Request) {
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

    const newVehicle = await prisma.vehicle.create({
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
        ...(carUserId && { carUser: { connect: { id: carUserId } } }),
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
    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error: any) {
    console.error("Error creating vehicle:", error);
    return NextResponse.json({ message: "Failed to create vehicle", error: error.message }, { status: 500 });
  }
}
