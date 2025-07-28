import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua item invoice
export async function GET() {
  try {
    const invoiceItems = await prisma.invoiceItem.findMany({
      include: {
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
          },
        },
        sparePart: {
          select: {
            id: true,
            partNumber: true,
            partName: true,
            unit: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(invoiceItems, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching invoice items:", error);
    return NextResponse.json(
      { message: "Failed to fetch invoice items", error: error.message },
      { status: 500 }
    );
  }
}

// Membuat item invoice baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invoiceId, sparePartId, quantity, unitPrice, totalPrice } = body;

    const newInvoiceItem = await prisma.invoiceItem.create({
      data: {
        invoice: { connect: { id: invoiceId } },
        sparePart: { connect: { id: sparePartId } },
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
        sparePart: {
          select: {
            id: true,
            partNumber: true,
            partName: true,
            unit: true,
          },
        },
      },
    });
    return NextResponse.json(newInvoiceItem, { status: 201 });
  } catch (error: any) {
    console.error("Error creating invoice item:", error);
    return NextResponse.json(
      { message: "Failed to create invoice item", error: error.message },
      { status: 500 }
    );
  }
}
