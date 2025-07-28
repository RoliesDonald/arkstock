import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail jasa berdasarkan ID
export async function GET(request: Request, { params }: { params: { serviceId: string } }) {
  const { serviceId } = params;
  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }
    return NextResponse.json(service, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching service:", error);
    return NextResponse.json({ message: "Failed to fetch service", error: error.message }, { status: 500 });
  }
}

// Memperbarui jasa
export async function PUT(request: Request, { params }: { params: { serviceId: string } }) {
  const { serviceId } = params;
  try {
    const body = await request.json();
    const { name, description, price, category, subCategory, tasks } = body;

    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        subCategory,
        tasks,
      },
    });
    return NextResponse.json(updatedService, { status: 200 });
  } catch (error: any) {
    console.error("Error updating service:", error);
    return NextResponse.json({ message: "Failed to update service", error: error.message }, { status: 500 });
  }
}

// Menghapus jasa
export async function DELETE(request: Request, { params }: { params: { serviceId: string } }) {
  const { serviceId } = params;
  try {
    await prisma.service.delete({
      where: { id: serviceId },
    });
    return NextResponse.json({ message: "Service deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ message: "Failed to delete service", error: error.message }, { status: 500 });
  }
}
