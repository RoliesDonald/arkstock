import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail spare part work order berdasarkan ID
export async function GET(request: Request, { params }: { params: { workOrderSparePartId: string } }) {
  const { workOrderSparePartId } = params;
  try {
    const workOrderSparePart = await prisma.workOrderSparePart.findUnique({
      where: { id: workOrderSparePartId },
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

    if (!workOrderSparePart) {
      return NextResponse.json({ message: "Work Order Spare Part not found" }, { status: 404 });
    }
    return NextResponse.json(workOrderSparePart, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching work order spare part:", error);
    return NextResponse.json(
      { message: "Failed to fetch work order spare part", error: error.message },
      { status: 500 }
    );
  }
}

// Memperbarui spare part work order
export async function PUT(request: Request, { params }: { params: { workOrderSparePartId: string } }) {
  const { workOrderSparePartId } = params;
  try {
    const body = await request.json();
    const { workOrderId, sparePartId, quantity, unitPrice, totalPrice } = body;

    const updatedWorkOrderSparePart = await prisma.workOrderSparePart.update({
      where: { id: workOrderSparePartId },
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
    return NextResponse.json(updatedWorkOrderSparePart, { status: 200 });
  } catch (error: any) {
    console.error("Error updating work order spare part:", error);
    return NextResponse.json(
      { message: "Failed to update work order spare part", error: error.message },
      { status: 500 }
    );
  }
}

// Menghapus spare part work order
export async function DELETE(request: Request, { params }: { params: { workOrderSparePartId: string } }) {
  const { workOrderSparePartId } = params;
  try {
    await prisma.workOrderSparePart.delete({
      where: { id: workOrderSparePartId },
    });
    return NextResponse.json({ message: "Work Order Spare Part deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting work order spare part:", error);
    return NextResponse.json(
      { message: "Failed to delete work order spare part", error: error.message },
      { status: 500 }
    );
  }
}
