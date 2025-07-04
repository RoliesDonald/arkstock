"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createUnit,
  deleteUnit,
  fetchUnits,
  updateUnit,
} from "@/store/slices/unitSlice";
import { Unit, UnitFormValues } from "@/types/unit";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import TableMain from "@/components/common/table/TableMain";
import UnitDialog from "@/components/dialog/unitDialog/UnitDialog";

export default function UnitListPage() {
  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const dispatch = useAppDispatch();

  const allUnits = useAppSelector((state) => state.units.units);
  const unitStatus = useAppSelector((state) => state.units.status);
  const unitError = useAppSelector((state) => state.units.error);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isUnitDialogOpen, setIsUnitDialogOpen] = useState<boolean>(false);
  const [editUnitData, setEditUnitData] = useState<Unit | undefined>(undefined);

  useEffect(() => {
    if (unitStatus === "idle") {
      dispatch(fetchUnits());
    }
  }, [dispatch, unitStatus]);
  const handleEditUnit = useCallback((unit: Unit) => {
    setEditUnitData(unit);
    setIsUnitDialogOpen(true);
  }, []);

  const handleSaveUnit = useCallback(
    async (values: UnitFormValues) => {
      if (values.id) {
        const existingUnit = allUnits.find((u) => u.id === values.id);
        if (existingUnit) {
          const fullUpdateUnit: Unit = {
            ...existingUnit,
            ...values,
            updatedAt: new Date(),
          };
          await dispatch(updateUnit(fullUpdateUnit));
        }
      } else {
        await dispatch(createUnit(values));
      }
      setIsUnitDialogOpen(false);
      setEditUnitData(undefined);
    },
    [dispatch, allUnits]
  );

  const handleDeleteUnit = useCallback(
    async (unitId: string) => {
      if (window.confirm("Apakah Anda yakin ingin menghapus satuan ini?")) {
        await dispatch(deleteUnit(unitId));
      }
    },
    [dispatch]
  );

  const unitColumns: ColumnDef<Unit>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(values) =>
              table.toggleAllPageRowsSelected(!!values)
            }
            aria-label="Select all units"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(values) => row.toggleSelected(!!values)}
            aria-label="Select unit"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      { accessorKey: "name", header: "Nama Satuan" },
      { accessorKey: "description", header: "Deskripsi" },
      {
        accessorKey: "createAt",
        header: "Dibuat pada",
        cell: ({ row }) => {
          const date = row.original.createdAt;
          if (date instanceof Date) {
            return format(date, "dd-MM-yyyy HH:mm", { locale: localeId });
          }
          return "N/A";
        },
      },
      {
        accessorKey: "updatedAt",
        header: "Dibuat pada",
        cell: ({ row }) => {
          const date = row.original.updatedAt;
          if (date instanceof Date) {
            return format(date, "dd-MM-yyyy HH:mm", { locale: localeId });
          }
          return "N/A";
        },
      },
      {
        id: "action",
        header: "Aksi",
        cell: ({ row }) => {
          const unit = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className="h-8 w-8 p-0">
                  <span className="sr-only">Open Menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Action</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleEditUnit(unit)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteUnit(unit.id)}>
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDeleteUnit, handleEditUnit]
  );
  const filteredUnits = useMemo(() => {
    let currentUnits = allUnits;
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentUnits = currentUnits.filter((unit) =>
        Object.values(unit).some(
          (value) =>
            (typeof value === "string" &&
              value.toLowerCase().includes(lowerCaseQuery)) ||
            (value instanceof Date &&
              format(value, "dd-MM-yyyy HH:mm").includes(lowerCaseQuery))
        )
      );
    }
    return currentUnits;
  }, [searchQuery, allUnits]);
  const unitTabItems = useMemo(() => {
    const allCount = allUnits.length;
    return [{ value: "all", label: "semua", count: allCount }];
  }, [allUnits]);
  if (unitStatus === "loading") {
    return <div className="text-center p-8">Memuat data...</div>;
  }
  if (unitStatus === "failed") {
    return (
      <div className="text-center p-8 text-red-500">Error: {unitError}</div>
    );
  }
  return (
    <TableMain
      searchQuery={searchQuery}
      data={filteredUnits}
      columns={unitColumns}
      tabItems={unitTabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showAddButton={true}
      showDownloadPrintButtons={true}
      emptyMessage="Tidak ada satuan ditemukan."
      isDialogOpen={isUnitDialogOpen}
      onOpenChange={setIsUnitDialogOpen}
      dialogContent={
        <UnitDialog
          onClose={() => {
            setIsUnitDialogOpen(false);
            setEditUnitData(undefined);
          }}
          onSubmitUnit={handleSaveUnit}
          initialData={editUnitData}
        />
      }
      dialogTitle={editUnitData ? "Edit Satuan" : "Tambahkan Satuan Baru"}
      dialogDescription={
        editUnitData
          ? "Ubah detail satuan ini."
          : "Isi detail satuan untuk menambah data satuan baru ke sistem."
      }
    />
  );
}
