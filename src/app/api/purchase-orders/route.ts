import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua purchase order
export async function GET() {
  try {
    const purchaseOrders = await prisma.purchaseOrder.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(purchaseOrders, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching purchase orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch purchase orders", error: error.message },
      { status: 500 }
    );
  }
}

// Membuat purchase order baru
export async function POST(request: Request) {
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

    const newPurchaseOrder = await prisma.purchaseOrder.create({
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
        ...(requestedById && { requestedBy: { connect: { id: requestedById } } }),
        ...(approvedById && { approvedBy: { connect: { id: approvedById } } }),
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
    return NextResponse.json(newPurchaseOrder, { status: 201 });
  } catch (error: any) {
    console.error("Error creating purchase order:", error);
    return NextResponse.json(
      { message: "Failed to create purchase order", error: error.message },
      { status: 500 }
    );
  }
}
