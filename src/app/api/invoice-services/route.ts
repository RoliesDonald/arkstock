import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua jasa invoice
export async function GET() {
  try {
    const invoiceServices = await prisma.invoiceService.findMany({
      include: {
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(invoiceServices, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching invoice services:", error);
    return NextResponse.json(
      { message: "Failed to fetch invoice services", error: error.message },
      { status: 500 }
    );
  }
}

// Membuat jasa invoice baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invoiceId, serviceId, quantity, unitPrice, totalPrice } = body;

    const newInvoiceService = await prisma.invoiceService.create({
      data: {
        invoice: { connect: { id: invoiceId } },
        service: { connect: { id: serviceId } },
        quantity: parseInt(quantity),
        unitPrice: parseFloat(unitPrice),
        totalPrice: parseFloat(totalPrice),
      },
      include: {
        // Sertakan relasi yang sama seperti GET untuk konsistensi respons
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });
    return NextResponse.json(newInvoiceService, { status: 201 });
  } catch (error: any) {
    console.error("Error creating invoice service:", error);
    return NextResponse.json(
      { message: "Failed to create invoice service", error: error.message },
      { status: 500 }
    );
  }
}
