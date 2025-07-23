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
import { Company, RawCompanyApiResponse } from "@/types/companies"; 
import { CompanyFormValues } from "@/schemas/company"; // Import CompanyFormValues dari schemas
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
import { fetchCompanies, formatCompanyDates } from "@/store/slices/companySlice"; 
import { CompanyStatus, CompanyType, CompanyRole } from "@prisma/client"; 
import { api } from "@/lib/utils/api"; 
import CompanyDialogWrapper from "@/components/dialog/companyDialog/_component/CompanyDialogWrapper";

export default function CompanyListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allCompanies = useAppSelector((state) => state.companies.companies);
  const loading = useAppSelector((state) => state.companies.status === 'loading');
  const error = useAppSelector((state) => state.companies.error);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState<boolean>(false);
  const [editCompanyData, setEditCompanyData] = useState<Company | undefined>(undefined);
  const [companyToDelete, setCompanyToDelete] = useState<Company | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const handleDetailCompany = useCallback(
    (company: Company) => {
      router.push(`/companies/${company.id}`);
    },
    [router]
  );

  const handleEditCompany = useCallback((company: Company) => {
    setEditCompanyData(company);
    setIsCompanyDialogOpen(true);
  }, []);

  const handleSubmitCompany = useCallback(
    async (values: CompanyFormValues) => {
      console.log("Submit Company:", values);
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
        const url = `http://localhost:3000/api/companies${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<Company | RawCompanyApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<Company | RawCompanyApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Perusahaan berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsCompanyDialogOpen(false);
        setEditCompanyData(undefined);
        dispatch(fetchCompanies()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan perusahaan.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteCompany = useCallback(
    async (companyId: string) => {
      console.log("Delete Company ID:", companyId);
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
        await api.delete(`http://localhost:3000/api/companies/${companyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Perusahaan berhasil dihapus.",
        });
        setCompanyToDelete(undefined);
        dispatch(fetchCompanies()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus perusahaan.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const companyColumns: ColumnDef<Company>[] = useMemo(
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
      { accessorKey: "companyId", header: "ID Perusahaan" },
      { accessorKey: "companyName", header: "Nama Perusahaan" },
      { accessorKey: "companyEmail", header: "Email" },
      { accessorKey: "contact", header: "Kontak" },
      { accessorKey: "city", header: "Kota" },
      {
        accessorKey: "companyType",
        header: "Tipe",
        cell: ({ row }) => {
          const type = row.original.companyType;
          let typeColor: string;
          switch (type) {
            case CompanyType.CUSTOMER:
              typeColor = "bg-blue-200 text-blue-800";
              break;
            case CompanyType.VENDOR:
              typeColor = "bg-green-220 text-green-800";
              break;
            case CompanyType.RENTAL_COMPANY:
              typeColor = "bg-purple-200 text-purple-800";
              break;
            case CompanyType.SERVICE_MAINTENANCE:
              typeColor = "bg-orange-200 text-orange-800";
              break;
            case CompanyType.FLEET_COMPANY:
              typeColor = "bg-teal-200 text-teal-800";
              break;
            case CompanyType.INTERNAL:
              typeColor = "bg-red-200 text-red-800";
              break;
            case CompanyType.CAR_USER:
              typeColor = "bg-yellow-200 text-yellow-800";
              break;
            case CompanyType.CHILD_COMPANY:
              typeColor = "bg-indigo-200 text-indigo-800";
              break;
            case CompanyType.SUPPLIER:
              typeColor = "bg-lime-200 text-lime-800";
              break;
            default:
              typeColor = "bg-gray-400 text-gray-800";
          }
          return (
            <span className={`${typeColor} px-2 py-1 rounded-full text-xs font-semibold`}>{type}</span>
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
            case CompanyStatus.ACTIVE:
              statusColor = "bg-green-500 text-white";
              break;
            case CompanyStatus.INACTIVE:
              statusColor = "bg-red-500 text-white";
              break;
            case CompanyStatus.PROSPECT:
              statusColor = "bg-yellow-500 text-black";
              break;
            case CompanyStatus.SUSPENDED:
              statusColor = "bg-gray-700 text-white";
              break;
            case CompanyStatus.ON_HOLD:
              statusColor = "bg-orange-500 text-white";
              break;
            default:
              statusColor = "bg-gray-400 text-gray-800";
          }
          return (
            <span className={`${statusColor} px-2 py-1 rounded-full text-xs font-semibold`}>{status}</span>
          );
        },
      },
      {
        accessorKey: "companyRole",
        header: "Role Perusahaan",
        cell: ({ row }) => {
          const role = row.original.companyRole;
          let roleColor: string;
          switch (role) {
            case CompanyRole.MAIN_COMPANY:
              roleColor = "bg-blue-200 text-blue-800";
              break;
            case CompanyRole.CHILD_COMPANY:
              roleColor = "bg-purple-200 text-purple-800";
              break;
            default:
              roleColor = "bg-gray-400 text-gray-800";
          }
          return (
            <span className={`${roleColor} px-2 py-1 rounded-full text-xs font-semibold`}>{role.replace(/_/g, " ")}</span>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const company = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailCompany(company)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditCompany(company)}>
                  Edit Perusahaan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCompanyToDelete(company)} className="text-red-600">
                  Hapus Perusahaan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailCompany, handleEditCompany]
  );

  const companyTabItems = useMemo(() => {
    return [
      { value: "all", label: "All", count: allCompanies.length },
      // Tabs for CompanyType
      {
        value: CompanyType.CUSTOMER.toLowerCase(),
        label: "Customer",
        count: allCompanies.filter((comp) => comp.companyType === CompanyType.CUSTOMER).length,
      },
      {
        value: CompanyType.VENDOR.toLowerCase(),
        label: "Vendor",
        count: allCompanies.filter((comp) => comp.companyType === CompanyType.VENDOR).length,
      },
      {
        value: CompanyType.RENTAL_COMPANY.toLowerCase(),
        label: "Rental Company",
        count: allCompanies.filter((comp) => comp.companyType === CompanyType.RENTAL_COMPANY).length,
      },
      {
        value: CompanyType.SERVICE_MAINTENANCE.toLowerCase(),
        label: "Service & Maintenance",
        count: allCompanies.filter((comp) => comp.companyType === CompanyType.SERVICE_MAINTENANCE).length,
      },
      {
        value: CompanyType.FLEET_COMPANY.toLowerCase(),
        label: "Fleet Company",
        count: allCompanies.filter((comp) => comp.companyType === CompanyType.FLEET_COMPANY).length,
      },
      {
        value: CompanyType.INTERNAL.toLowerCase(),
        label: "Internal",
        count: allCompanies.filter((comp) => comp.companyType === CompanyType.INTERNAL).length,
      },
      {
        value: CompanyType.CAR_USER.toLowerCase(),
        label: "Car User",
        count: allCompanies.filter((comp) => comp.companyType === CompanyType.CAR_USER).length,
      },
      {
        value: CompanyType.CHILD_COMPANY.toLowerCase(),
        label: "Child Company",
        count: allCompanies.filter((comp) => comp.companyType === CompanyType.CHILD_COMPANY).length,
      },
      {
        value: CompanyType.SUPPLIER.toLowerCase(),
        label: "Supplier",
        count: allCompanies.filter((comp) => comp.companyType === CompanyType.SUPPLIER).length,
      },
      // Tabs for CompanyStatus
      {
        value: CompanyStatus.ACTIVE.toLowerCase(),
        label: "Aktif",
        count: allCompanies.filter((comp) => comp.status === CompanyStatus.ACTIVE).length,
      },
      {
        value: CompanyStatus.INACTIVE.toLowerCase(),
        label: "Tidak Aktif",
        count: allCompanies.filter((comp) => comp.status === CompanyStatus.INACTIVE).length,
      },
      {
        value: CompanyStatus.PROSPECT.toLowerCase(),
        label: "Prospek",
        count: allCompanies.filter((comp) => comp.status === CompanyStatus.PROSPECT).length,
      },
      {
        value: CompanyStatus.SUSPENDED.toLowerCase(),
        label: "Ditangguhkan",
        count: allCompanies.filter((comp) => comp.status === CompanyStatus.SUSPENDED).length,
      },
      {
        value: CompanyStatus.ON_HOLD.toLowerCase(),
        label: "Ditahan",
        count: allCompanies.filter((comp) => comp.status === CompanyStatus.ON_HOLD).length,
      },
      // Tabs for CompanyRole
      {
        value: CompanyRole.MAIN_COMPANY.toLowerCase(),
        label: "Perusahaan Utama",
        count: allCompanies.filter((comp) => comp.companyRole === CompanyRole.MAIN_COMPANY).length,
      },
      {
        value: CompanyRole.CHILD_COMPANY.toLowerCase(),
        label: "Perusahaan Anak",
        count: allCompanies.filter((comp) => comp.companyRole === CompanyRole.CHILD_COMPANY).length,
      },
    ];
  }, [allCompanies]);

  const filteredCompanies = useMemo(() => {
    let data = allCompanies;

    if (activeTab !== "all") {
      data = data.filter((company) => {
        const lowerCaseActiveTab = activeTab.toLowerCase();
        // Cek berdasarkan CompanyType
        if (Object.values(CompanyType).some(t => t.toLowerCase() === lowerCaseActiveTab)) {
          return company.companyType.toLowerCase() === lowerCaseActiveTab;
        }
        // Cek berdasarkan CompanyStatus
        if (Object.values(CompanyStatus).some(s => s.toLowerCase() === lowerCaseActiveTab)) {
          return company.status.toLowerCase() === lowerCaseActiveTab;
        }
        // Cek berdasarkan CompanyRole
        if (Object.values(CompanyRole).some(r => r.toLowerCase() === lowerCaseActiveTab)) {
          return company.companyRole.toLowerCase() === lowerCaseActiveTab;
        }
        return false;
      });
    }

    return data.filter((company) =>
      company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.companyId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (company.companyEmail && company.companyEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (company.contact && company.contact.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (company.city && company.city.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allCompanies, activeTab, searchQuery]);

  const handleAddNewCompanyClick = useCallback(() => {
    setEditCompanyData(undefined);
    setIsCompanyDialogOpen(true);
  }, []);

  const handleCompanyDialogClose = useCallback(() => {
    setIsCompanyDialogOpen(false);
    setEditCompanyData(undefined);
  }, []);

  return (
    <>
      <TableMain<Company>
        searchQuery={searchQuery}
        data={filteredCompanies}
        columns={companyColumns}
        tabItems={companyTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewCompanyClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Perusahaan ditemukan."
        }
      />

      <Dialog open={isCompanyDialogOpen} onOpenChange={setIsCompanyDialogOpen}>
        <CompanyDialogWrapper
          onClose={handleCompanyDialogClose}
          initialData={editCompanyData}
          onSubmit={handleSubmitCompany}
        />
      </Dialog>

      <AlertDialog open={!!companyToDelete} onOpenChange={(open) => !open && setCompanyToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus perusahaan &quot;
              {companyToDelete?.companyName}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCompanyToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => companyToDelete && handleDeleteCompany(companyToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
