import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail gambar work order berdasarkan ID
export async function GET(request: Request, { params }: { params: { workOrderImageId: string } }) {
  const { workOrderImageId } = params;
  try {
    const workOrderImage = await prisma.workOrderImage.findUnique({
      where: { id: workOrderImageId },
      include: {
        workOrder: {
          select: {
            id: true,
            workOrderNumber: true,
          },
        },
      },
    });

    if (!workOrderImage) {
      return NextResponse.json({ message: "Work Order Image not found" }, { status: 404 });
    }
    return NextResponse.json(workOrderImage, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching work order image:", error);
    return NextResponse.json(
      { message: "Failed to fetch work order image", error: error.message },
      { status: 500 }
    );
  }
}

// Memperbarui gambar work order
export async function PUT(request: Request, { params }: { params: { workOrderImageId: string } }) {
  const { workOrderImageId } = params;
  try {
    const body = await request.json();
    const { workOrderId, imageUrl, description, uploadedBy } = body;

    const updatedWorkOrderImage = await prisma.workOrderImage.update({
      where: { id: workOrderImageId },
      data: {
        workOrder: { connect: { id: workOrderId } },
        imageUrl,
        description,
        uploadedBy,
      },
      include: {
        // Sertakan relasi yang sama seperti GET untuk konsistensi respons
        workOrder: {
          select: {
            id: true,
            workOrderNumber: true,
          },
        },
      },
    });
    return NextResponse.json(updatedWorkOrderImage, { status: 200 });
  } catch (error: any) {
    console.error("Error updating work order image:", error);
    return NextResponse.json(
      { message: "Failed to update work order image", error: error.message },
      { status: 500 }
    );
  }
}

// Menghapus gambar work order
export async function DELETE(request: Request, { params }: { params: { workOrderImageId: string } }) {
  const { workOrderImageId } = params;
  try {
    await prisma.workOrderImage.delete({
      where: { id: workOrderImageId },
    });
    return NextResponse.json({ message: "Work Order Image deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting work order image:", error);
    return NextResponse.json(
      { message: "Failed to delete work order image", error: error.message },
      { status: 500 }
    );
  }
}
