import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail Work Order berdasarkan ID
export async function GET(request: Request, { params }: { params: { workOrderId: string } }) {
  const { workOrderId } = params;
  try {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id: workOrderId },
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
        // Anda bisa menyertakan relasi lain yang relevan untuk detail di sini
        // Misalnya: invoice, estimation, workOrderTasks, workOrderServices, workOrderSpareParts, workOrderImages
      },
    });

    if (!workOrder) {
      return NextResponse.json({ message: "Work Order not found" }, { status: 404 });
    }
    return NextResponse.json(workOrder, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching work order:", error);
    return NextResponse.json(
      { message: "Failed to fetch work order", error: error.message },
      { status: 500 }
    );
  }
}

// Memperbarui Work Order
export async function PUT(request: Request, { params }: { params: { workOrderId: string } }) {
  const { workOrderId } = params;
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

    const updatedWorkOrder = await prisma.workOrder.update({
      where: { id: workOrderId },
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
        mechanic: mechanicId ? { connect: { id: mechanicId } } : { disconnect: true },
        driver: driverId ? { connect: { id: driverId } } : { disconnect: true },
        driverContact,
        approvedBy: approvedById ? { connect: { id: approvedById } } : { disconnect: true },
        requestedBy: requestedById ? { connect: { id: requestedById } } : { disconnect: true },
        location: locationId ? { connect: { id: locationId } } : { disconnect: true },
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
    return NextResponse.json(updatedWorkOrder, { status: 200 });
  } catch (error: any) {
    console.error("Error updating work order:", error);
    return NextResponse.json(
      { message: "Failed to update work order", error: error.message },
      { status: 500 }
    );
  }
}

// Menghapus Work Order
export async function DELETE(request: Request, { params }: { params: { workOrderId: string } }) {
  const { workOrderId } = params;
  try {
    await prisma.workOrder.delete({
      where: { id: workOrderId },
    });
    return NextResponse.json({ message: "Work Order deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting work order:", error);
    return NextResponse.json(
      { message: "Failed to delete work order", error: error.message },
      { status: 500 }
    );
  }
}
