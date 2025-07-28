import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua item work order
export async function GET() {
  try {
    const workOrderItems = await prisma.workOrderItem.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(workOrderItems, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching work order items:", error);
    return NextResponse.json(
      { message: "Failed to fetch work order items", error: error.message },
      { status: 500 }
    );
  }
}

// Membuat item work order baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { workOrderId, sparePartId, quantity, unitPrice, totalPrice } = body;

    const newWorkOrderItem = await prisma.workOrderItem.create({
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
    return NextResponse.json(newWorkOrderItem, { status: 201 });
  } catch (error: any) {
    console.error("Error creating work order item:", error);
    return NextResponse.json(
      { message: "Failed to create work order item", error: error.message },
      { status: 500 }
    );
  }
}
