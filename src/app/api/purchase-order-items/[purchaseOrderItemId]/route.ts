import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail item purchase order berdasarkan ID
export async function GET(request: Request, { params }: { params: { purchaseOrderItemId: string } }) {
  const { purchaseOrderItemId } = params;
  try {
    const purchaseOrderItem = await prisma.purchaseOrderItem.findUnique({
      where: { id: purchaseOrderItemId },
      include: {
        purchaseOrder: {
          select: {
            id: true,
            poNumber: true,
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

    if (!purchaseOrderItem) {
      return NextResponse.json({ message: "Purchase Order Item not found" }, { status: 404 });
    }
    return NextResponse.json(purchaseOrderItem, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching purchase order item:", error);
    return NextResponse.json(
      { message: "Failed to fetch purchase order item", error: error.message },
      { status: 500 }
    );
  }
}

// Memperbarui item purchase order
export async function PUT(request: Request, { params }: { params: { purchaseOrderItemId: string } }) {
  const { purchaseOrderItemId } = params;
  try {
    const body = await request.json();
    const { poId, sparePartId, quantity, unitPrice, totalPrice } = body;

    const updatedPurchaseOrderItem = await prisma.purchaseOrderItem.update({
      where: { id: purchaseOrderItemId },
      data: {
        purchaseOrder: { connect: { id: poId } },
        sparePart: { connect: { id: sparePartId } },
        quantity: parseInt(quantity),
        unitPrice: parseFloat(unitPrice),
        totalPrice: parseFloat(totalPrice),
      },
      include: {
        // Sertakan relasi yang sama seperti GET untuk konsistensi respons
        purchaseOrder: {
          select: {
            id: true,
            poNumber: true,
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
    return NextResponse.json(updatedPurchaseOrderItem, { status: 200 });
  } catch (error: any) {
    console.error("Error updating purchase order item:", error);
    return NextResponse.json(
      { message: "Failed to update purchase order item", error: error.message },
      { status: 500 }
    );
  }
}

// Menghapus item purchase order
export async function DELETE(request: Request, { params }: { params: { purchaseOrderItemId: string } }) {
  const { purchaseOrderItemId } = params;
  try {
    await prisma.purchaseOrderItem.delete({
      where: { id: purchaseOrderItemId },
    });
    return NextResponse.json({ message: "Purchase Order Item deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting purchase order item:", error);
    return NextResponse.json(
      { message: "Failed to delete purchase order item", error: error.message },
      { status: 500 }
    );
  }
}
