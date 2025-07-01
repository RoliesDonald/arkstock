"use client";

import TableMain from "@/components/common/table/TableMain";
import EmployeeDialog from "@/components/dialog/employeeDialog/_component"; // Import EmployeeDialog Anda
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import hooks Redux dan thunks dari employeeSlice
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "@/store/slices/employeeSlice";
import { useAppSelector as useCompanySelector } from "@/store/hooks"; // Alias untuk company selector jika diperlukan

// Import tipe-tipe yang relevan
import {
  Employee,
  EmployeeStatus,
  EmployeeRole,
  EmployeeFormValues,
} from "@/types/employee";

import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale"; // Menggunakan alias untuk menghindari konflik
import { useRouter } from "next/navigation";

export default function EmployeeListPage() {
  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Ambil data karyawan dan status dari Redux store
  const allEmployees = useAppSelector((state) => state.employee.employees);
  const employeeStatus = useAppSelector((state) => state.employee.status);
  const employeeError = useAppSelector((state) => state.employee.error);

  // Ambil data perusahaan untuk mapping nama perusahaan
  const allCompanies = useCompanySelector((state) => state.companies.companies);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] =
    useState<boolean>(false);
  const [editEmployeeData, setEditEmployeeData] = useState<
    Employee | undefined
  >(undefined);

  // Dispatch fetchEmployees saat komponen pertama kali dimuat
  useEffect(() => {
    if (employeeStatus === "idle") {
      dispatch(fetchEmployees());
    }
  }, [dispatch, employeeStatus]);

  // Helper untuk mendapatkan nama perusahaan
  const getCompanyNameById = useCallback(
    (companyId: string | null | undefined) => {
      if (!companyId) {
        return "N/A";
      }
      const company = allCompanies.find((c) => c.id === companyId);
      return company ? company.companyName : "Tidak Dikenal";
    },
    [allCompanies]
  );

  const handleDetailEmployee = useCallback(
    (employee: Employee) => {
      router.push(`/employees/${employee.id}`);
    },
    [router]
  );

  const handleEditEmployee = useCallback((employee: Employee) => {
    setEditEmployeeData(employee);
    setIsEmployeeDialogOpen(true);
  }, []);

  // Perbarui handleSaveEmployee untuk dispatch Redux thunk
  const handleSaveEmployee = useCallback(
    async (values: EmployeeFormValues) => {
      if (values.id) {
        // Jika ada ID, berarti ini mode edit
        const existingEmployee = allEmployees.find((e) => e.id === values.id);
        if (existingEmployee) {
          const fullUpdatedEmployee: Employee = {
            ...existingEmployee,
            ...values,
            tanggalLahir: values.tanggalLahir, // Pastikan Date object
            // tanggalBergabung: values.tanggalBergabung,
            updatedAt: new Date(),
          };
          await dispatch(updateEmployee(fullUpdatedEmployee));
        }
      } else {
        // Untuk membuat, langsung dispatch data form
        await dispatch(createEmployee(values));
      }
      setIsEmployeeDialogOpen(false); // Tutup dialog setelah operasi
      setEditEmployeeData(undefined); // Clear edit data
    },
    [dispatch, allEmployees]
  );

  // Perbarui handleDeleteEmployee untuk dispatch Redux thunk
  const handleDeleteEmployee = useCallback(
    async (employeeId: string) => {
      if (window.confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) {
        await dispatch(deleteEmployee(employeeId));
      }
    },
    [dispatch]
  );

  const employeeColumns: ColumnDef<Employee>[] = useMemo(
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
      { accessorKey: "id", header: "ID Karyawan" },
      { accessorKey: "name", header: "Nama Lengkap" },
      {
        accessorKey: "tanggalLahir",
        header: "Tgl. Lahir",
        cell: ({ row }) => {
          const date = row.original.tanggalLahir;
          if (date instanceof Date) {
            return format(date, "dd-MM-yyyy", { locale: localeId });
          }
          return "N/A";
        },
      },
      {
        accessorKey: "tanggalBergabung",
        header: "Tgl. Bergabung",
        cell: ({ row }) => {
          const date = row.original.tanggalBergabung;
          if (date instanceof Date) {
            return format(date, "dd-MM-yyyy", { locale: localeId });
          }
          return "N/A";
        },
      },
      { accessorKey: "phoneNumber", header: "No. Telepon" },
      { accessorKey: "email", header: "Email" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          let statusColor: string;
          switch (status) {
            case EmployeeStatus.ACTIVE:
              statusColor = "bg-green-100 text-green-800";
              break;
            case EmployeeStatus.INACTIVE:
              statusColor = "bg-red-100 text-red-800";
              break;
            case EmployeeStatus.ON_LEAVE:
              statusColor = "bg-yellow-100 text-yellow-800";
              break;
            case EmployeeStatus.TERMINATED:
              statusColor = "bg-gray-100 text-gray-800";
              break;
            default:
              statusColor = "bg-gray-50 text-gray-700";
          }
          return (
            <span
              className={`${statusColor} px-2 py-1 rounded-full text-xs font-semibold`}
            >
              {status.replace(/_/g, " ")}
            </span>
          );
        },
      },
      {
        accessorKey: "role",
        header: "Jabatan",
        cell: ({ row }) => {
          const role = row.original.role;
          return (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              {role.replace(/_/g, " ")}
            </span>
          );
        },
      },
      {
        accessorKey: "currentCompanyId",
        header: "Perusahaan",
        cell: ({ row }) => getCompanyNameById(row.original.currentCompanyId),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const employee = row.original;
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
                  onClick={() => handleDetailEmployee(employee)}
                >
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditEmployee(employee)}>
                  Edit Karyawan
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteEmployee(employee.id)}
                  className="text-red-600"
                >
                  Hapus Karyawan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [
      handleEditEmployee,
      handleDeleteEmployee,
      getCompanyNameById,
      handleDetailEmployee,
    ]
  );

  const filteredEmployees = useMemo(() => {
    let currentEmployees = allEmployees;

    // Filter berdasarkan tab (EmployeeStatus atau EmployeeRole)
    if (activeTab !== "all") {
      currentEmployees = currentEmployees.filter((employee) => {
        const lowerCaseActiveTab = activeTab.toLowerCase();
        // Cek berdasarkan EmployeeStatus
        if (
          Object.values(EmployeeStatus).some(
            (status) => status.toLowerCase() === lowerCaseActiveTab
          )
        ) {
          return employee.status.toLowerCase() === lowerCaseActiveTab;
        }
        // Cek berdasarkan EmployeeRole
        if (
          Object.values(EmployeeRole).some(
            (role) => role.toLowerCase() === lowerCaseActiveTab
          )
        ) {
          return employee.role.toLowerCase() === lowerCaseActiveTab;
        }
        return true; // Jika activeTab tidak cocok dengan Status atau Role, tidak ada filter spesifik
      });
    }

    // Filter berdasarkan search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentEmployees = currentEmployees.filter(
        (employee) =>
          Object.values(employee).some(
            (value) =>
              (typeof value === "string" &&
                value.toLowerCase().includes(lowerCaseQuery)) ||
              (value instanceof Date &&
                format(value, "dd-MM-yyyy", { locale: localeId })
                  .toLowerCase()
                  .includes(lowerCaseQuery)) ||
              (typeof value === "number" &&
                value.toString().includes(lowerCaseQuery))
          ) ||
          getCompanyNameById(employee.currentCompanyId)
            .toLowerCase()
            .includes(lowerCaseQuery)
      );
    }
    return currentEmployees;
  }, [allEmployees, activeTab, searchQuery, getCompanyNameById]);

  const employeeTabItems = useMemo(() => {
    const allCount = allEmployees.length;
    const tabItems = [{ value: "all", label: "Semua", count: allCount }];

    // Tambahkan tab untuk EmployeeStatus
    Object.values(EmployeeStatus).forEach((status) => {
      tabItems.push({
        value: status.toLowerCase(),
        label: status.replace(/_/g, " "),
        count: allEmployees.filter((e) => e.status === status).length,
      });
    });

    // Tambahkan tab untuk EmployeeRole
    Object.values(EmployeeRole).forEach((role) => {
      tabItems.push({
        value: role.toLowerCase(),
        label: role.replace(/_/g, " "),
        count: allEmployees.filter((e) => e.role === role).length,
      });
    });

    return tabItems;
  }, [allEmployees]);

  // Tampilkan status loading atau error
  if (employeeStatus === "loading") {
    return <div className="text-center py-8">Memuat data karyawan...</div>;
  }

  if (employeeStatus === "failed") {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {employeeError}
      </div>
    );
  }

  return (
    <TableMain<Employee>
      searchQuery={searchQuery}
      data={filteredEmployees}
      columns={employeeColumns}
      tabItems={employeeTabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showAddButton={true}
      showDownloadPrintButtons={true}
      emptyMessage="Tidak ada karyawan ditemukan."
      isDialogOpen={isEmployeeDialogOpen}
      onOpenChange={setIsEmployeeDialogOpen}
      dialogContent={
        <EmployeeDialog
          onClose={() => {
            setIsEmployeeDialogOpen(false);
            setEditEmployeeData(undefined); // Hapus data edit saat dialog ditutup
          }}
          onSubmit={handleSaveEmployee}
          initialData={editEmployeeData} // Teruskan data edit
        />
      }
      dialogTitle={editEmployeeData ? "Edit Karyawan" : "Tambah Karyawan Baru"}
      dialogDescription={
        editEmployeeData
          ? "Ubah detail karyawan ini."
          : "Isi detail karyawan untuk menambah data karyawan baru ke sistem."
      }
    />
  );
}
