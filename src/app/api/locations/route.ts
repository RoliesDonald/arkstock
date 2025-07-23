import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua lokasi
export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(locations, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching locations:", error);
    return NextResponse.json({ message: "Failed to fetch locations", error: error.message }, { status: 500 });
  }
}

// Membuat lokasi baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, address } = body;

    const newLocation = await prisma.location.create({
      data: {
        name,
        address,
      },
    });
    return NextResponse.json(newLocation, { status: 201 });
  } catch (error: any) {
    console.error("Error creating location:", error);
    return NextResponse.json({ message: "Failed to create location", error: error.message }, { status: 500 });
  }
}
