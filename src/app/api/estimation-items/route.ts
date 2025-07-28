import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const estimationItems = await prisma.estimationItem.findMany({
      include: {
        estimation: {
          select: {
            id: true,
            estimationNumber: true,
          },
        },
        sparePart: {
          select: {
            id: true,
            partName: true,
            partNumber: true,
            unit: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    return NextResponse.json(estimationItems, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching estimation items:", error);
    return NextResponse.json(
      { message: "failed to fetch estimation items", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { estimationId, sparePartId, quantity, price, subtotal } = body;
    const newEstimationItem = await prisma.estimationItem.create({
      data: {
        estimation: { connect: { id: estimationId } },
        sparePart: { connect: { id: sparePartId } },
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        subtotal: parseFloat(subtotal),
      },
      include: {
        estimation: {
          select: {
            id: true,
            estimationNumber: true,
          },
        },
        sparePart: {
          select: {
            id: true,
            partName: true,
            partNumber: true,
            unit: true,
          },
        },
      },
    });
    return NextResponse.json(newEstimationItem, { status: 201 });
  } catch (error: any) {
    console.error("Error creating estimation item:", error);
    return NextResponse.json(
      { message: "failed to create estimation item", error: error.message },
      { status: 500 }
    );
  }
}
