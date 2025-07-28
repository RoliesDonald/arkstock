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
import { WorkOrderImage, RawWorkOrderImageApiResponse } from "@/types/workOrderImages"; 
import { WorkOrderImageFormValues } from "@/schemas/workOrderImage"; 
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
import { fetchWorkOrderImages, formatWorkOrderImageDates } from "@/store/slices/workOrderImageSlice"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import Image from "next/image"; // Import Image component for displaying images
import WorkOrderImageDialogWrapper from "@/components/dialog/workOrderImageDialog/_components/workOrderImageDialogWrapper";

export default function WorkOrderImageListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allWorkOrderImages = useAppSelector((state) => state.workOrderImages.workOrderImages);
  const loading = useAppSelector((state) => state.workOrderImages.status === 'loading');
  const error = useAppSelector((state) => state.workOrderImages.error);

  const [activeTab, setActiveTab] = useState<string>("all"); 
  const [isWorkOrderImageDialogOpen, setIsWorkOrderImageDialogOpen] = useState<boolean>(false);
  const [editWorkOrderImageData, setEditWorkOrderImageData] = useState<WorkOrderImage | undefined>(undefined);
  const [workOrderImageToDelete, setWorkOrderImageToDelete] = useState<WorkOrderImage | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchWorkOrderImages());
  }, [dispatch]);

  const handleDetailWorkOrderImage = useCallback(
    (woi: WorkOrderImage) => {
      router.push(`/work-order-images/${woi.id}`);
    },
    [router]
  );

  const handleEditWorkOrderImage = useCallback((woi: WorkOrderImage) => {
    setEditWorkOrderImageData(woi);
    setIsWorkOrderImageDialogOpen(true);
  }, []);

  const handleSubmitWorkOrderImage = useCallback(
    async (values: WorkOrderImageFormValues) => {
      console.log("Submit Work Order Image:", values);
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
        const url = `http://localhost:3000/api/work-order-images${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<WorkOrderImage | RawWorkOrderImageApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<WorkOrderImage | RawWorkOrderImageApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Gambar Work Order berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsWorkOrderImageDialogOpen(false);
        setEditWorkOrderImageData(undefined);
        dispatch(fetchWorkOrderImages()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan Gambar Work Order.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteWorkOrderImage = useCallback(
    async (woiId: string) => {
      console.log("Delete Work Order Image ID:", woiId);
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
        await api.delete(`http://localhost:3000/api/work-order-images/${woiId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Gambar Work Order berhasil dihapus.",
        });
        setWorkOrderImageToDelete(undefined);
        dispatch(fetchWorkOrderImages()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus Gambar Work Order.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const workOrderImageColumns: ColumnDef<WorkOrderImage>[] = useMemo(
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
      { accessorKey: "workOrder.workOrderNumber", header: "Nomor WO" },
      { 
        accessorKey: "imageUrl", 
        header: "Gambar",
        cell: ({ row }) => (
          <div className="w-24 h-24 relative overflow-hidden rounded-md">
            <Image 
              src={row.original.imageUrl} 
              alt={row.original.description || "Work Order Image"} 
              layout="fill" 
              objectFit="cover" 
              className="rounded-md"
              onError={(e) => { e.currentTarget.src = "https://placehold.co/96x96/e0e0e0/000000?text=No+Image"; }} // Placeholder on error
            />
          </div>
        )
      },
      { accessorKey: "description", header: "Deskripsi" },
      { accessorKey: "uploadedBy", header: "Diunggah Oleh" }, // Ini akan menampilkan ID, jika ingin nama perlu relasi ke Employee
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const woi = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailWorkOrderImage(woi)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditWorkOrderImage(woi)}>
                  Edit Gambar Work Order
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setWorkOrderImageToDelete(woi)} className="text-red-600">
                  Hapus Gambar Work Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailWorkOrderImage, handleEditWorkOrderImage]
  );

  const workOrderImageTabItems = useMemo(() => {
    // For WorkOrderImage, tabs might be based on work order number or description if needed.
    // For simplicity, starting with just "All".
    return [
      { value: "all", label: "All", count: allWorkOrderImages.length },
    ];
  }, [allWorkOrderImages]);

  const filteredWorkOrderImages = useMemo(() => {
    let data = allWorkOrderImages;

    // No specific tabs to filter by for now, only apply search query
    return data.filter((woi) =>
      (woi.workOrder?.workOrderNumber && woi.workOrder.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (woi.description && woi.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (woi.uploadedBy && woi.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allWorkOrderImages, searchQuery]);

  const handleAddNewWorkOrderImageClick = useCallback(() => {
    setEditWorkOrderImageData(undefined);
    setIsWorkOrderImageDialogOpen(true);
  }, []);

  const handleWorkOrderImageDialogClose = useCallback(() => {
    setIsWorkOrderImageDialogOpen(false);
    setEditWorkOrderImageData(undefined);
  }, []);

  return (
    <>
      <TableMain<WorkOrderImage>
        searchQuery={searchQuery}
        data={filteredWorkOrderImages}
        columns={workOrderImageColumns}
        tabItems={workOrderImageTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewWorkOrderImageClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Gambar Work Order ditemukan."
        }
      />

      <Dialog open={isWorkOrderImageDialogOpen} onOpenChange={setIsWorkOrderImageDialogOpen}>
        <WorkOrderImageDialogWrapper 
          onClose={handleWorkOrderImageDialogClose}
          initialData={editWorkOrderImageData}
          onSubmit={handleSubmitWorkOrderImage}
        />
      </Dialog>

      <AlertDialog open={!!workOrderImageToDelete} onOpenChange={(open) => !open && setWorkOrderImageToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus gambar ini dari Work Order &quot;
              {workOrderImageToDelete?.workOrder?.workOrderNumber}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setWorkOrderImageToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => workOrderImageToDelete && handleDeleteWorkOrderImage(workOrderImageToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
