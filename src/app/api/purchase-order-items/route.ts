import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua item purchase order
export async function GET() {
  try {
    const purchaseOrderItems = await prisma.purchaseOrderItem.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(purchaseOrderItems, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching purchase order items:", error);
    return NextResponse.json(
      { message: "Failed to fetch purchase order items", error: error.message },
      { status: 500 }
    );
  }
}

// Membuat item purchase order baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { poId, sparePartId, quantity, unitPrice, totalPrice } = body;

    const newPurchaseOrderItem = await prisma.purchaseOrderItem.create({
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
    return NextResponse.json(newPurchaseOrderItem, { status: 201 });
  } catch (error: any) {
    console.error("Error creating purchase order item:", error);
    return NextResponse.json(
      { message: "Failed to create purchase order item", error: error.message },
      { status: 500 }
    );
  }
}
