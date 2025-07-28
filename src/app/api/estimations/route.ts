import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua estimasi
export async function GET() {
  try {
    const estimations = await prisma.estimation.findMany({
      include: {
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
        mechanic: {
          select: {
            id: true,
            name: true,
            position: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(estimations, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching estimations:", error);
    return NextResponse.json(
      { message: "Failed to fetch estimations", error: error.message },
      { status: 500 }
    );
  }
}

// Membuat estimasi baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      estimationNumber,
      estimationDate,
      requestOdo,
      actualOdo,
      remark,
      notes,
      finishedDate,
      totalEstimatedAmount,
      status,
      workOrderId,
      vehicleId,
      mechanicId,
      accountantId,
      approvedById,
    } = body;

    const newEstimation = await prisma.estimation.create({
      data: {
        estimationNumber,
        estimationDate: new Date(estimationDate),
        requestOdo: parseInt(requestOdo),
        actualOdo: parseInt(actualOdo),
        remark,
        notes,
        finishedDate: finishedDate ? new Date(finishedDate) : null,
        totalEstimatedAmount: parseFloat(totalEstimatedAmount),
        status,
        workOrder: { connect: { id: workOrderId } },
        vehicle: { connect: { id: vehicleId } },
        ...(mechanicId && { mechanic: { connect: { id: mechanicId } } }),
        ...(accountantId && { accountant: { connect: { id: accountantId } } }),
        ...(approvedById && { approvedBy: { connect: { id: approvedById } } }),
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
        mechanic: {
          select: {
            id: true,
            name: true,
            position: true,
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
    return NextResponse.json(newEstimation, { status: 201 });
  } catch (error: any) {
    console.error("Error creating estimation:", error);
    return NextResponse.json(
      { message: "Failed to create estimation", error: error.message },
      { status: 500 }
    );
  }
}
