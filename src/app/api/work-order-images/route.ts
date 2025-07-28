import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua gambar work order
export async function GET() {
  try {
    const workOrderImages = await prisma.workOrderImage.findMany({
      include: {
        workOrder: {
          select: {
            id: true,
            workOrderNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(workOrderImages, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching work order images:", error);
    return NextResponse.json(
      { message: "Failed to fetch work order images", error: error.message },
      { status: 500 }
    );
  }
}

// Membuat gambar work order baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { workOrderId, imageUrl, description, uploadedBy } = body;

    const newWorkOrderImage = await prisma.workOrderImage.create({
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
    return NextResponse.json(newWorkOrderImage, { status: 201 });
  } catch (error: any) {
    console.error("Error creating work order image:", error);
    return NextResponse.json(
      { message: "Failed to create work order image", error: error.message },
      { status: 500 }
    );
  }
}
