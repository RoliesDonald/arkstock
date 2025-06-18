// src/app/(main)/spare-parts/page.tsx
"use client";

import TableMain from "@/components/common/table/TableMain";
import { useAppSelector } from "@/store/hooks";
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Import tipe SparePart dan data dummy
import { SparePart, SparePartFormValues, PartVariant } from "@/types/sparepart"; // Pastikan SparePartFormValues
import { sparePartData as initialSparePartData } from "@/data/sampleSparePartData";

// Import komponen dialog suku cadang
import SparePartDialog from "@/components/dialog/sparePartDialog/SparePartDialog";
import { v4 as uuidv4 } from "uuid";

export default function SparePartsPage() {
  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const [allSpareParts, setAllSpareParts] =
    useState<SparePart[]>(initialSparePartData);
  const [activeTab, setActiveTab] = useState<string>("all"); // Default tab 'all'

  // State untuk dialog penambahan/edit suku cadang
  const [isSparePartDialogOpen, setIsSparePartDialogOpen] = useState(false);
  const [sparePartToEdit, setSparePartToEdit] = useState<
    SparePartFormValues | undefined
  >(undefined);
  // State untuk menyimpan ID suku cadang yang sedang diedit
  const [editingId, setEditingId] = useState<string | undefined>(undefined);

  // Definisi kolom untuk Suku Cadang
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
      { accessorKey: "sku", header: "SKU" },
      { accessorKey: "name", header: "Nama Suku Cadang" },
      { accessorKey: "partNumber", header: "Nomor Part" },
      { accessorKey: "brand", header: "Merek (Brand)" },
      { accessorKey: "manufacturer", header: "Produsen" },
      { accessorKey: "unit", header: "Satuan" },
      { accessorKey: "stock", header: "Stok Saat Ini" },
      { accessorKey: "minStock", header: "Stok Min." },
      {
        accessorKey: "price",
        header: "Harga",
        cell: ({ row }) => `Rp${row.original.price.toLocaleString("id-ID")}`,
      },
      {
        accessorKey: "variant",
        header: "Varian",
        cell: ({ row }) => row.original.variant.replace(/_/g, " "),
      },
      {
        accessorKey: "compatibility",
        header: "Kompatibilitas",
        cell: ({ row }) => {
          const compatibilityList = row.original.compatibility;
          if (compatibilityList && compatibilityList.length > 0) {
            const firstThree = compatibilityList
              .slice(0, 3)
              .map((comp) => {
                let compatibilityString = `${comp.vehicleMake} ${comp.model}`;
                if (comp.trimLevel)
                  compatibilityString += ` (${comp.trimLevel})`;
                if (comp.modelYear) compatibilityString += ` ${comp.modelYear}`;
                return compatibilityString;
              })
              .join(", ");
            return (
              <span
                title={compatibilityList
                  .map((comp) => {
                    let compatibilityString = `${comp.vehicleMake} ${comp.model}`;
                    if (comp.trimLevel)
                      compatibilityString += ` (${comp.trimLevel})`;
                    if (comp.modelYear)
                      compatibilityString += ` ${comp.modelYear}`;
                    return compatibilityString;
                  })
                  .join(", ")}
              >
                {firstThree}
                {compatibilityList.length > 3
                  ? ` dan ${compatibilityList.length - 3} lainnya...`
                  : ""}
              </span>
            );
          }
          return "-";
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const sparePart = row.original;

          const handleEditClick = () => {
            setEditingId(sparePart.id); // Set ID yang sedang diedit
            setSparePartToEdit({
              sku: sparePart.sku,
              name: sparePart.name,
              partNumber: sparePart.partNumber,
              description: sparePart.description || "",
              unit: sparePart.unit,
              initialStock: sparePart.stock, // Stock dari SparePart menjadi initialStock untuk form
              minStock: sparePart.minStock ?? 0, // Pastikan 0 jika null
              price: sparePart.price,
              variant: sparePart.variant,
              brand: sparePart.brand,
              manufacturer: sparePart.manufacturer,
              compatibility: sparePart.compatibility.map((comp) => ({
                vehicleMake: comp.vehicleMake,
                model: comp.model,
                trimLevel: comp.trimLevel ?? null,
                modelYear: comp.modelYear ?? null,
              })),
            });
            setIsSparePartDialogOpen(true);
          };

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
                  onClick={() => alert(`Lihat detail ${sparePart.name}`)}
                >
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEditClick}>
                  Edit Suku Cadang
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => alert(`Hapus ${sparePart.name}`)}
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
    []
  );

  const filteredSpareParts = useMemo(() => {
    let currentSpareParts = allSpareParts;

    if (activeTab !== "all") {
      if (
        Object.values(PartVariant).some((v) => v.toLowerCase() === activeTab)
      ) {
        return currentSpareParts.filter(
          (part) => part.variant.toLowerCase() === activeTab
        );
      }
      if (activeTab === "low_stock") {
        return currentSpareParts.filter(
          (part) => part.stock <= (part.minStock || 0)
        );
      }
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentSpareParts = currentSpareParts.filter(
        (part) =>
          Object.values(part).some(
            (value) =>
              (typeof value === "string" &&
                value.toLowerCase().includes(lowerCaseQuery)) ||
              (typeof value === "number" &&
                value.toString().includes(lowerCaseQuery)) ||
              (Array.isArray(value) &&
                value.some(
                  (comp) =>
                    typeof comp === "object" &&
                    "vehicleMake" in comp &&
                    "model" in comp &&
                    `${comp.vehicleMake} ${comp.model} ${
                      comp.trimLevel || ""
                    } ${comp.modelYear || ""}`
                      .toLowerCase()
                      .includes(lowerCaseQuery)
                ))
          ) ||
          part.sku?.toLowerCase().includes(lowerCaseQuery) ||
          part.partNumber.toLowerCase().includes(lowerCaseQuery) ||
          part.brand.toLowerCase().includes(lowerCaseQuery) ||
          part.manufacturer.toLowerCase().includes(lowerCaseQuery)
      );
    }
    return currentSpareParts;
  }, [allSpareParts, activeTab, searchQuery]);

  const sparePartTabItems = useMemo(() => {
    const allCount = allSpareParts.length;
    const tabItems = [{ value: "all", label: "All", count: allCount }];

    Object.values(PartVariant).forEach((variant) => {
      tabItems.push({
        value: variant.toLowerCase(),
        label: variant.replace(/_/g, " "),
        count: allSpareParts.filter((part) => part.variant === variant).length,
      });
    });

    tabItems.push({
      value: "low_stock",
      label: "Stok Rendah",
      count: allSpareParts.filter((part) => part.stock <= (part.minStock || 0))
        .length,
    });

    return tabItems;
  }, [allSpareParts]);

  const handleAddOrEditSparePartSubmit = (values: SparePartFormValues) => {
    // Gunakan editingId untuk menentukan mode edit/tambah
    if (editingId) {
      setAllSpareParts((prev) =>
        prev.map((part) =>
          part.id === editingId // <-- PERBAIKAN DI SINI: Gunakan editingId
            ? {
                ...part,
                ...values,
                sku: values.sku!,
                stock: values.initialStock,
                description: values.description ?? null,
                minStock: values.minStock ?? null,
                // PERBAIKAN: Pastikan compatibility selalu array
                compatibility: values.compatibility ?? [],
                updatedAt: new Date(),
              }
            : part
        )
      );
      alert("Suku Cadang berhasil diperbarui!");
    } else {
      const newSparePart: SparePart = {
        id: uuidv4(),
        ...values,
        sku: values.sku!,
        stock: values.initialStock,
        description: values.description ?? null,
        minStock: values.minStock ?? null,
        compatibility: values.compatibility ?? [], // <-- PERBAIKAN DI SINI: Default ke array kosong
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setAllSpareParts((prev) => [...prev, newSparePart]);
      alert("Suku Cadang berhasil ditambahkan!");
    }
    setIsSparePartDialogOpen(false);
    setSparePartToEdit(undefined);
    setEditingId(undefined); // Reset editingId setelah selesai
  };

  const handleDialogClose = () => {
    setIsSparePartDialogOpen(false);
    setSparePartToEdit(undefined);
    setEditingId(undefined); // Reset editingId saat dialog ditutup
  };

  const handleOpenAddDialog = () => {
    setSparePartToEdit(undefined);
    setEditingId(undefined); // Pastikan editingId undefined saat tambah baru
    setIsSparePartDialogOpen(true);
  };

  return (
    <>
      <TableMain<SparePart>
        searchQuery={searchQuery}
        data={filteredSpareParts}
        columns={sparePartColumns}
        tabItems={sparePartTabItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showAddButton={true}
        onAddButtonClick={handleOpenAddDialog}
        showDownloadPrintButtons={true}
        emptyMessage="Tidak ada suku cadang ditemukan."
        isDialogOpen={isSparePartDialogOpen}
        onOpenChange={setIsSparePartDialogOpen}
        dialogContent={
          <SparePartDialog
            onSubmitSparePart={handleAddOrEditSparePartSubmit}
            onClose={handleDialogClose}
            initialData={sparePartToEdit}
          />
        }
        dialogTitle={editingId ? "Edit Suku Cadang" : "Tambah Suku Cadang Baru"}
        dialogDescription={
          editingId
            ? "Perbarui detail suku cadang yang ada."
            : "Isi detail suku cadang baru untuk ditambahkan ke inventaris."
        }
      />
    </>
  );
}
