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
import { Location, RawLocationApiResponse } from "@/types/locations"; 
import { LocationFormValues } from "@/schemas/locations"; 
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
import { fetchLocations, formatLocationDates } from "@/store/slices/locationSlice"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import LocationDialogWrapper from "@/components/dialog/locationDialog/_component/LocationDialogWrapper";

export default function LocationListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allLocations = useAppSelector((state) => state.location.locations);
  const loading = useAppSelector((state) => state.location.status === 'loading');
  const error = useAppSelector((state) => state.location.error);

  const [activeTab, setActiveTab] = useState<string>("all"); // Locations don't have specific types/statuses for tabs
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState<boolean>(false);
  const [editLocationData, setEditLocationData] = useState<Location | undefined>(undefined);
  const [locationToDelete, setLocationToDelete] = useState<Location | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  const handleDetailLocation = useCallback(
    (location: Location) => {
      router.push(`/locations/${location.id}`);
    },
    [router]
  );

  const handleEditLocation = useCallback((location: Location) => {
    setEditLocationData(location);
    setIsLocationDialogOpen(true);
  }, []);

  const handleSubmitLocation = useCallback(
    async (values: LocationFormValues) => {
      console.log("Submit Location:", values);
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
        const url = `http://localhost:3000/api/locations${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<Location | RawLocationApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<Location | RawLocationApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Lokasi berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsLocationDialogOpen(false);
        setEditLocationData(undefined);
        dispatch(fetchLocations()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan lokasi.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteLocation = useCallback(
    async (locationId: string) => {
      console.log("Delete Location ID:", locationId);
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
        await api.delete(`http://localhost:3000/api/locations/${locationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Lokasi berhasil dihapus.",
        });
        setLocationToDelete(undefined);
        dispatch(fetchLocations()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus lokasi.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const locationColumns: ColumnDef<Location>[] = useMemo(
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
      { accessorKey: "name", header: "Nama Lokasi" },
      { accessorKey: "address", header: "Alamat" },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const location = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailLocation(location)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditLocation(location)}>
                  Edit Lokasi
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocationToDelete(location)} className="text-red-600">
                  Hapus Lokasi
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailLocation, handleEditLocation]
  );

  const locationTabItems = useMemo(() => {
    // Locations don't have specific types/statuses for tabs, so we'll just have "All"
    return [
      { value: "all", label: "All", count: allLocations.length },
    ];
  }, [allLocations]);

  const filteredLocations = useMemo(() => {
    let data = allLocations;

    // No specific tabs to filter by for locations, so we only apply search query
    return data.filter((location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (location.address && location.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allLocations, searchQuery]);

  const handleAddNewLocationClick = useCallback(() => {
    setEditLocationData(undefined);
    setIsLocationDialogOpen(true);
  }, []);

  const handleLocationDialogClose = useCallback(() => {
    setIsLocationDialogOpen(false);
    setEditLocationData(undefined);
  }, []);

  return (
    <>
      <TableMain<Location>
        searchQuery={searchQuery}
        data={filteredLocations}
        columns={locationColumns}
        tabItems={locationTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewLocationClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Lokasi ditemukan."
        }
      />

      <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
        <LocationDialogWrapper 
          onClose={handleLocationDialogClose}
          initialData={editLocationData}
          onSubmit={handleSubmitLocation}
        />
      </Dialog>

      <AlertDialog open={!!locationToDelete} onOpenChange={(open) => !open && setLocationToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus lokasi &quot;
              {locationToDelete?.name}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setLocationToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => locationToDelete && handleDeleteLocation(locationToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
