"use client";

import TableMain from "@/components/common/table/TableMain";
import EstimationItemDialogWrapper from "@/components/dialog/estimationItemDialog/_components/EstimationItemDialogWrapper"; 
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
import { EstimationItem, RawEstimationItemApiResponse } from "@/types/estimationItems"; 
import { EstimationItemFormValues } from "@/schemas/estimationItem"; 
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
import { fetchEstimationItems, formatEstimationItemDates } from "@/store/slices/estimationItemSlice"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function EstimationItemListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allEstimationItems = useAppSelector((state) => state.estimationItems.estimationItems);
  const loading = useAppSelector((state) => state.estimationItems.status === 'loading');
  const error = useAppSelector((state) => state.estimationItems.error);

  const [activeTab, setActiveTab] = useState<string>("all"); 
  const [isEstimationItemDialogOpen, setIsEstimationItemDialogOpen] = useState<boolean>(false);
  const [editEstimationItemData, setEditEstimationItemData] = useState<EstimationItem | undefined>(undefined);
  const [estimationItemToDelete, setEstimationItemToDelete] = useState<EstimationItem | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchEstimationItems());
  }, [dispatch]);

  const handleDetailEstimationItem = useCallback(
    (ei: EstimationItem) => {
      router.push(`/estimation-items/${ei.id}`);
    },
    [router]
  );

  const handleEditEstimationItem = useCallback((ei: EstimationItem) => {
    setEditEstimationItemData(ei);
    setIsEstimationItemDialogOpen(true);
  }, []);

  const handleSubmitEstimationItem = useCallback(
    async (values: EstimationItemFormValues) => {
      console.log("Submit Estimation Item:", values);
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
        const url = `http://localhost:3000/api/estimation-items${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<EstimationItem | RawEstimationItemApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<EstimationItem | RawEstimationItemApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Item Estimasi berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsEstimationItemDialogOpen(false);
        setEditEstimationItemData(undefined);
        dispatch(fetchEstimationItems()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan Item Estimasi.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteEstimationItem = useCallback(
    async (eiId: string) => {
      console.log("Delete Estimation Item ID:", eiId);
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
        await api.delete(`http://localhost:3000/api/estimation-items/${eiId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Item Estimasi berhasil dihapus.",
        });
        setEstimationItemToDelete(undefined);
        dispatch(fetchEstimationItems()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus Item Estimasi.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const estimationItemColumns: ColumnDef<EstimationItem>[] = useMemo(
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
      { accessorKey: "estimation.estimationNumber", header: "Nomor Estimasi" },
      { accessorKey: "sparePart.partName", header: "Nama Spare Part" },
      { accessorKey: "sparePart.partNumber", header: "Nomor Part" },
      { accessorKey: "quantity", header: "Kuantitas" },
      { accessorKey: "price", header: "Harga Satuan", cell: ({ row }) => `Rp${row.original.price.toLocaleString('id-ID')}` },
      { accessorKey: "subtotal", header: "Subtotal", cell: ({ row }) => `Rp${row.original.subtotal.toLocaleString('id-ID')}` },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const ei = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailEstimationItem(ei)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditEstimationItem(ei)}>
                  Edit Item Estimasi
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEstimationItemToDelete(ei)} className="text-red-600">
                  Hapus Item Estimasi
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailEstimationItem, handleEditEstimationItem]
  );

  const estimationItemTabItems = useMemo(() => {
    // For EstimationItem, tabs might be based on estimation number or spare part category if needed.
    // For simplicity, starting with just "All".
    return [
      { value: "all", label: "All", count: allEstimationItems.length },
    ];
  }, [allEstimationItems]);

  const filteredEstimationItems = useMemo(() => {
    let data = allEstimationItems;

    // No specific tabs to filter by for now, only apply search query
    return data.filter((ei) =>
      (ei.estimation?.estimationNumber && ei.estimation.estimationNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ei.sparePart?.partName && ei.sparePart.partName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ei.sparePart?.partNumber && ei.sparePart.partNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allEstimationItems, searchQuery]);

  const handleAddNewEstimationItemClick = useCallback(() => {
    setEditEstimationItemData(undefined);
    setIsEstimationItemDialogOpen(true);
  }, []);

  const handleEstimationItemDialogClose = useCallback(() => {
    setIsEstimationItemDialogOpen(false);
    setEditEstimationItemData(undefined);
  }, []);

  return (
    <>
      <TableMain<EstimationItem>
        searchQuery={searchQuery}
        data={filteredEstimationItems}
        columns={estimationItemColumns}
        tabItems={estimationItemTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewEstimationItemClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Item Estimasi ditemukan."
        }
      />

      <Dialog open={isEstimationItemDialogOpen} onOpenChange={setIsEstimationItemDialogOpen}>
        <EstimationItemDialogWrapper 
          onClose={handleEstimationItemDialogClose}
          initialData={editEstimationItemData}
          onSubmit={handleSubmitEstimationItem}
        />
      </Dialog>

      <AlertDialog open={!!estimationItemToDelete} onOpenChange={(open) => !open && setEstimationItemToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus item estimasi &quot;
              {estimationItemToDelete?.sparePart?.partName} untuk {estimationItemToDelete?.estimation?.estimationNumber}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEstimationItemToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => estimationItemToDelete && handleDeleteEstimationItem(estimationItemToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
