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
import { Service, RawServiceApiResponse } from "@/types/services"; 
import { ServiceFormValues } from "@/schemas/service"; // Import from schemas/service
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
import { fetchServices, formatServiceDates } from "@/store/slices/serviceSlice"; 
import { api } from "@/lib/utils/api"; 
import ServiceDialogWrapper from "@/components/dialog/serviceDialog/ServiceDialogWrapper";

export default function ServiceListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allServices = useAppSelector((state) => state.services.services);
  const loading = useAppSelector((state) => state.services.status === 'loading');
  const error = useAppSelector((state) => state.services.error);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState<boolean>(false);
  const [editServiceData, setEditServiceData] = useState<Service | undefined>(undefined);
  const [serviceToDelete, setServiceToDelete] = useState<Service | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleDetailService = useCallback(
    (service: Service) => {
      router.push(`/services/${service.id}`);
    },
    [router]
  );

  const handleEditService = useCallback((service: Service) => {
    setEditServiceData(service);
    setIsServiceDialogOpen(true);
  }, []);

  const handleSubmitService = useCallback(
    async (values: ServiceFormValues) => {
      console.log("Submit Service:", values);
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
        const url = `http://localhost:3000/api/services${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<Service | RawServiceApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<Service | RawServiceApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Jasa berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsServiceDialogOpen(false);
        setEditServiceData(undefined);
        dispatch(fetchServices()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan jasa.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteService = useCallback(
    async (serviceId: string) => {
      console.log("Delete Service ID:", serviceId);
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
        await api.delete(`http://localhost:3000/api/services/${serviceId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Jasa berhasil dihapus.",
        });
        setServiceToDelete(undefined);
        dispatch(fetchServices()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus jasa.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const serviceColumns: ColumnDef<Service>[] = useMemo(
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
      { accessorKey: "name", header: "Nama Jasa" },
      { accessorKey: "category", header: "Kategori" },
      { accessorKey: "subCategory", header: "Sub Kategori" },
      { accessorKey: "price", header: "Harga" },
      {
        accessorKey: "tasks",
        header: "Tugas",
        cell: ({ row }) => {
          const tasks = row.original.tasks;
          return tasks && tasks.length > 0 ? tasks.join(', ') : 'N/A';
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const service = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailService(service)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditService(service)}>
                  Edit Jasa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setServiceToDelete(service)} className="text-red-600">
                  Hapus Jasa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailService, handleEditService]
  );

  const serviceTabItems = useMemo(() => {
    // Mengumpulkan semua kategori unik dan sub-kategori unik
    const uniqueCategories = Array.from(new Set(allServices.map(s => s.category).filter(Boolean) as string[]));
    const uniqueSubCategories = Array.from(new Set(allServices.map(s => s.subCategory).filter(Boolean) as string[]));

    const categoryTabs = uniqueCategories.map(cat => ({
      value: cat.toLowerCase(),
      label: cat,
      count: allServices.filter(s => s.category === cat).length,
    }));

    const subCategoryTabs = uniqueSubCategories.map(subCat => ({
      value: subCat.toLowerCase(),
      label: subCat,
      count: allServices.filter(s => s.subCategory === subCat).length,
    }));

    return [
      { value: "all", label: "All", count: allServices.length },
      ...categoryTabs,
      ...subCategoryTabs,
    ];
  }, [allServices]);

  const filteredServices = useMemo(() => {
    let data = allServices;

    if (activeTab !== "all") {
      data = data.filter((service) => {
        const lowerCaseActiveTab = activeTab.toLowerCase();
        // Cek berdasarkan category
        if (service.category && service.category.toLowerCase() === lowerCaseActiveTab) {
          return true;
        }
        // Cek berdasarkan subCategory
        if (service.subCategory && service.subCategory.toLowerCase() === lowerCaseActiveTab) {
          return true;
        }
        return false;
      });
    }

    return data.filter((service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (service.category && service.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (service.subCategory && service.subCategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
      service.tasks.some(task => task.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allServices, activeTab, searchQuery]);

  const handleAddNewServiceClick = useCallback(() => {
    setEditServiceData(undefined);
    setIsServiceDialogOpen(true);
  }, []);

  const handleServiceDialogClose = useCallback(() => {
    setIsServiceDialogOpen(false);
    setEditServiceData(undefined);
  }, []);

  return (
    <>
      <TableMain<Service>
        searchQuery={searchQuery}
        data={filteredServices}
        columns={serviceColumns}
        tabItems={serviceTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewServiceClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Jasa ditemukan."
        }
      />

      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <ServiceDialogWrapper 
          onClose={handleServiceDialogClose}
          initialData={editServiceData}
          onSubmit={handleSubmitService}
        />
      </Dialog>

      <AlertDialog open={!!serviceToDelete} onOpenChange={(open) => !open && setServiceToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus jasa &quot;
              {serviceToDelete?.name}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setServiceToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => serviceToDelete && handleDeleteService(serviceToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
