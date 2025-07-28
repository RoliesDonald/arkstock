import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { estimationItemId: string } }) {
  const { estimationItemId } = params;
  try {
    const estimationItem = await prisma.estimationItem.findUnique({
      where: { id: estimationItemId },
      include: {
        estimation: { select: { id: true, estimationNumber: true } },
        sparePart: { select: { id: true, partName: true, partNumber: true, unit: true } },
      },
    });
    if (!estimationItem) {
      return NextResponse.json({ message: "Estimation item not found" }, { status: 400 });
    }
    return NextResponse.json(estimationItem, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching estimation item:", error);
    return NextResponse.json({ message: "failed to fetch estimation item" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { estimationItemId: string } }) {
  const { estimationItemId } = params;
  try {
    const body = await request.json();
    const { estimationId, sparePartId, quantity, price, subtotal } = body;
    const updatedEstimationItem = await prisma.estimationItem.update({
      where: { id: estimationItemId },
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
    return NextResponse.json(updatedEstimationItem, { status: 200 });
  } catch (error: any) {
    console.error("Error updating estimation item:", error);
    return NextResponse.json({ messega: "Failed to update estimation item" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { estimationItemId: string } }) {
  const { estimationItemId } = params;
  try {
    await prisma.estimationItem.delete({ where: { id: estimationItemId } });
    return NextResponse.json({ messsage: "Estimation item deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting estimation item:", error);
    return NextResponse.json(
      { message: "failed to delete estimation item", error: error.message },
      { status: 500 }
    );
  }
}
