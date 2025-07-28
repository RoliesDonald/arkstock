import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua spare part work order
export async function GET() {
  try {
    const workOrderSpareParts = await prisma.workOrderSparePart.findMany({
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
    return NextResponse.json(workOrderSpareParts, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching work order spare parts:", error);
    return NextResponse.json(
      { message: "Failed to fetch work order spare parts", error: error.message },
      { status: 500 }
    );
  }
}

// Membuat spare part work order baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { workOrderId, sparePartId, quantity, unitPrice, totalPrice } = body;

    const newWorkOrderSparePart = await prisma.workOrderSparePart.create({
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
    return NextResponse.json(newWorkOrderSparePart, { status: 201 });
  } catch (error: any) {
    console.error("Error creating work order spare part:", error);
    return NextResponse.json(
      { message: "Failed to create work order spare part", error: error.message },
      { status: 500 }
    );
  }
}
