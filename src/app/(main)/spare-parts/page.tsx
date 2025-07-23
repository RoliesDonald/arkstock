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
import { SparePart, RawSparePartApiResponse } from "@/types/sparepart"; // Import dari types/spareParts
import { SparePartFormValues } from "@/schemas/sparePart"; // Import dari schemas/sparePart
import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog } from "@/components/ui/dialog"; 
import { useToast } from "@/hooks/use-toast";
import { fetchSpareParts, formatSparePartDates } from "@/store/slices/sparePartSlice"; 
import { PartVariant, SparePartCategory, SparePartStatus } from "@prisma/client"; 
import { api } from "@/lib/utils/api"; 
import SparePartDialogWrapper from "@/components/dialog/sparePartDialog/SparePartDialogWrapper";

export default function SparePartListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allSpareParts = useAppSelector((state) => state.spareParts.spareParts);
  const loading = useAppSelector((state) => state.spareParts.status === 'loading');
  const error = useAppSelector((state) => state.spareParts.error);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isSparePartDialogOpen, setIsSparePartDialogOpen] = useState<boolean>(false);
  const [editSparePartData, setEditSparePartData] = useState<SparePart | undefined>(undefined);
  const [sparePartToDelete, setSparePartToDelete] = useState<SparePart | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchSpareParts());
  }, [dispatch]);

  const handleDetailSparePart = useCallback(
    (sparePart: SparePart) => {
      router.push(`/spare-parts/${sparePart.id}`);
    },
    [router]
  );

  const handleEditSparePart = useCallback((sparePart: SparePart) => {
    setEditSparePartData(sparePart);
    setIsSparePartDialogOpen(true);
  }, []);

  const handleSubmitSparePart = useCallback(
    async (values: SparePartFormValues) => {
      console.log("Submit Spare Part:", values);
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Error",
          description: "Tidak ada token otentikasi. Silakan login kembali.",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }

      try {
        const url = `http://localhost:3000/api/spare-parts${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<SparePart | RawSparePartApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<SparePart | RawSparePartApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Spare Part berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsSparePartDialogOpen(false);
        setEditSparePartData(undefined);
        dispatch(fetchSpareParts()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan spare part.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteSparePart = useCallback(
    async (sparePartId: string) => {
      console.log("Delete Spare Part ID:", sparePartId);
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Error",
          description: "Tidak ada token otentikasi. Silakan login kembali.",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }

      try {
        await api.delete(`http://localhost:3000/api/spare-parts/${sparePartId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Spare Part berhasil dihapus.",
        });
        setSparePartToDelete(undefined);
        dispatch(fetchSpareParts()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus spare part.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const sparePartColumns: ColumnDef<SparePart>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() ? true : (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
      { accessorKey: "partNumber", header: "Nomor Part" },
      { accessorKey: "partName", header: "Nama Part" },
      { accessorKey: "category", header: "Kategori" },
      { accessorKey: "unit", header: "Unit" },
      { accessorKey: "stock", header: "Stok Saat Ini" },
      { accessorKey: "price", header: "Harga Satuan" },
      {
        accessorKey: "variant",
        header: "Varian",
        cell: ({ row }) => {
          const variant = row.original.variant;
          let variantColor: string;
          switch (variant) {
            case PartVariant.OEM:
              variantColor = "bg-blue-200 text-blue-800";
              break;
            case PartVariant.AFTERMARKET:
              variantColor = "bg-green-200 text-green-800";
              break;
            case PartVariant.RECONDITIONED:
              variantColor = "bg-yellow-200 text-yellow-800";
              break;
            case PartVariant.USED:
              variantColor = "bg-red-200 text-red-800";
              break;
            case PartVariant.GBOX:
              variantColor = "bg-purple-200 text-purple-800";
              break;
            default:
              variantColor = "bg-gray-400 text-gray-800";
          }
          return (
            <span className={`${variantColor} px-2 py-1 rounded-full text-xs font-semibold`}>{variant}</span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          let statusColor: string;
          switch (status) {
            case SparePartStatus.AVAILABLE:
              statusColor = "bg-green-500 text-white";
              break;
            case SparePartStatus.LOW_STOCK:
              statusColor = "bg-yellow-500 text-black";
              break;
            case SparePartStatus.OUT_OF_STOCK:
              statusColor = "bg-red-500 text-white";
              break;
            case SparePartStatus.DISCONTINUED:
              statusColor = "bg-gray-700 text-white";
              break;
            default:
              statusColor = "bg-gray-400 text-gray-800";
          }
          return (
            <span className={`${statusColor} px-2 py-1 rounded-full text-xs font-semibold`}>{status.replace(/_/g, " ")}</span>
          );
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
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleDetailSparePart(sparePart)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditSparePart(sparePart)}>
                  Edit Spare Part
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSparePartToDelete(sparePart)} className="text-red-600">
                  Hapus Spare Part
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailSparePart, handleEditSparePart]
  );

  const sparePartTabItems = useMemo(() => {
    return [
      { value: "all", label: "All", count: allSpareParts.length },
      // Tabs for SparePartCategory
      {
        value: SparePartCategory.ENGINE.toLowerCase(),
        label: "Mesin",
        count: allSpareParts.filter((part) => part.category === SparePartCategory.ENGINE).length,
      },
      {
        value: SparePartCategory.BRAKE.toLowerCase(),
        label: "Rem",
        count: allSpareParts.filter((part) => part.category === SparePartCategory.BRAKE).length,
      },
      {
        value: SparePartCategory.SUSPENSION.toLowerCase(),
        label: "Suspensi",
        count: allSpareParts.filter((part) => part.category === SparePartCategory.SUSPENSION).length,
      },
      {
        value: SparePartCategory.ELECTRICAL.toLowerCase(),
        label: "Elektrikal",
        count: allSpareParts.filter((part) => part.category === SparePartCategory.ELECTRICAL).length,
      },
      {
        value: SparePartCategory.BODY.toLowerCase(),
        label: "Body",
        count: allSpareParts.filter((part) => part.category === SparePartCategory.BODY).length,
      },
      {
        value: SparePartCategory.TIRE.toLowerCase(),
        label: "Ban",
        count: allSpareParts.filter((part) => part.category === SparePartCategory.TIRE).length,
      },
      {
        value: SparePartCategory.LIGHTING.toLowerCase(),
        label: "Pencahayaan",
        count: allSpareParts.filter((part) => part.category === SparePartCategory.LIGHTING).length,
      },
      {
        value: SparePartCategory.EXHAUST.toLowerCase(),
        label: "Knalpot",
        count: allSpareParts.filter((part) => part.category === SparePartCategory.EXHAUST).length,
      },
      {
        value: SparePartCategory.COOLING.toLowerCase(),
        label: "Pendingin",
        count: allSpareParts.filter((part) => part.category === SparePartCategory.COOLING).length,
      },
      {
        value: SparePartCategory.STEERING.toLowerCase(),
        label: "Kemudi",
        count: allSpareParts.filter((part) => part.category === SparePartCategory.STEERING).length,
      },
      {
        value: SparePartCategory.TRANSMISSION.toLowerCase(),
        label: "Transmisi",
        count: allSpareParts.filter((part) => part.category === SparePartCategory.TRANSMISSION).length,
      },
      {
        value: SparePartCategory.INTERIOR.toLowerCase(),
        label: "Interior",
        count: allSpareParts.filter((part) => part.category === SparePartCategory.INTERIOR).length,
      },
      {
        value: SparePartCategory.EXTERIOR.toLowerCase(),
        label: "Eksterior",
        count: allSpareParts.filter((part) => part.category === SparePartCategory.EXTERIOR).length,
      },
      {
        value: SparePartCategory.FILTERS.toLowerCase(),
        label: "Filter",
        count: allSpareParts.filter((part) => part.category === SparePartCategory.FILTERS).length,
      },
      {
        value: SparePartCategory.FLUIDS.toLowerCase(),
        label: "Cairan",
        count: allSpareParts.filter((part) => part.category === SparePartCategory.FLUIDS).length,
      },
      {
        value: SparePartCategory.TOOLS.toLowerCase(),
        label: "Peralatan",
        count: allSpareParts.filter((part) => part.category === SparePartCategory.TOOLS).length,
      },
      {
        value: SparePartCategory.ACCESSORIES.toLowerCase(),
        label: "Aksesoris",
        count: allSpareParts.filter((part) => part.category === SparePartCategory.ACCESSORIES).length,
      },
      {
        value: SparePartCategory.OTHER.toLowerCase(),
        label: "Lainnya",
        count: allSpareParts.filter((part) => part.category === SparePartCategory.OTHER).length,
      },
      // Tabs for SparePartStatus
      {
        value: SparePartStatus.AVAILABLE.toLowerCase(),
        label: "Tersedia",
        count: allSpareParts.filter((part) => part.status === SparePartStatus.AVAILABLE).length,
      },
      {
        value: SparePartStatus.LOW_STOCK.toLowerCase(),
        label: "Stok Rendah",
        count: allSpareParts.filter((part) => part.status === SparePartStatus.LOW_STOCK).length,
      },
      {
        value: SparePartStatus.OUT_OF_STOCK.toLowerCase(),
        label: "Stok Habis",
        count: allSpareParts.filter((part) => part.status === SparePartStatus.OUT_OF_STOCK).length,
      },
      {
        value: SparePartStatus.DISCONTINUED.toLowerCase(),
        label: "Discontinued",
        count: allSpareParts.filter((part) => part.status === SparePartStatus.DISCONTINUED).length,
      },
      // Tabs for PartVariant
      {
        value: PartVariant.OEM.toLowerCase(),
        label: "OEM",
        count: allSpareParts.filter((part) => part.variant === PartVariant.OEM).length,
      },
      {
        value: PartVariant.AFTERMARKET.toLowerCase(),
        label: "Aftermarket",
        count: allSpareParts.filter((part) => part.variant === PartVariant.AFTERMARKET).length,
      },
      {
        value: PartVariant.RECONDITIONED.toLowerCase(),
        label: "Rekondisi",
        count: allSpareParts.filter((part) => part.variant === PartVariant.RECONDITIONED).length,
      },
      {
        value: PartVariant.USED.toLowerCase(),
        label: "Bekas",
        count: allSpareParts.filter((part) => part.variant === PartVariant.USED).length,
      },
      {
        value: PartVariant.GBOX.toLowerCase(),
        label: "GBOX",
        count: allSpareParts.filter((part) => part.variant === PartVariant.GBOX).length,
      },
    ];
  }, [allSpareParts]);

  const filteredSpareParts = useMemo(() => {
    let data = allSpareParts;

    if (activeTab !== "all") {
      data = data.filter((sparePart) => {
        const lowerCaseActiveTab = activeTab.toLowerCase();
        // Cek berdasarkan SparePartCategory
        if (Object.values(SparePartCategory).some(c => c.toLowerCase() === lowerCaseActiveTab)) {
          return sparePart.category.toLowerCase() === lowerCaseActiveTab;
        }
        // Cek berdasarkan SparePartStatus
        if (Object.values(SparePartStatus).some(s => s.toLowerCase() === lowerCaseActiveTab)) {
          return sparePart.status.toLowerCase() === lowerCaseActiveTab;
        }
        // Cek berdasarkan PartVariant
        if (Object.values(PartVariant).some(v => v.toLowerCase() === lowerCaseActiveTab)) {
          return sparePart.variant.toLowerCase() === lowerCaseActiveTab;
        }
        return false;
      });
    }

    return data.filter((sparePart) =>
      sparePart.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sparePart.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sparePart.sku && sparePart.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sparePart.make && sparePart.make.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sparePart.brand && sparePart.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sparePart.manufacturer && sparePart.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sparePart.description && sparePart.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allSpareParts, activeTab, searchQuery]);

  const handleAddNewSparePartClick = useCallback(() => {
    setEditSparePartData(undefined);
    setIsSparePartDialogOpen(true);
  }, []);

  const handleSparePartDialogClose = useCallback(() => {
    setIsSparePartDialogOpen(false);
    setEditSparePartData(undefined);
  }, []);

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
        onAddClick={handleAddNewSparePartClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Spare Part ditemukan."
        }
      />

      <Dialog open={isSparePartDialogOpen} onOpenChange={setIsSparePartDialogOpen}>
        <SparePartDialogWrapper 
          onClose={handleSparePartDialogClose}
          initialData={editSparePartData}
          onSubmit={handleSubmitSparePart}
        />
      </Dialog>

      <AlertDialog open={!!sparePartToDelete} onOpenChange={(open) => !open && setSparePartToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus spare part &quot;
              {sparePartToDelete?.partName}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSparePartToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => sparePartToDelete && handleDeleteSparePart(sparePartToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
