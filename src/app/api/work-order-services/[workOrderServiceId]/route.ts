import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail jasa work order berdasarkan ID
export async function GET(request: Request, { params }: { params: { workOrderServiceId: string } }) {
  const { workOrderServiceId } = params;
  try {
    const workOrderService = await prisma.workOrderService.findUnique({
      where: { id: workOrderServiceId },
      include: {
        workOrder: {
          select: {
            id: true,
            workOrderNumber: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    if (!workOrderService) {
      return NextResponse.json({ message: "Work Order Service not found" }, { status: 404 });
    }
    return NextResponse.json(workOrderService, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching work order service:", error);
    return NextResponse.json(
      { message: "Failed to fetch work order service", error: error.message },
      { status: 500 }
    );
  }
}

// Memperbarui jasa work order
export async function PUT(request: Request, { params }: { params: { workOrderServiceId: string } }) {
  const { workOrderServiceId } = params;
  try {
    const body = await request.json();
    const { workOrderId, serviceId, quantity, unitPrice, totalPrice } = body;

    const updatedWorkOrderService = await prisma.workOrderService.update({
      where: { id: workOrderServiceId },
      data: {
        workOrder: { connect: { id: workOrderId } },
        service: { connect: { id: serviceId } },
        quantity: parseInt(quantity),
        unitPrice: parseFloat(unitPrice),
        totalPrice: parseFloat(totalPrice),
      },
      include: {
        // Sertakan relasi yang sama seperti GET untuk konsistensi respons
        workOrder: {
          select: {
            id: true,
            workOrderNumber: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });
    return NextResponse.json(updatedWorkOrderService, { status: 200 });
  } catch (error: any) {
    console.error("Error updating work order service:", error);
    return NextResponse.json(
      { message: "Failed to update work order service", error: error.message },
      { status: 500 }
    );
  }
}

// Menghapus jasa work order
export async function DELETE(request: Request, { params }: { params: { workOrderServiceId: string } }) {
  const { workOrderServiceId } = params;
  try {
    await prisma.workOrderService.delete({
      where: { id: workOrderServiceId },
    });
    return NextResponse.json({ message: "Work Order Service deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting work order service:", error);
    return NextResponse.json(
      { message: "Failed to delete work order service", error: error.message },
      { status: 500 }
    );
  }
}
