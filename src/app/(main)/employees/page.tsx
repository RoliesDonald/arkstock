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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  Employee,
  EmployeeFormValues,
  EmployeeRole,
  EmployeeStatus,
} from "@/types/employee";
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
import {
  createEmployee,
  deleteEmployee,
  fetchEmployees,
  updateEmployee,
} from "@/store/slices/employeeSlice";
import { fetchCompanies } from "@/store/slices/companySlice";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import EmployeeDialog from "@/components/dialog/employeeDialog/_component";

export default function EmployeeListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allEmployees = useAppSelector((state) => state.employee.employees);
  const employeeStatus = useAppSelector((state) => state.employee.status);
  const employeeError = useAppSelector((state) => state.employee.error);

  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] =
    useState<boolean>(false);
  const [editEmployeeData, setEditEmployeeData] = useState<
    Employee | undefined
  >(undefined);
  const [employeeToDelete, setEmployeeToDelete] = useState<
    Employee | undefined
  >(undefined);

  useEffect(() => {
    if (employeeStatus === "idle") {
      dispatch(fetchEmployees());
    }
    dispatch(fetchCompanies());
  }, [dispatch, employeeStatus]);

  const handleDetailEmployee = useCallback(
    (employee: Employee) => {
      if (employee.id) {
        router.push(`/employees/${employee.id}`);
      } else {
        toast({
          title: "Error Navigasi",
          description: "ID karyawan tidak ditemukan untuk navigasi.",
          variant: "destructive",
        });
        console.error("Navigasi dibatalkan: ID karyawan undefined.", employee);
      }
    },
    [router, toast]
  );

  const handleAddEmployee = useCallback(() => {
    setEditEmployeeData(undefined);
    setIsEmployeeDialogOpen(true);
  }, []);

  const handleEditEmployee = useCallback((employee: Employee) => {
    setEditEmployeeData(employee);
    setIsEmployeeDialogOpen(true);
  }, []);

  const handleSubmitEmployee = useCallback(
    async (values: EmployeeFormValues) => {
      try {
        if (values.id) {
          await dispatch(updateEmployee(values)).unwrap();
          toast({
            title: "Sukses",
            description: "Karyawan berhasil diperbarui.",
          });
        } else {
          await dispatch(createEmployee(values)).unwrap();
          toast({
            title: "Sukses",
            description: "Karyawan baru berhasil ditambahkan.",
          });
        }
        setIsEmployeeDialogOpen(false);
        setEditEmployeeData(undefined);
        dispatch(fetchEmployees());
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast]
  );

  const handleDeleteEmployee = useCallback(
    async (employeeId: string) => {
      try {
        await dispatch(deleteEmployee(employeeId)).unwrap();
        toast({
          title: "Sukses",
          description: "Karyawan berhasil dihapus.",
        });
        dispatch(fetchEmployees());
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus.",
          variant: "destructive",
        });
      } finally {
        setEmployeeToDelete(undefined);
      }
    },
    [dispatch, toast]
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
      { accessorKey: "userId", header: "User ID" },
      { accessorKey: "name", header: "Nama" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "phone", header: "Telepon" },
      { accessorKey: "position", header: "Posisi" },
      { accessorKey: "department", header: "Departemen" },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            {row.original.role.replace(/_/g, " ")}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          let statusColor: string;
          switch (status) {
            case EmployeeStatus.ACTIVE:
              statusColor = "bg-green-500 text-white";
              break;
            case EmployeeStatus.INACTIVE:
              statusColor = "bg-red-500 text-white";
              break;
            case EmployeeStatus.ON_LEAVE:
              statusColor = "bg-yellow-500 text-black";
              break;
            case EmployeeStatus.TERMINATED:
              statusColor = "bg-gray-700 text-white";
              break;
            default:
              statusColor = "bg-gray-400 text-gray-800";
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
        accessorKey: "company.companyName",
        header: "Perusahaan",
        cell: ({ row }) => row.original.company?.companyName || "N/A",
      },
      {
        id: "createdAtFormatted", // Menggunakan ID unik
        header: "Dibuat Pada",
        cell: ({ row }) => {
          const createdAt = row.original.createdAt;
          return createdAt
            ? format(new Date(createdAt), "dd MMM yyyy HH:mm", {
                locale: localeId,
              })
            : "N/A";
        },
      },
      {
        id: "updatedAtFormatted", // Menggunakan ID unik
        header: "Diupdate Pada",
        cell: ({ row }) => {
          const updatedAt = row.original.updatedAt;
          return updatedAt
            ? format(new Date(updatedAt), "dd MMM yyyy HH:mm", {
                locale: localeId,
              })
            : "N/A";
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
                  <span className="sr-only">Buka Menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => handleDetailEmployee(employee)}
                >
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditEmployee(employee)}>
                  Edit Karyawan
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setEmployeeToDelete(employee)}
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
    [handleDetailEmployee, handleEditEmployee]
  );

  const filteredEmployees = useMemo(() => {
    return allEmployees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.userId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.department?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allEmployees, searchQuery]);

  return (
    <>
      <TableMain<Employee>
        searchQuery={searchQuery}
        data={filteredEmployees}
        columns={employeeColumns}
        showAddButton={true}
        onAddButtonClick={handleAddEmployee}
        showDownloadPrintButtons={true}
        emptyMessage={
          employeeStatus === "loading"
            ? "Memuat data..."
            : employeeError
            ? `Error: ${employeeError}`
            : "Tidak ada Karyawan ditemukan."
        }
        isDialogOpen={isEmployeeDialogOpen}
        onOpenChange={(open) => {
          setIsEmployeeDialogOpen(open);
          if (!open) {
            setEditEmployeeData(undefined);
          }
        }}
        dialogContent={
          <EmployeeDialog
            isOpen={isEmployeeDialogOpen}
            onClose={() => {
              setIsEmployeeDialogOpen(false);
              setEditEmployeeData(undefined);
            }}
            initialData={editEmployeeData}
            onSubmit={handleSubmitEmployee}
            dialogTitle={
              editEmployeeData ? "Edit Karyawan" : "Tambahkan Karyawan Baru"
            }
            dialogDescription={
              editEmployeeData
                ? "Edit detail karyawan yang sudah ada."
                : "Isi detail karyawan untuk menambah data karyawan baru ke sistem."
            }
          />
        }
        dialogTitle={
          editEmployeeData ? "Edit Karyawan" : "Tambahkan Karyawan Baru"
        }
        dialogDescription={
          editEmployeeData
            ? "Edit detail karyawan yang sudah ada."
            : "Isi detail karyawan untuk menambah data karyawan baru ke sistem."
        }
      />

      <AlertDialog
        open={!!employeeToDelete}
        onOpenChange={(open) => !open && setEmployeeToDelete(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus karyawan &quot;
              {employeeToDelete?.name}&quot;? Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEmployeeToDelete(undefined)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                employeeToDelete && handleDeleteEmployee(employeeToDelete.id)
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
