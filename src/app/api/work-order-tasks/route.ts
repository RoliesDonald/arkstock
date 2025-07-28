import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua tugas work order
export async function GET() {
  try {
    const workOrderTasks = await prisma.workOrderTask.findMany({
      include: {
        workOrder: {
          select: {
            id: true,
            workOrderNumber: true,
          },
        },
        assignedTo: {
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
    return NextResponse.json(workOrderTasks, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching work order tasks:", error);
    return NextResponse.json(
      { message: "Failed to fetch work order tasks", error: error.message },
      { status: 500 }
    );
  }
}

// Membuat tugas work order baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { workOrderId, taskName, description, status, assignedToId, startTime, endTime, notes } = body;

    const newWorkOrderTask = await prisma.workOrderTask.create({
      data: {
        workOrder: { connect: { id: workOrderId } },
        taskName,
        description,
        status,
        ...(assignedToId && { assignedTo: { connect: { id: assignedToId } } }),
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        notes,
      },
      include: {
        // Sertakan relasi yang sama seperti GET untuk konsistensi respons
        workOrder: {
          select: {
            id: true,
            workOrderNumber: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            position: true,
          },
        },
      },
    });
    return NextResponse.json(newWorkOrderTask, { status: 201 });
  } catch (error: any) {
    console.error("Error creating work order task:", error);
    return NextResponse.json(
      { message: "Failed to create work order task", error: error.message },
      { status: 500 }
    );
  }
}
