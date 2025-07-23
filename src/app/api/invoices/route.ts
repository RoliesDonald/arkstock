import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fungsi untuk mengambil semua Invoice
export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        workOrder: {
          // Sertakan WorkOrder
          select: {
            id: true,
            workOrderNumber: true,
          },
        },
        vehicle: {
          // Sertakan Vehicle
          select: {
            id: true,
            licensePlate: true,
            vehicleMake: true,
            model: true,
          },
        },
        accountant: {
          // Sertakan Accountant (Employee)
          select: {
            id: true,
            name: true,
            position: true, // Pastikan 'position' disertakan
          },
        },
        approvedBy: {
          // Sertakan ApprovedBy (Employee)
          select: {
            id: true,
            name: true,
            position: true, // Pastikan 'position' disertakan
          },
        },
        // Anda bisa menyertakan invoiceItems dan invoiceServices di sini jika ingin
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(invoices, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ message: "Failed to fetch invoices", error: error.message }, { status: 500 });
  }
}

// Fungsi untuk membuat Invoice baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Pastikan field yang diterima sesuai dengan skema Prisma dan Zod
    const {
      invoiceNumber,
      invoiceDate,
      requestOdo,
      actualOdo,
      remark,
      finishedDate,
      totalAmount,
      status,
      workOrderId,
      vehicleId,
      accountantId,
      approvedById,
    } = body;

    const newInvoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        invoiceDate: new Date(invoiceDate), // Konversi ke Date object
        requestOdo,
        actualOdo,
        remark,
        finishedDate: new Date(finishedDate), // Konversi ke Date object
        totalAmount: parseFloat(totalAmount), // Pastikan ini float/decimal
        status,
        workOrder: { connect: { id: workOrderId } }, // Hubungkan ke WorkOrder
        vehicle: { connect: { id: vehicleId } }, // Hubungkan ke Vehicle
        ...(accountantId && { accountant: { connect: { id: accountantId } } }), // Opsional
        ...(approvedById && { approvedBy: { connect: { id: approvedById } } }), // Opsional
      },
      include: {
        // Sertakan relasi yang sama seperti GET untuk konsistensi respons
        workOrder: {
          select: {
            id: true,
            workOrderNumber: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            licensePlate: true,
            vehicleMake: true,
            model: true,
          },
        },
        accountant: {
          select: {
            id: true,
            name: true,
            position: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            position: true,
          },
        },
      },
    });
    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error: any) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ message: "Failed to create invoice", error: error.message }, { status: 500 });
  }
}
