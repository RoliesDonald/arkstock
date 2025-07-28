import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail item invoice berdasarkan ID
export async function GET(request: Request, { params }: { params: { invoiceItemId: string } }) {
  const { invoiceItemId } = params;
  try {
    const invoiceItem = await prisma.invoiceItem.findUnique({
      where: { id: invoiceItemId },
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
    });

    if (!invoiceItem) {
      return NextResponse.json({ message: "Invoice Item not found" }, { status: 404 });
    }
    return NextResponse.json(invoiceItem, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching invoice item:", error);
    return NextResponse.json(
      { message: "Failed to fetch invoice item", error: error.message },
      { status: 500 }
    );
  }
}

// Memperbarui item invoice
export async function PUT(request: Request, { params }: { params: { invoiceItemId: string } }) {
  const { invoiceItemId } = params;
  try {
    const body = await request.json();
    const { invoiceId, sparePartId, quantity, unitPrice, totalPrice } = body;

    const updatedInvoiceItem = await prisma.invoiceItem.update({
      where: { id: invoiceItemId },
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
    return NextResponse.json(updatedInvoiceItem, { status: 200 });
  } catch (error: any) {
    console.error("Error updating invoice item:", error);
    return NextResponse.json(
      { message: "Failed to update invoice item", error: error.message },
      { status: 500 }
    );
  }
}

// Menghapus item invoice
export async function DELETE(request: Request, { params }: { params: { invoiceItemId: string } }) {
  const { invoiceItemId } = params;
  try {
    await prisma.invoiceItem.delete({
      where: { id: invoiceItemId },
    });
    return NextResponse.json({ message: "Invoice Item deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting invoice item:", error);
    return NextResponse.json(
      { message: "Failed to delete invoice item", error: error.message },
      { status: 500 }
    );
  }
}
