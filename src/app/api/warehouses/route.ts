import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua gudang
export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(warehouses, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching warehouses:", error);
    return NextResponse.json(
      { message: "Failed to fetch warehouses", error: error.message },
      { status: 500 }
    );
  }
}

// Membuat gudang baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, location, warehouseType } = body;

    const newWarehouse = await prisma.warehouse.create({
      data: {
        name,
        location,
        warehouseType,
      },
    });
    return NextResponse.json(newWarehouse, { status: 201 });
  } catch (error: any) {
    console.error("Error creating warehouse:", error);
    return NextResponse.json(
      { message: "Failed to create warehouse", error: error.message },
      { status: 500 }
    );
  }
}
