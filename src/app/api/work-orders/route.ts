import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua Work Order
export async function GET() {
  try {
    const workOrders = await prisma.workOrder.findMany({
      include: {
        vehicle: {
          select: {
            id: true,
            licensePlate: true,
            vehicleMake: true,
            model: true,
          },
        },
        customer: {
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
        vendor: {
          select: {
            id: true,
            companyName: true,
          },
        },
        mechanic: {
          select: {
            id: true,
            name: true,
            position: true,
          },
        },
        driver: {
          select: {
            id: true,
            name: true,
            position: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            position: true,
          },
        },
        requestedBy: {
          select: {
            id: true,
            name: true,
            position: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(workOrders, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching work orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch work orders", error: error.message },
      { status: 500 }
    );
  }
}

// Membuat Work Order baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      workOrderNumber,
      workOrderMaster,
      date,
      settledOdo,
      remark,
      schedule,
      serviceLocation,
      notes,
      vehicleMake,
      progresStatus,
      priorityType,
      vehicleId,
      customerId,
      carUserId,
      vendorId,
      mechanicId,
      driverId,
      driverContact,
      approvedById,
      requestedById,
      locationId,
    } = body;

    const newWorkOrder = await prisma.workOrder.create({
      data: {
        workOrderNumber,
        workOrderMaster,
        date: new Date(date),
        settledOdo: settledOdo ? parseInt(settledOdo) : null,
        remark,
        schedule: schedule ? new Date(schedule) : null,
        serviceLocation,
        notes,
        vehicleMake,
        progresStatus,
        priorityType,
        vehicle: { connect: { id: vehicleId } },
        customer: { connect: { id: customerId } },
        carUser: { connect: { id: carUserId } },
        vendor: { connect: { id: vendorId } },
        ...(mechanicId && { mechanic: { connect: { id: mechanicId } } }),
        ...(driverId && { driver: { connect: { id: driverId } } }),
        driverContact,
        ...(approvedById && { approvedBy: { connect: { id: approvedById } } }),
        ...(requestedById && { requestedBy: { connect: { id: requestedById } } }),
        ...(locationId && { location: { connect: { id: locationId } } }),
      },
      include: {
        // Sertakan relasi yang sama seperti GET untuk konsistensi respons
        vehicle: {
          select: {
            id: true,
            licensePlate: true,
            vehicleMake: true,
            model: true,
          },
        },
        customer: {
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
        vendor: {
          select: {
            id: true,
            companyName: true,
          },
        },
        mechanic: {
          select: {
            id: true,
            name: true,
            position: true,
          },
        },
        driver: {
          select: {
            id: true,
            name: true,
            position: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            position: true,
          },
        },
        requestedBy: {
          select: {
            id: true,
            name: true,
            position: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return NextResponse.json(newWorkOrder, { status: 201 });
  } catch (error: any) {
    console.error("Error creating work order:", error);
    return NextResponse.json(
      { message: "Failed to create work order", error: error.message },
      { status: 500 }
    );
  }
}
