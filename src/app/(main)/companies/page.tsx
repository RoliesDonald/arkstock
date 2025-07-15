// src/app/(admin)/(auth)/(main)/companies/page.tsx
"use client";
import TableMain from "@/components/common/table/TableMain";
import CompanyDialog from "@/components/dialog/companyDialog/_component/CompanyDialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/store/hooks";
import {
  Company,
  CompanyFormValues,
  CompanyStatus,
  CompanyType,
} from "@/types/companies";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
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

export default function CompanyListPage() {
  const router = useRouter();
  const { toast } = useToast();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] =
    useState<boolean>(false);
  const [editCompanyData, setEditCompanyData] = useState<Company | undefined>(
    undefined
  );
  const [companyToDelete, setCompanyToDelete] = useState<Company | undefined>(
    undefined
  );

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = getAuthToken();

    if (!token) {
      setError("Tidak ada token otentikasi. Silakan login kembali.");
      setLoading(false);
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/companies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast({
            title: "Sesi Habis",
            description:
              "Token tidak valid atau kadaluarsa. Silakan login kembali.",
            variant: "destructive",
          });
          router.push("/");
          return;
        }
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Gagal mengambil data perusahaan."
        );
      }

      const data: Company[] = await response.json();
      const formattedData = data.map((company) => ({
        ...company,
        createdAt: new Date(company.createdAt),
        updatedAt: new Date(company.updatedAt),
      }));
      setAllCompanies(formattedData);
      console.log("Data Perusahaan yang diterima dari API", formattedData);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [getAuthToken, router, toast]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleDetailCompany = useCallback(
    (company: Company) => {
      console.log("handleDetailCompany dipanggil dengan objek:", company); // LOG LENGKAP OBJEK
      console.log("company.id di handleDetailCompany:", company.id); // LOG SPESIFIK ID
      if (company.id) {
        router.push(`/companies/${company.id}`);
      } else {
        toast({
          title: "Error Navigasi",
          description: "ID perusahaan tidak ditemukan untuk navigasi.",
          variant: "destructive",
        });
        console.error("Navigasi dibatalkan: ID perusahaan undefined.", company);
      }
    },
    [router, toast]
  );

  const handleEditCompany = useCallback((company: Company) => {
    setEditCompanyData(company);
    setIsCompanyDialogOpen(true);
  }, []);

  const handleSubmitCompany = useCallback(
    async (values: CompanyFormValues) => {
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

      setLoading(true);
      try {
        const method = values.id ? "PUT" : "POST";
        const url = values.id
          ? `http://localhost:3000/api/companies/${values.id}`
          : "http://localhost:3000/api/companies";

        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              `Gagal ${values.id ? "memperbarui" : "menambahkan"} perusahaan.`
          );
        }

        toast({
          title: "Sukses",
          description: `Perusahaan berhasil di${
            values.id ? "perbarui" : "tambahkan"
          }.`,
        });
        setIsCompanyDialogOpen(false);
        setEditCompanyData(undefined);
        fetchCompanies();
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [getAuthToken, fetchCompanies, router, toast]
  );

  const handleDeleteCompany = useCallback(
    async (companyId: string) => {
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

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/companies/${companyId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Gagal menghapus perusahaan.");
        }

        toast({
          title: "Sukses",
          description: "Perusahaan berhasil dihapus.",
        });
        fetchCompanies();
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setCompanyToDelete(undefined);
      }
    },
    [getAuthToken, fetchCompanies, router, toast]
  );

  const companyColumns: ColumnDef<Company>[] = useMemo(
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
      { accessorKey: "companyId", header: "ID Perusahaan" },
      { accessorKey: "companyName", header: "Nama Perusahaan" },
      { accessorKey: "contact", header: "Contact" },
      { accessorKey: "companyEmail", header: "Email" },
      { accessorKey: "address", header: "Alamat" },
      {
        accessorKey: "companyType",
        header: "Tipe Perusahaan",
        cell: ({ row }) => {
          const type = row.original.companyType;
          let typeColor: string;
          switch (type) {
            case CompanyType.CUSTOMER:
              typeColor = "bg-blue-200 text-blue-800";
              break;
            case CompanyType.VENDOR:
              typeColor = "bg-purple-200 text-purple-800";
              break;
            case CompanyType.CAR_USER:
              typeColor = "bg-green-200 text-green-800";
              break;
            case CompanyType.FLEET_COMPANY:
              typeColor = "bg-orange-200 text-orange-800";
              break;
            case CompanyType.INTERNAL:
              typeColor = "bg-teal-200 text-teal-800";
              break;
            case CompanyType.RENTAL_COMPANY:
              typeColor = "bg-cyan-200 text-cyan-800";
              break;
            case CompanyType.CHILD_COMPANY:
              typeColor = "bg-indigo-200 text-indigo-800";
              break;
            case CompanyType.SERVICE_MAINTENANCE:
              typeColor = "bg-gray-400 text-gray-800";
              break;
            case CompanyType.SUPPLIER:
              typeColor = "bg-lime-200 text-lime-800";
              break;
            default:
              typeColor = "bg-gray-200 text-gray-800";
          }
          return (
            <span
              className={`${typeColor} px-2 py-1 rounded-full text-xs font-semibold`}
            >
              {type}
            </span>
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
              statusColor = "bg-purple-500 text-white";
              break;
            default:
              statusColor = "bg-gray-400 text-gray-800";
          }
          return (
            <span
              className={`${statusColor} px-2 py-1 rounded-full text-xs font-semibold`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "taxRegistered",
        header: "PPn",
        cell: ({ row }) => (
          <span>{row.original.taxRegistered ? "Ya" : "Tidak"}</span>
        ),
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
                <DropdownMenuLabel>Action</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleDetailCompany(company)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditCompany(company)}>
                  Edit Perusahaan
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setCompanyToDelete(company)}
                  className="text-red-600"
                >
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
      {
        value: CompanyStatus.ACTIVE.toLowerCase(),
        label: "Aktif",
        count: allCompanies.filter(
          (company) => company.status === CompanyStatus.ACTIVE
        ).length,
      },
      {
        value: CompanyStatus.INACTIVE.toLowerCase(),
        label: "Tidak Aktif",
        count: allCompanies.filter(
          (company) => company.status === CompanyStatus.INACTIVE
        ).length,
      },
      {
        value: CompanyStatus.PROSPECT.toLowerCase(),
        label: "Prospek",
        count: allCompanies.filter(
          (company) => company.status === CompanyStatus.PROSPECT
        ).length,
      },
      {
        value: CompanyStatus.ON_HOLD.toLowerCase(),
        label: "Ditunda",
        count: allCompanies.filter(
          (company) => company.status === CompanyStatus.ON_HOLD
        ).length,
      },
      {
        value: CompanyStatus.SUSPENDED.toLowerCase(),
        label: "Suspended",
        count: allCompanies.filter(
          (company) => company.status === CompanyStatus.SUSPENDED
        ).length,
      },
      {
        value: CompanyType.RENTAL_COMPANY.toLowerCase(),
        label: "Rental",
        count: allCompanies.filter(
          (company) => company.companyType === CompanyType.RENTAL_COMPANY
        ).length,
      },
      {
        value: CompanyType.CUSTOMER.toLowerCase(),
        label: "Customer",
        count: allCompanies.filter(
          (company) => company.companyType === CompanyType.CUSTOMER
        ).length,
      },
      {
        value: CompanyType.VENDOR.toLowerCase(),
        label: "Vendor",
        count: allCompanies.filter(
          (company) => company.companyType === CompanyType.VENDOR
        ).length,
      },
      {
        value: CompanyType.INTERNAL.toLowerCase(),
        label: "Internal",
        count: allCompanies.filter(
          (company) => company.companyType === CompanyType.INTERNAL
        ).length,
      },
      {
        value: CompanyType.FLEET_COMPANY.toLowerCase(),
        label: "Fleet Company",
        count: allCompanies.filter(
          (company) => company.companyType === CompanyType.FLEET_COMPANY
        ).length,
      },
      {
        value: CompanyType.SERVICE_MAINTENANCE.toLowerCase(),
        label: "Service & Maintenance",
        count: allCompanies.filter(
          (company) => company.companyType === CompanyType.SERVICE_MAINTENANCE
        ).length,
      },
      {
        value: CompanyType.RENTAL_COMPANY.toLowerCase(),
        label: "Rental Company",
        count: allCompanies.filter(
          (company) => company.companyType === CompanyType.RENTAL_COMPANY
        ).length,
      },
      {
        value: CompanyType.CAR_USER.toLowerCase(),
        label: "Car User",
        count: allCompanies.filter(
          (company) => company.companyType === CompanyType.CAR_USER
        ).length,
      },
      {
        value: CompanyType.CHILD_COMPANY.toLowerCase(),
        label: "Child Company",
        count: allCompanies.filter(
          (company) => company.companyType === CompanyType.CHILD_COMPANY
        ).length,
      },
      {
        value: CompanyType.SERVICE_MAINTENANCE.toLowerCase(),
        label: "Other",
        count: allCompanies.filter(
          (company) => company.companyType === CompanyType.SERVICE_MAINTENANCE
        ).length,
      },
      {
        value: CompanyType.SUPPLIER.toLowerCase(),
        label: "Supplier",
        count: allCompanies.filter(
          (company) => company.companyType === CompanyType.SUPPLIER
        ).length,
      },
    ];
  }, [allCompanies]);

  const filteredCompanies = useMemo(() => {
    let data = allCompanies;

    if (activeTab !== "all") {
      data = data.filter(
        (company) =>
          company.status?.toLowerCase() === activeTab ||
          company.companyType?.toLowerCase() === activeTab
      );
    }

    return data.filter((company) =>
      company.companyName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allCompanies, activeTab, searchQuery]);

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
        showDownloadPrintButtons={true}
        emptyMessage={
          loading
            ? "Memuat data..."
            : error
            ? `Error: ${error}`
            : "Tidak ada Perusahaan ditemukan."
        }
        isDialogOpen={isCompanyDialogOpen}
        onOpenChange={(open) => {
          setIsCompanyDialogOpen(open);
          if (!open) {
            setEditCompanyData(undefined);
          }
        }}
        dialogContent={
          <CompanyDialog
            onClose={() => {
              setIsCompanyDialogOpen(false);
              setEditCompanyData(undefined);
            }}
            initialData={editCompanyData}
            onSubmit={handleSubmitCompany}
          />
        }
        dialogTitle={
          editCompanyData ? "Edit Perusahaan" : "Tambahkan Perusahaan Baru"
        }
        dialogDescription={
          editCompanyData
            ? "Edit detail perusahaan yang sudah ada."
            : "Isi detail perusahaan untuk menambah data perusahaan baru ke sistem."
        }
      />

      <AlertDialog
        open={!!companyToDelete}
        onOpenChange={(open) => !open && setCompanyToDelete(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus perusahaan &quot;
              {companyToDelete?.companyName}&quot;? Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCompanyToDelete(undefined)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                companyToDelete && handleDeleteCompany(companyToDelete.id)
              }
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
