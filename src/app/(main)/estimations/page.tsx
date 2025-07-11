"use client";
import TableMain from "@/components/common/table/TableMain";
import WoDialog from "@/components/dialog/woDialog/_components/WoDialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { estimationData } from "@/data/sampleEstimationData";
import { formatWoNumber } from "@/lib/woFromatter";
import { useAppSelector } from "@/store/hooks";
import { Estimation, EstimationStatus } from "@/types/estimation";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";

export default function EstimationListPage() {
  const router = useRouter();
  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const [allEstimation, setAllEstimation] =
    useState<Estimation[]>(estimationData);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isEstimationDialogOpen, setEstimationDialogOpen] =
    useState<boolean>(false);
  const nextSequence = 5;
  const currentVendor = "BP";
  const today = new Date();
  const newWoNumber = formatWoNumber(nextSequence, currentVendor, today);
  const handleDetailEstimation = useCallback(
    (estimation: Estimation) => {
      router.push(`/estimations/${estimation.id}`);
    },
    [router]
  );
  const estimationColumns: ColumnDef<Estimation>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all rows"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      { accessorKey: "estNum", header: "Est. Number" },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
          const date = row.original.createdAt;
          if (date instanceof Date) {
            return new Intl.DateTimeFormat("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }).format(date);
          }
          return "N/A";
        },
      },
      { accessorKey: "requestOdo", header: "Request Odo" },
      { accessorKey: "actualOdo", header: "Actual Odo" },
      { accessorKey: "remark", header: "Remark" },
      { accessorKey: "woId", header: "WO ID" },
      {
        id: "action",
        enableHiding: false,
        cell: ({ row }) => {
          const estimationData = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open Menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => handleDetailEstimation(estimationData)}
                >
                  Detail Quotation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailEstimation]
  );
  const filteredEstimation = useMemo(() => {
    let currenntEstimation = allEstimation;
    if (activeTab !== "all") {
      currenntEstimation = currenntEstimation.filter((estim) => {
        if (activeTab === "Draft")
          return estim.estStatus === EstimationStatus.DRAFT;
        if (activeTab === "Pending")
          return estim.estStatus === EstimationStatus.PENDING;
        if (activeTab === "Approved")
          return estim.estStatus === EstimationStatus.APPROVED;
        if (activeTab === "Rejected")
          return estim.estStatus === EstimationStatus.SENT;
        if (activeTab === "Sent")
          return estim.estStatus === EstimationStatus.CANCELLED;
        return true;
      });
    }
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currenntEstimation = currenntEstimation.filter((estim) =>
        Object.values(estim).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(lowerCaseQuery)
        )
      );
    }
    return currenntEstimation;
  }, [allEstimation, activeTab, searchQuery]);
  const estimationTabItems = useMemo(() => {
    return [
      { value: "all", label: "All", count: allEstimation.length },
      {
        value: "Draft",
        label: "Draft",
        count: allEstimation.filter(
          (estim) => estim.estStatus === EstimationStatus.DRAFT
        ).length,
      },
      {
        value: "Pending",
        label: "Pending",
        count: allEstimation.filter(
          (estim) => estim.estStatus === EstimationStatus.PENDING
        ).length,
      },
      {
        value: "Sent",
        label: "Sent",
        count: allEstimation.filter(
          (estim) => estim.estStatus === EstimationStatus.SENT
        ).length,
      },
      {
        value: "Cancelled",
        label: "Cancelled",
        count: allEstimation.filter(
          (estim) => estim.estStatus === EstimationStatus.CANCELLED
        ).length,
      },
    ];
  }, [allEstimation]);

  const handleDialogClose = () => {
    setEstimationDialogOpen(false);
  };

  return (
    <TableMain<Estimation>
      searchQuery={searchQuery}
      data={filteredEstimation}
      columns={estimationColumns}
      tabItems={estimationTabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showAddButton={true}
      showDownloadPrintButtons={true}
      emptyMessage="No estimations found."
      isDialogOpen={isEstimationDialogOpen}
      onOpenChange={setEstimationDialogOpen}
      dialogContent={"dadada"} // Placeholder for dialog content
      dialogTitle="Create New Estimation"
      dialogDescription="Fill in the details to create a new estimation."
    />
  );
}
