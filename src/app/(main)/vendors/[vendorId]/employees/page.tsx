// src/app/(main)/employees/page.tsx
"use client";

import TableMain from "@/components/common/table/TableMain";
// Hapus import userData dari "@/lib/sampleTableData"
// Gunakan data karyawan dari "@/data/sampleEmployeeData"
import { employeeData as initialEmployeeData } from "@/data/sampleEmployeeData"; // <-- Import data karyawan dummy
import { useAppSelector } from "@/store/hooks";
import { User, UserStatus, UserRole } from "@/types/user"; // Mungkin perlu diperbaiki/disesuaikan dengan UserRole di types/employee
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { format } from "date-fns"; // Untuk format tanggal di kolom
import { id } from "date-fns/locale"; // Untuk locale Indonesia

// IMPOR KOMPONEN DIALOG KARYAWAN DAN TIPE TERKAIT
import {
  Employee,
  EmployeeFormValues,
  EmployeeStatus as EmployeeStatusEnum,
  EmployeeRole as EmployeeRoleEnum,
} from "@/types/employee"; // Sesuaikan jika ada konflik nama enum

// Untuk generate UUID baru
import { v4 as uuidv4 } from "uuid";
import EmployeeDialog from "@/components/dialog/employeeDialog/_component";

export default function EmployeePage() {
  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  // Gunakan state allEmployees sebagai ganti allUsers
  const [allEmployees, setAllEmployees] =
    useState<Employee[]>(initialEmployeeData);
  // Pastikan activeTab cocok dengan nilai tab di bawah
  const [activeTab, setActiveTab] = useState<string>("all");
  // Ganti isNewWoDialogOpen menjadi isEmployeeDialogOpen
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);

  // Perbaiki kolom agar sesuai dengan tipe Employee
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
      { accessorKey: "name", header: "Nama" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "phoneNumber", header: "Telepon" }, // Perbaiki nama kolom
      { accessorKey: "position", header: "Jabatan" }, // Perbaiki nama kolom
      {
        accessorKey: "role",
        header: "Peran",
        cell: ({ row }) => row.original.role.replace(/_/g, " "), // Format ROLE agar lebih mudah dibaca
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          let statusColor = "";
          switch (status) {
            case EmployeeStatusEnum.ACTIVE: // Gunakan enum dari types/employee
              statusColor = "bg-green-100 text-green-800";
              break;
            case EmployeeStatusEnum.ON_LEAVE:
              statusColor = "bg-yellow-100 text-yellow-800";
              break;
            case EmployeeStatusEnum.INACTIVE:
              statusColor = "bg-red-100 text-red-800";
              break;
            case EmployeeStatusEnum.TERMINATED:
              statusColor = "bg-gray-100 text-gray-800";
              break;
            default:
              statusColor = "bg-gray-100 text-gray-700";
          }
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}
            >
              {status.replace(/_/g, " ")}
            </span>
          );
        },
      },
      // {
      //   accessorKey: "tanggalLahir",
      //   header: "Tgl. Lahir",
      //   cell: ({ row }) => {
      //     const date = row.original.tanggalLahir;
      //     return format(date, "dd MMM yyyy", { locale: id });
      //   },
      // },
      {
        accessorKey: "tanggalBergabung",
        header: "Tgl. Bergabung",
        cell: ({ row }) => {
          const date = row.original.tanggalBergabung;
          return date ? format(date, "dd MMM yyyy", { locale: id }) : "-";
        },
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
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => alert(`Lihat Karyawan ${employee.name}`)}
                >
                  Lihat Karyawan
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => alert(`Edit Karyawan ${employee.name}`)}
                >
                  Edit Karyawan
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => alert(`Hapus Karyawan ${employee.name}`)}
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
    []
  );

  // Data yang difilter berdasarkan tab dan search query
  const filteredEmployees = useMemo(() => {
    let currentEmployees = allEmployees;

    if (activeTab !== "all") {
      currentEmployees = currentEmployees.filter((emp) => {
        // Filter berdasarkan EmployeeStatusEnum
        if (
          Object.values(EmployeeStatusEnum).some(
            (s) => s.toLowerCase() === activeTab
          )
        ) {
          return emp.status.toLowerCase() === activeTab;
        }
        // Filter berdasarkan EmployeeRoleEnum (jika Anda ingin tab berdasarkan role juga)
        if (
          Object.values(EmployeeRoleEnum).some(
            (r) => r.toLowerCase() === activeTab
          )
        ) {
          return emp.role.toLowerCase() === activeTab;
        }
        return true;
      });
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentEmployees = currentEmployees.filter((emp) =>
        Object.values(emp).some(
          (value) =>
            (typeof value === "string" &&
              value.toLowerCase().includes(lowerCaseQuery)) ||
            (value instanceof Date &&
              format(value, "dd-MM-yyyy").includes(lowerCaseQuery)) || // Pencarian tanggal
            (typeof value === "number" &&
              value.toString().includes(lowerCaseQuery))
        )
      );
    }
    return currentEmployees;
  }, [allEmployees, activeTab, searchQuery]);

  const employeeTabItems = useMemo(() => {
    const allCount = allEmployees.length;
    const tabItems = [{ value: "all", label: "All", count: allCount }];

    // Tambahkan tab untuk setiap EmployeeStatus
    Object.values(EmployeeStatusEnum).forEach((status) => {
      tabItems.push({
        value: status.toLowerCase(),
        label: status.replace(/_/g, " "),
        count: allEmployees.filter((emp) => emp.status === status).length,
      });
    });

    // Tambahkan tab untuk setiap EmployeeRole (opsional, jika Anda ingin)
    Object.values(EmployeeRoleEnum).forEach((role) => {
      tabItems.push({
        value: role.toLowerCase(),
        label: role.replace(/_/g, " "),
        count: allEmployees.filter((emp) => emp.role === role).length,
      });
    });

    return tabItems;
  }, [allEmployees]);

  // Fungsi untuk menangani submit dari EmployeeDialogComponent
  const handleAddEmployeeSubmit = (values: EmployeeFormValues) => {
    const newEmployee: Employee = {
      ...values,
      id: uuidv4(), // Generate UUID baru
      createdAt: new Date(),
      updatedAt: new Date(),
      // Pastikan properti opsional yang null dari form tetap null atau undefined sesuai interface Employee
      email: values.email || null,
      tanggalBergabung: values.tanggalBergabung || null,
    };
    setAllEmployees((prev) => [...prev, newEmployee]); // Tambahkan karyawan baru ke state
    setIsEmployeeDialogOpen(false); // Tutup dialog
    alert("Karyawan berhasil ditambahkan!");
  };

  const handleDialogClose = () => {
    setIsEmployeeDialogOpen(false);
  };

  return (
    <TableMain<Employee> // Ganti User menjadi Employee
      searchQuery={searchQuery}
      data={filteredEmployees} // Gunakan filteredEmployees
      columns={employeeColumns} // Gunakan employeeColumns
      tabItems={employeeTabItems} // Gunakan employeeTabItems
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showAddButton={true}
      showDownloadPrintButtons={true}
      emptyMessage="Tidak ada karyawan ditemukan." // Pesan kosong yang relevan
      isDialogOpen={isEmployeeDialogOpen} // Gunakan state yang benar
      onOpenChange={setIsEmployeeDialogOpen} // Gunakan state yang benar
      dialogContent={
        <EmployeeDialog
          onSubmit={handleAddEmployeeSubmit}
          onClose={handleDialogClose}
        />
      }
      dialogTitle="Tambah Karyawan Baru" // Judul dialog yang relevan
      dialogDescription="Isi detail karyawan untuk menambah data karyawan baru ke sistem." // Deskripsi dialog yang relevan
    />
  );
}
