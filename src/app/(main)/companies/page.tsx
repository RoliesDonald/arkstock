// halaman ini hanya bisa di akses oleh Super Admin,
// dan hanya super admin yang bisa mendaftarkan perusahaan tersebut.

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
// --- PERBAIKAN: Path Import companyData ---
import { companyData } from "@/data/sampleCompanyData";
import { useAppSelector } from "@/store/hooks";
import {
  Company,
  CompanyFormValues,
  CompanyStatus,
  CompanyType,
} from "@/types/companies";
// --- PERBAIKAN: Path Import types (singular) dan nama type CompanyFormValues ---
import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import React, { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function CompanyListPage() {
  // --- PERBAIKAN: Typo seachQuery menjadi searchQuery ---
  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const [allCompanies, setAllCompanies] = useState<Company[]>(companyData);
  // --- PERBAIKAN: Typo acticeTab menjadi activeTab ---
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] =
    useState<boolean>(false);

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
              typeColor = "bg-blue-200 text-blue-800"; // Warna yang lebih kontras
              break;
            case CompanyType.VENDOR:
              typeColor = "bg-purple-200 text-purple-800";
              break;
            case CompanyType.CAR_USER:
              typeColor = "bg-green-200 text-green-800";
              break;
            case CompanyType.CHILD_COMPANY:
              typeColor = "bg-orange-200 text-orange-800";
              break;
            case CompanyType.INTERNAL:
              typeColor = "bg-teal-200 text-teal-800";
              break;
            default:
              typeColor = "bg-gray-200 text-gray-800";
          }
          return (
            <span
              className={`${typeColor} px-2 py-1 rounded-full text-xs font-semibold`} // Hapus mx-1, p-3, text-background
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
            case CompanyStatus.PROSPECT: // Tambahkan Prospect
              statusColor = "bg-yellow-500 text-black";
              break;
            case CompanyStatus.BLACKLISTED:
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
              className={`${statusColor} px-2 py-1 rounded-full text-xs font-semibold`} // Hapus p-3, text-arkBg-800
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
          // Menampilkan "Ya" atau "Tidak" langsung tanpa DropdownMenu di kolom PPn
          <span>{row.original.taxRegistered ? "Ya" : "Tidak"}</span>
        ),
      },
      {
        id: "actions", // Mengganti accessorKey menjadi id untuk kolom actions
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
                <DropdownMenuItem
                  onClick={() => alert(`Lihat detail ${company.companyName}`)}
                >
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => alert(`Edit ${company.companyName}`)}
                >
                  Edit Perusahaan
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => alert(`Hapus ${company.companyName}`)}
                  className="text-red-600" // Menggunakan warna tailwind langsung
                >
                  Hapus Perusahaan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const filteredCompanies = useMemo(() => {
    let currentCompanies = allCompanies;

    // --- PERBAIKAN: Menggunakan activeTab ---
    if (activeTab !== "all") {
      currentCompanies = currentCompanies.filter((company) => {
        // Filter berdasarkan status
        if (
          Object.values(CompanyStatus).some(
            (stat) => stat.toLowerCase() === activeTab
          )
        ) {
          // company.status bisa undefined jika tidak ada di data dummy awal
          return company.status?.toLowerCase() === activeTab;
        }
        // Filter berdasarkan tipe perusahaan
        if (
          Object.values(CompanyType).some(
            (type) => type.toLowerCase() === activeTab
          )
        ) {
          // company.companyType tidak opsional di model Prisma
          return company.companyType.toLowerCase() === activeTab;
        }
        return true;
      });
    }

    // --- PERBAIKAN: Menggunakan searchQuery ---
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentCompanies = currentCompanies.filter((company) =>
        Object.values(company).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(lowerCaseQuery)
        )
      );
    }
    return currentCompanies;
  }, [allCompanies, activeTab, searchQuery]); // Dependensi diperbaiki

  const companyTabItems = useMemo(() => {
    return [
      { value: "all", label: "All", count: allCompanies.length },
      // Tabs berdasarkan CompanyStatus
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
        label: "Prospek", // PERBAIKAN: Label lebih spesifik
        count: allCompanies.filter(
          (company) => company.status === CompanyStatus.PROSPECT
        ).length,
      },
      {
        value: CompanyStatus.ON_HOLD.toLowerCase(),
        label: "Ditunda", // PERBAIKAN: Label lebih spesifik
        count: allCompanies.filter(
          (company) => company.status === CompanyStatus.ON_HOLD
        ).length,
      },
      {
        value: CompanyStatus.BLACKLISTED.toLowerCase(),
        label: "Blacklisted", // PERBAIKAN: Label lebih spesifik
        count: allCompanies.filter(
          (company) => company.status === CompanyStatus.BLACKLISTED
        ).length,
      },
      // Tabs berdasarkan CompanyType
      {
        value: CompanyType.CAR_USER.toLowerCase(),
        label: "Pengguna Kendaraan",
        count: allCompanies.filter(
          (company) => company.companyType === CompanyType.CAR_USER
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
        value: CompanyType.INTERNAL.toLowerCase(),
        label: "Internal",
        count: allCompanies.filter(
          (company) => company.companyType === CompanyType.INTERNAL
        ).length,
      },
      {
        value: CompanyType.VENDOR.toLowerCase(),
        label: "Supplier", // PERBAIKAN: Label lebih spesifik
        count: allCompanies.filter(
          (company) => company.companyType === CompanyType.VENDOR
        ).length,
      },
      {
        value: CompanyType.VENDOR.toLowerCase(),
        label: "Vendor", // PERBAIKAN: Label lebih spesifik
        count: allCompanies.filter(
          (company) => company.companyType === CompanyType.VENDOR
        ).length,
      },
    ];
  }, [allCompanies]);

  // --- PERBAIKAN: Menggunakan CompanyFormValues ---
  const handleAddCompanySubmit = (values: CompanyFormValues) => {
    const newCompany: Company = {
      ...values,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setAllCompanies((prev) => [...prev, newCompany]);
    setIsCompanyDialogOpen(false);
    alert("Perusahaan berhasil ditambahkan");
  };

  return (
    <TableMain<Company>
      searchQuery={searchQuery} // --- PERBAIKAN: Menggunakan searchQuery ---
      data={filteredCompanies}
      columns={companyColumns}
      tabItems={companyTabItems}
      activeTab={activeTab} // --- PERBAIKAN: Menggunakan activeTab ---
      onTabChange={setActiveTab}
      showAddButton={true}
      showDownloadPrintButtons={true}
      emptyMessage="Tidak ada Perusahaan di temukan."
      isDialogOpen={isCompanyDialogOpen}
      onOpenChange={setIsCompanyDialogOpen}
      dialogContent={
        <CompanyDialog
          onClose={() => setIsCompanyDialogOpen(false)}
          onSubmit={handleAddCompanySubmit}
        />
      }
      dialogTitle="Tambahkan Perusahaan Baru"
      dialogDescription="Isi detail perusahaan untuk menambah data perusahaan baru ke sistem."
    />
  );
}
