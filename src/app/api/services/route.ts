import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua jasa
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(services, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ message: "Failed to fetch services", error: error.message }, { status: 500 });
  }
}

// Membuat jasa baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, category, subCategory, tasks } = body;

    const newService = await prisma.service.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        subCategory,
        tasks, // Array of strings
      },
    });
    return NextResponse.json(newService, { status: 201 });
  } catch (error: any) {
    console.error("Error creating service:", error);
    return NextResponse.json({ message: "Failed to create service", error: error.message }, { status: 500 });
  }
}
