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
import { Unit, RawUnitApiResponse } from "@/types/unit"; 
import { UnitFormValues } from "@/schemas/unit"; 
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
import { fetchUnits, formatUnitDates } from "@/store/slices/unitSlice"; 
import { UnitType, UnitCategory } from "@prisma/client"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import UnitDialogWrapper from "@/components/dialog/unitDialog/UnitDialogWrapper";

export default function UnitListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allUnits = useAppSelector((state) => state.units.units);
  const loading = useAppSelector((state) => state.units.status === 'loading');
  const error = useAppSelector((state) => state.units.error);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isUnitDialogOpen, setIsUnitDialogOpen] = useState<boolean>(false);
  const [editUnitData, setEditUnitData] = useState<Unit | undefined>(undefined);
  const [unitToDelete, setUnitToDelete] = useState<Unit | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchUnits());
  }, [dispatch]);

  const handleDetailUnit = useCallback(
    (unit: Unit) => {
      router.push(`/units/${unit.id}`);
    },
    [router]
  );

  const handleEditUnit = useCallback((unit: Unit) => {
    setEditUnitData(unit);
    setIsUnitDialogOpen(true);
  }, []);

  const handleSubmitUnit = useCallback(
    async (values: UnitFormValues) => {
      console.log("Submit Unit:", values);
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
        const url = `http://localhost:3000/api/units${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<Unit | RawUnitApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<Unit | RawUnitApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Unit berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsUnitDialogOpen(false);
        setEditUnitData(undefined);
        dispatch(fetchUnits()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan unit.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteUnit = useCallback(
    async (unitId: string) => {
      console.log("Delete Unit ID:", unitId);
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
        await api.delete(`http://localhost:3000/api/units/${unitId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Unit berhasil dihapus.",
        });
        setUnitToDelete(undefined);
        dispatch(fetchUnits()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus unit.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const unitColumns: ColumnDef<Unit>[] = useMemo(
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
      { accessorKey: "name", header: "Nama Unit" },
      { accessorKey: "symbol", header: "Simbol" },
      {
        accessorKey: "unitType",
        header: "Tipe Unit",
        cell: ({ row }) => {
          const type = row.original.unitType;
          let typeColor: string;
          switch (type) {
            case UnitType.MEASUREMENT:
              typeColor = "bg-blue-200 text-blue-800";
              break;
            case UnitType.CURRENCY:
              typeColor = "bg-green-200 text-green-800";
              break;
            case UnitType.TIME:
              typeColor = "bg-purple-200 text-purple-800";
              break;
            case UnitType.OTHER:
              typeColor = "bg-gray-200 text-gray-800";
              break;
            default:
              typeColor = "bg-gray-400 text-gray-800";
          }
          return (
            <span className={`${typeColor} px-2 py-1 rounded-full text-xs font-semibold`}>{type.replace(/_/g, " ")}</span>
          );
        },
      },
      {
        accessorKey: "unitCategory",
        header: "Kategori Unit",
        cell: ({ row }) => {
          const category = row.original.unitCategory;
          let categoryColor: string;
          switch (category) {
            case UnitCategory.LENGTH:
              categoryColor = "bg-red-200 text-red-800";
              break;
            case UnitCategory.WEIGHT:
              categoryColor = "bg-orange-200 text-orange-800";
              break;
            case UnitCategory.VOLUME:
              categoryColor = "bg-yellow-200 text-yellow-800";
              break;
            case UnitCategory.AREA:
              categoryColor = "bg-lime-200 text-lime-800";
              break;
            case UnitCategory.COUNT:
              categoryColor = "bg-green-200 text-green-800";
              break;
            case UnitCategory.CURRENCY:
              categoryColor = "bg-teal-200 text-teal-800";
              break;
            case UnitCategory.DURATION:
              categoryColor = "bg-cyan-200 text-cyan-800";
              break;
            case UnitCategory.OTHER:
              categoryColor = "bg-gray-200 text-gray-800";
              break;
            default:
              categoryColor = "bg-gray-400 text-gray-800";
          }
          return (
            <span className={`${categoryColor} px-2 py-1 rounded-full text-xs font-semibold`}>{category.replace(/_/g, " ")}</span>
          );
        },
      },
      { accessorKey: "description", header: "Deskripsi" },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const unit = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailUnit(unit)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditUnit(unit)}>
                  Edit Unit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUnitToDelete(unit)} className="text-red-600">
                  Hapus Unit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailUnit, handleEditUnit]
  );

  const unitTabItems = useMemo(() => {
    return [
      { value: "all", label: "All", count: allUnits.length },
      // Tabs for UnitType
      {
        value: UnitType.MEASUREMENT.toLowerCase(),
        label: "Pengukuran",
        count: allUnits.filter((u) => u.unitType === UnitType.MEASUREMENT).length,
      },
      {
        value: UnitType.CURRENCY.toLowerCase(),
        label: "Mata Uang",
        count: allUnits.filter((u) => u.unitType === UnitType.CURRENCY).length,
      },
      {
        value: UnitType.TIME.toLowerCase(),
        label: "Waktu",
        count: allUnits.filter((u) => u.unitType === UnitType.TIME).length,
      },
      {
        value: UnitType.OTHER.toLowerCase(),
        label: "Lainnya (Tipe)",
        count: allUnits.filter((u) => u.unitType === UnitType.OTHER).length,
      },
      // Tabs for UnitCategory
      {
        value: UnitCategory.LENGTH.toLowerCase(),
        label: "Panjang",
        count: allUnits.filter((u) => u.unitCategory === UnitCategory.LENGTH).length,
      },
      {
        value: UnitCategory.WEIGHT.toLowerCase(),
        label: "Berat",
        count: allUnits.filter((u) => u.unitCategory === UnitCategory.WEIGHT).length,
      },
      {
        value: UnitCategory.VOLUME.toLowerCase(),
        label: "Volume",
        count: allUnits.filter((u) => u.unitCategory === UnitCategory.VOLUME).length,
      },
      {
        value: UnitCategory.AREA.toLowerCase(),
        label: "Area",
        count: allUnits.filter((u) => u.unitCategory === UnitCategory.AREA).length,
      },
      {
        value: UnitCategory.COUNT.toLowerCase(),
        label: "Jumlah",
        count: allUnits.filter((u) => u.unitCategory === UnitCategory.COUNT).length,
      },
      {
        value: UnitCategory.CURRENCY.toLowerCase(),
        label: "Mata Uang (Kategori)",
        count: allUnits.filter((u) => u.unitCategory === UnitCategory.CURRENCY).length,
      },
      {
        value: UnitCategory.DURATION.toLowerCase(),
        label: "Durasi",
        count: allUnits.filter((u) => u.unitCategory === UnitCategory.DURATION).length,
      },
      {
        value: UnitCategory.OTHER.toLowerCase(),
        label: "Lainnya (Kategori)",
        count: allUnits.filter((u) => u.unitCategory === UnitCategory.OTHER).length,
      },
    ];
  }, [allUnits]);

  const filteredUnits = useMemo(() => {
    let data = allUnits;

    if (activeTab !== "all") {
      data = data.filter((unit) => {
        const lowerCaseActiveTab = activeTab.toLowerCase();
        // Cek berdasarkan UnitType
        if (Object.values(UnitType).some(t => t.toLowerCase() === lowerCaseActiveTab)) {
          return unit.unitType.toLowerCase() === lowerCaseActiveTab;
        }
        // Cek berdasarkan UnitCategory
        if (Object.values(UnitCategory).some(c => c.toLowerCase() === lowerCaseActiveTab)) {
          return unit.unitCategory.toLowerCase() === lowerCaseActiveTab;
        }
        return false;
      });
    }

    return data.filter((unit) =>
      unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (unit.symbol && unit.symbol.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (unit.description && unit.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allUnits, activeTab, searchQuery]);

  const handleAddNewUnitClick = useCallback(() => {
    setEditUnitData(undefined);
    setIsUnitDialogOpen(true);
  }, []);

  const handleUnitDialogClose = useCallback(() => {
    setIsUnitDialogOpen(false);
    setEditUnitData(undefined);
  }, []);

  return (
    <>
      <TableMain<Unit>
        searchQuery={searchQuery}
        data={filteredUnits}
        columns={unitColumns}
        tabItems={unitTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewUnitClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Unit ditemukan."
        }
      />

      <Dialog open={isUnitDialogOpen} onOpenChange={setIsUnitDialogOpen}>
        <UnitDialogWrapper 
          onClose={handleUnitDialogClose}
          initialData={editUnitData}
          onSubmit={handleSubmitUnit}
        />
      </Dialog>

      <AlertDialog open={!!unitToDelete} onOpenChange={(open) => !open && setUnitToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus unit &quot;
              {unitToDelete?.name}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUnitToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => unitToDelete && handleDeleteUnit(unitToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
