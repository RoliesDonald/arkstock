import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail purchase order berdasarkan ID
export async function GET(request: Request, { params }: { params: { purchaseOrderId: string } }) {
  const { purchaseOrderId } = params;
  try {
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id: purchaseOrderId },
      include: {
        supplier: {
          select: {
            id: true,
            companyName: true,
          },
        },
        requestedBy: {
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
      },
    });

    if (!purchaseOrder) {
      return NextResponse.json({ message: "Purchase Order not found" }, { status: 404 });
    }
    return NextResponse.json(purchaseOrder, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching purchase order:", error);
    return NextResponse.json(
      { message: "Failed to fetch purchase order", error: error.message },
      { status: 500 }
    );
  }
}

// Memperbarui purchase order
export async function PUT(request: Request, { params }: { params: { purchaseOrderId: string } }) {
  const { purchaseOrderId } = params;
  try {
    const body = await request.json();
    const {
      poNumber,
      poDate,
      supplierId,
      deliveryAddress,
      subtotal,
      tax,
      totalAmount,
      deliveryDate,
      status,
      requestedById,
      approvedById,
      remark,
      rejectionReason,
    } = body;

    const updatedPurchaseOrder = await prisma.purchaseOrder.update({
      where: { id: purchaseOrderId },
      data: {
        poNumber,
        poDate: new Date(poDate),
        supplier: { connect: { id: supplierId } },
        deliveryAddress,
        subtotal: parseFloat(subtotal),
        tax: parseFloat(tax),
        totalAmount: parseFloat(totalAmount),
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        status,
        requestedBy: requestedById ? { connect: { id: requestedById } } : { disconnect: true },
        approvedBy: approvedById ? { connect: { id: approvedById } } : { disconnect: true },
        remark,
        rejectionReason,
      },
      include: {
        // Sertakan relasi yang sama seperti GET untuk konsistensi respons
        supplier: {
          select: {
            id: true,
            companyName: true,
          },
        },
        requestedBy: {
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
      },
    });
    return NextResponse.json(updatedPurchaseOrder, { status: 200 });
  } catch (error: any) {
    console.error("Error updating purchase order:", error);
    return NextResponse.json(
      { message: "Failed to update purchase order", error: error.message },
      { status: 500 }
    );
  }
}

// Menghapus purchase order
export async function DELETE(request: Request, { params }: { params: { purchaseOrderId: string } }) {
  const { purchaseOrderId } = params;
  try {
    await prisma.purchaseOrder.delete({
      where: { id: purchaseOrderId },
    });
    return NextResponse.json({ message: "Purchase Order deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting purchase order:", error);
    return NextResponse.json(
      { message: "Failed to delete purchase order", error: error.message },
      { status: 500 }
    );
  }
}
