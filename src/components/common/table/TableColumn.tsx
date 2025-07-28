import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { WoPriorityType, WorkOrder } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { MdMoreVert } from "react-icons/md";

export const tableColumns: ColumnDef<WorkOrder>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div>
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!value)}
          aria-label="Select All"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="pl-4">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!value)}
          aria-label="Select Row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  { accessorKey: "licensePlate", header: "License Plate" },
  { accessorKey: "woNumber", header: "WO Number" },
  {
    accessorKey: "date",
    header: "Wo Date",
    cell: ({ row }) => {
      const woDate = row.original.date;
      const formattedDate = woDate
        ? format(new Date(woDate), "dd/MM/yyyy")
        : "N/A";
      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "progresStatus",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-xl bg-arkBlue-100 font-normal select-none overflow-hidden text-ellipsis whitespace-nowrap max-w-11 block">
          {row.original.progresStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priorityType",
    header: "Priority Type",
    cell: ({ row }) => {
      // priorityType akan berisi string seperti "Normal", "Urgent", "Emergency"
      const priorityType: WoPriorityType = row.original.priorityType;
      let priorityColor = "";

      // Membandingkan nilai string dari priorityType dengan nilai string dari enum
      if (priorityType === WoPriorityType.NORMAL) {
        priorityColor = "bg-blue-500 text-white"; // Contoh warna untuk Normal
      } else if (priorityType === WoPriorityType.URGENT) {
        priorityColor = "bg-orange-500 text-white"; // Contoh warna untuk Urgent
      } else if (priorityType === WoPriorityType.EMERGENCY) {
        priorityColor = "bg-arkRed-500 text-arkBg-100"; // Contoh warna untuk Emergency
      } else {
        // Kasus default jika tidak ada yang cocok (misalnya data tidak valid)
        priorityColor = "bg-gray-400 text-gray-800";
      }

      return (
        // Tambahkan teks di dalam Badge agar terlihat
        <Badge className={`${priorityColor} font-semibold`}>
          {priorityType}
        </Badge>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      return (
        <Button>
          <MdMoreVert />
        </Button>
      );
    },
  },
];
