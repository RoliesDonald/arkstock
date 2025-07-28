// src/app/(main)/employee/page.tsx
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
import { Employee, RawEmployeeApiResponse } from "@/types/employee";
import { EmployeeFormValues } from "@/schemas/employee";
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
import { fetchEmployees, formatEmployeeDates } from "@/store/slices/employeeSlice";
import { api } from "@/lib/utils/api";
import Link from "next/link";
import EmployeeDialogWrapper from "@/components/dialog/employeeDialog/_component/EmployeeDialogWrapper";

interface EnumsApiResponse {
  SparePartCategory: string[];
  SparePartStatus: string[];
  PartVariant: string[];
  EmployeeRole: string[];
  EmployeeStatus: string[];
  Gender: string[];
  EmployeePosition: string[];
}

export default function EmployeeListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allEmployees = useAppSelector((state) => state.employee.employees);
  const loading = useAppSelector((state) => state.employee.status === "loading");
  const error = useAppSelector((state) => state.employee.error);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState<boolean>(false);
  const [editEmployeeData, setEditEmployeeData] = useState<Employee | undefined>(undefined);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | undefined>(undefined);

  const [enums, setEnums] = useState<EnumsApiResponse | null>(null);
  const [enumsLoading, setEnumsLoading] = useState<boolean>(true);
  const [enumsError, setEnumsError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchEmployees());

    const fetchEnums = async () => {
      try {
        const response = await fetch("/api/enums");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: EnumsApiResponse = await response.json();
        setEnums(data);
      } catch (err: any) {
        console.error("Failed to fetch enums:", err);
        setEnumsError(err.message || "Gagal mengambil data enum.");
        toast({
          title: "Error",
          description: "Gagal memuat filter kategori. Silakan coba lagi.",
          variant: "destructive",
        });
      } finally {
        setEnumsLoading(false);
      }
    };

    fetchEnums();
  }, [dispatch, toast]);

  // handleDetailEmployee tidak lagi diperlukan jika nama karyawan yang diklik
  // const handleDetailEmployee = useCallback(
  //   (employee: Employee) => {
  //     router.push(`/employee/${employee.id}`);
  //   },
  //   [router]
  // );

  const handleEditEmployee = useCallback((employee: Employee) => {
    setEditEmployeeData(employee);
    setIsEmployeeDialogOpen(true);
  }, []);

  const handleSubmitEmployee = useCallback(
    async (values: EmployeeFormValues) => {
      console.log("Submit Employee:", values);
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
        const url = `http://localhost:3000/api/employees${values.id ? `/${values.id}` : ""}`;

        let response;
        if (values.id) {
          response = await api.put<Employee | RawEmployeeApiResponse>(url, values, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<Employee | RawEmployeeApiResponse>(url, values, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Karyawan berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsEmployeeDialogOpen(false);
        setEditEmployeeData(undefined);
        dispatch(fetchEmployees());
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan karyawan.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteEmployee = useCallback(
    async (employeeId: string) => {
      console.log("Delete Employee ID:", employeeId);
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
        await api.delete(`http://localhost:3000/api/employees/${employeeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Karyawan berhasil dihapus.",
        });
        setEmployeeToDelete(undefined);
        dispatch(fetchEmployees());
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus karyawan.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const employeeColumns: ColumnDef<Employee>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                ? "indeterminate"
                : false
            }
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
      { accessorKey: "employeeId", header: "ID Karyawan" },
      {
        accessorKey: "name",
        header: "Nama",
        cell: ({ row }) => (
          <Link href={`/employee/${row.original.id}`} className="text-blue-600 hover:underline">
            {row.original.name}
          </Link>
        ),
      },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "phone", header: "Telepon" },
      { accessorKey: "position", header: "Jabatan" },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const role = row.original.role;
          return (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-800">
              {role?.replace(/_/g, " ")}
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
            case "ACTIVE":
              statusColor = "bg-green-500 text-white";
              break;
            case "INACTIVE":
              statusColor = "bg-red-500 text-white";
              break;
            case "ON_LEAVE":
              statusColor = "bg-yellow-500 text-black";
              break;
            case "TERMINATED":
              statusColor = "bg-gray-700 text-white";
              break;
            default:
              statusColor = "bg-gray-400 text-gray-800";
          }
          return (
            <span className={`${statusColor} px-2 py-1 rounded-full text-xs font-semibold`}>
              {status?.replace(/_/g, " ")}
            </span>
          );
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
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {/* KUNCI PERBAIKAN: Hapus DropdownMenuItem "Lihat Detail" */}
                {/* <DropdownMenuItem onClick={() => handleDetailEmployee(employee)}>
                  Lihat Detail
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => handleEditEmployee(employee)}>
                  Edit Karyawan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEmployeeToDelete(employee)} className="text-red-600">
                  Hapus Karyawan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleEditEmployee] // handleDetailEmployee dihapus dari dependencies
  );

  const employeeTabItems = useMemo(() => {
    if (!enums) return [];

    const roleTabs = enums.EmployeeRole.map((role) => ({
      value: role.toLowerCase(),
      label: role.replace(/_/g, " "),
      count: allEmployees.filter((emp) => emp.role === role).length,
    }));

    const statusTabs = enums.EmployeeStatus.map((status) => ({
      value: status.toLowerCase(),
      label: status.replace(/_/g, " "),
      count: allEmployees.filter((emp) => emp.status === status).length,
    }));

    const genderTabs = enums.Gender.map((gender) => ({
      value: gender.toLowerCase(),
      label: gender.replace(/_/g, " "),
      count: allEmployees.filter((emp) => emp.gender === gender).length,
    }));

    return [
      { value: "all", label: "All", count: allEmployees.length },
      ...roleTabs,
      ...statusTabs,
      ...genderTabs,
    ];
  }, [allEmployees, enums]);

  const filteredEmployees = useMemo(() => {
    let data = allEmployees;

    if (activeTab !== "all") {
      data = data.filter((employee) => {
        const lowerCaseActiveTab = activeTab.toLowerCase();

        if (enums?.EmployeeRole.some((r) => r.toLowerCase() === lowerCaseActiveTab)) {
          return employee.role.toLowerCase() === lowerCaseActiveTab;
        }
        if (enums?.EmployeeStatus.some((s) => s.toLowerCase() === lowerCaseActiveTab)) {
          return employee.status.toLowerCase() === lowerCaseActiveTab;
        }
        if (enums?.Gender.some((g) => g.toLowerCase() === lowerCaseActiveTab)) {
          return employee.gender.toLowerCase() === lowerCaseActiveTab;
        }
        return false;
      });
    }

    return data.filter(
      (employee) =>
        employee.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.department?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allEmployees, activeTab, searchQuery, enums]);

  const handleAddNewEmployeeClick = useCallback(() => {
    setEditEmployeeData(undefined);
    setIsEmployeeDialogOpen(true);
  }, []);

  const handleEmployeeDialogClose = useCallback(() => {
    setIsEmployeeDialogOpen(false);
    setEditEmployeeData(undefined);
  }, []);

  if (enumsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p>Memuat filter karyawan...</p>
      </div>
    );
  }

  if (enumsError) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-red-500">
        <p>Error memuat filter karyawan: {enumsError}</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto whitespace-nowrap max-w-full pb-2">
        <TableMain<Employee>
          searchQuery={searchQuery}
          data={filteredEmployees}
          columns={employeeColumns}
          tabItems={employeeTabItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showAddButton={true}
          onAddClick={handleAddNewEmployeeClick}
          showDownloadPrintButtons={true}
          emptyMessage={
            loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Karyawan ditemukan."
          }
        />
      </div>

      <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
        <EmployeeDialogWrapper
          onClose={handleEmployeeDialogClose}
          initialData={editEmployeeData}
          onSubmit={handleSubmitEmployee}
          enums={enums}
        />
      </Dialog>

      <AlertDialog open={!!employeeToDelete} onOpenChange={(open) => !open && setEmployeeToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus karyawan &quot;
              {employeeToDelete?.name}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEmployeeToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => employeeToDelete && handleDeleteEmployee(employeeToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
