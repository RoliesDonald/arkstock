import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail lokasi berdasarkan ID
export async function GET(request: Request, { params }: { params: { locationId: string } }) {
  const { locationId } = params;
  try {
    const location = await prisma.location.findUnique({
      where: { id: locationId },
    });

    if (!location) {
      return NextResponse.json({ message: "Location not found" }, { status: 404 });
    }
    return NextResponse.json(location, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching location:", error);
    return NextResponse.json({ message: "Failed to fetch location", error: error.message }, { status: 500 });
  }
}

// Memperbarui lokasi
export async function PUT(request: Request, { params }: { params: { locationId: string } }) {
  const { locationId } = params;
  try {
    const body = await request.json();
    const { name, address } = body;

    const updatedLocation = await prisma.location.update({
      where: { id: locationId },
      data: {
        name,
        address,
      },
    });
    return NextResponse.json(updatedLocation, { status: 200 });
  } catch (error: any) {
    console.error("Error updating location:", error);
    return NextResponse.json({ message: "Failed to update location", error: error.message }, { status: 500 });
  }
}

// Menghapus lokasi
export async function DELETE(request: Request, { params }: { params: { locationId: string } }) {
  const { locationId } = params;
  try {
    await prisma.location.delete({
      where: { id: locationId },
    });
    return NextResponse.json({ message: "Location deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting location:", error);
    return NextResponse.json({ message: "Failed to delete location", error: error.message }, { status: 500 });
  }
}
