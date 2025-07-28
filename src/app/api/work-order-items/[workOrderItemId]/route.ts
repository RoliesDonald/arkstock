// src/app/api/work-order-items/[workOrderItemId]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail item work order berdasarkan ID
export async function GET(request: Request, { params }: { params: { workOrderItemId: string } }) {
  const { workOrderItemId } = params;
  try {
    const workOrderItem = await prisma.workOrderItem.findUnique({
      where: { id: workOrderItemId },
      include: {
        workOrder: {
          select: {
            id: true,
            workOrderNumber: true,
          },
        },
        sparePart: {
          select: {
            id: true,
            partNumber: true,
            partName: true,
            unit: true,
          },
        },
      },
    });

    if (!workOrderItem) {
      return NextResponse.json({ message: "Work Order Item not found" }, { status: 404 });
    }
    return NextResponse.json(workOrderItem, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching work order item:", error);
    return NextResponse.json(
      { message: "Failed to fetch work order item", error: error.message },
      { status: 500 }
    );
  }
}

// Memperbarui item work order
export async function PUT(request: Request, { params }: { params: { workOrderItemId: string } }) {
  const { workOrderItemId } = params;
  try {
    const body = await request.json();
    const { workOrderId, sparePartId, quantity, unitPrice, totalPrice } = body;

    const updatedWorkOrderItem = await prisma.workOrderItem.update({
      where: { id: workOrderItemId },
      data: {
        workOrder: { connect: { id: workOrderId } },
        sparePart: { connect: { id: sparePartId } },
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
        sparePart: {
          select: {
            id: true,
            partNumber: true,
            partName: true,
            unit: true,
          },
        },
      },
    });
    return NextResponse.json(updatedWorkOrderItem, { status: 200 });
  } catch (error: any) {
    console.error("Error updating work order item:", error);
    return NextResponse.json(
      { message: "Failed to update work order item", error: error.message },
      { status: 500 }
    );
  }
}

// Menghapus item work order
export async function DELETE(request: Request, { params }: { params: { workOrderItemId: string } }) {
  const { workOrderItemId } = params;
  try {
    await prisma.workOrderItem.delete({
      where: { id: workOrderItemId },
    });
    return NextResponse.json({ message: "Work Order Item deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting work order item:", error);
    return NextResponse.json(
      { message: "Failed to delete work order item", error: error.message },
      { status: 500 }
    );
  }
}
