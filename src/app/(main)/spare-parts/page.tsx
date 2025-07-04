// src/app/(main)/spare-parts/page.tsx
"use client";

import TableMain from "@/components/common/table/TableMain";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  fetchSpareParts,
  createSparePart,
  updateSparePart,
  deleteSparePart,
} from "@/store/slices/sparePartSlice";
import { fetchUnits } from "@/store/slices/unitSlice"; // <-- PERUBAHAN 1: Import fetchUnits

import { SparePart, SparePartFormValues, PartVariant } from "@/types/sparepart";

import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import SparePartDialog from "@/components/dialog/sparePartDialog/SparePartDialog";
import { useRouter } from "next/navigation";

export default function SparePartListPage() {
  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const allSpareParts = useAppSelector((state) => state.spareParts.spareParts);
  const sparePartStatus = useAppSelector((state) => state.spareParts.status);
  const sparePartError = useAppSelector((state) => state.spareParts.error);

  const unitStatus = useAppSelector((state) => state.units.status); // <-- PERUBAHAN 2: Ambil status unit dari Redux store

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isSparePartDialogOpen, setIsSparePartDialogOpen] =
    useState<boolean>(false);
  const [editSparePartData, setEditSparePartData] = useState<
    SparePartFormValues | undefined
  >(undefined);

  const handleDetailSparePart = useCallback(
    (sparepart: SparePart) => {
      router.push(`/spare-parts/${sparepart.id}`);
    },
    [router]
  );
  useEffect(() => {
    if (sparePartStatus === "idle") {
      dispatch(fetchSpareParts());
    }
    if (unitStatus === "idle") {
      // <-- PERUBAHAN 3: Dispatch fetchUnits saat komponen dimuat
      dispatch(fetchUnits());
    }
  }, [dispatch, sparePartStatus, unitStatus]);

  const handleEditSparePart = useCallback((sparePart: SparePart) => {
    setEditSparePartData(sparePart);
    setIsSparePartDialogOpen(true);
  }, []);

  const handleSaveSparePart = useCallback(
    async (values: SparePartFormValues) => {
      if (values.id) {
        const existingSparePart = allSpareParts.find(
          (sp) => sp.id === values.id
        );
        if (existingSparePart) {
          const fullUpdatedSparePart: SparePart = {
            ...existingSparePart,
            ...values,
            updatedAt: new Date(),
          };
          await dispatch(updateSparePart(fullUpdatedSparePart));
        }
      } else {
        await dispatch(createSparePart(values));
      }
      setIsSparePartDialogOpen(false);
      setEditSparePartData(undefined);
    },
    [dispatch, allSpareParts]
  );

  const handleDeleteSparePart = useCallback(
    async (sparePartId: string) => {
      if (
        window.confirm("Apakah Anda yakin ingin menghapus suku cadang ini?")
      ) {
        await dispatch(deleteSparePart(sparePartId));
      }
    },
    [dispatch]
  );

  const sparePartColumns: ColumnDef<SparePart>[] = useMemo(
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
            aria-label="Select all"
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
      { accessorKey: "name", header: "Nama Suku Cadang" },
      { accessorKey: "partNumber", header: "Nomor Part" },
      { accessorKey: "unit", header: "Satuan" }, // <-- PERUBAHAN 4: Menambahkan kolom "Satuan"
      { accessorKey: "price", header: "Harga Satuan" },
      { accessorKey: "brand", header: "Merek" },
      { accessorKey: "manufacturer", header: "Produsen" },
      { accessorKey: "variant", header: "Varian" },
      {
        accessorKey: "createdAt",
        header: "Dibuat Pada",
        cell: ({ row }) => {
          const date = row.original.createdAt;
          if (date instanceof Date) {
            return format(date, "dd-MM-yyyy HH:mm", { locale: id });
          }
          return "N/A";
        },
      },
      {
        accessorKey: "updatedAt",
        header: "Diperbarui Pada",
        cell: ({ row }) => {
          const date = row.original.updatedAt;
          if (date instanceof Date) {
            return format(date, "dd-MM-yyyy HH:mm", { locale: id });
          }
          return "N/A";
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const sparePart = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open Menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => handleDetailSparePart(sparePart)}
                >
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleEditSparePart(sparePart)}
                >
                  Edit Suku Cadang
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteSparePart(sparePart.id)}
                  className="text-red-600"
                >
                  Hapus Suku Cadang
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleEditSparePart, handleDeleteSparePart, handleDetailSparePart]
  );

  const filteredSpareParts = useMemo(() => {
    let currentSpareParts = allSpareParts;

    if (activeTab !== "all") {
      currentSpareParts = currentSpareParts.filter(
        (sp) => sp.variant.toLowerCase() === activeTab
      );
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentSpareParts = currentSpareParts.filter((sparePart) =>
        Object.values(sparePart).some(
          (value) =>
            (typeof value === "string" &&
              value.toLowerCase().includes(lowerCaseQuery)) ||
            (value instanceof Date &&
              format(value, "dd-MM-yyyy").includes(lowerCaseQuery)) ||
            (typeof value === "number" &&
              value.toString().includes(lowerCaseQuery))
        )
      );
    }
    return currentSpareParts;
  }, [allSpareParts, activeTab, searchQuery]);

  const sparePartTabItems = useMemo(() => {
    const allCount = allSpareParts.length;
    const tabItems = [
      { value: "all", label: "Semua Suku Cadang", count: allCount },
    ];

    Object.values(PartVariant).forEach((variant) => {
      tabItems.push({
        value: variant.toLowerCase(),
        label: variant,
        count: allSpareParts.filter((sp) => sp.variant === variant).length,
      });
    });

    return tabItems;
  }, [allSpareParts]);

  if (sparePartStatus === "loading" || unitStatus === "loading") {
    return (
      <div className="text-center py-8">
        Memuat data suku cadang dan satuan...
      </div>
    );
  }

  if (sparePartStatus === "failed") {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {sparePartError}
      </div>
    );
  }
  if (unitStatus === "failed") {
    return (
      <div className="text-center py-8 text-red-500">
        Error: Gagal memuat satuan.
      </div>
    );
  }

  return (
    <TableMain<SparePart>
      searchQuery={searchQuery}
      data={filteredSpareParts}
      columns={sparePartColumns}
      tabItems={sparePartTabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showAddButton={true}
      showDownloadPrintButtons={true}
      emptyMessage="Tidak ada suku cadang ditemukan."
      isDialogOpen={isSparePartDialogOpen}
      onOpenChange={setIsSparePartDialogOpen}
      dialogContent={
        <SparePartDialog
          onClose={() => {
            setIsSparePartDialogOpen(false);
            setEditSparePartData(undefined);
          }}
          onSubmitSparePart={handleSaveSparePart}
          initialData={editSparePartData}
        />
      }
      dialogTitle={
        editSparePartData ? "Edit Suku Cadang" : "Tambahkan Suku Cadang Baru"
      }
      dialogDescription={
        editSparePartData
          ? "Ubah detail suku cadang ini."
          : "Isi detail suku cadang untuk menambah data suku cadang baru ke sistem."
      }
    />
  );
}
