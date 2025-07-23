"use client";

import TableMain from "@/components/common/table/TableMain";
// import EmployeeDialog from "@/components/dialog/employeeDialog/EmployeeDialog"; // Hapus import ini
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
import { fetchCompanies } from "@/store/slices/companySlice"; 
import { EmployeeStatus, EmployeeRole, Gender } from "@prisma/client"; 
import { api } from "@/lib/utils/api"; 
import { EmployeeFormValues } from "@/schemas/employee";
import EmDialogWrapper from "@/components/dialog/employeeDialog/_component/EmDialogWrapper";

export default function EmployeeListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allEmployees = useAppSelector((state) => state.employee.employees);
  const loading = useAppSelector((state) => state.employee.status === 'loading');
  const error = useAppSelector((state) => state.employee.error);

  const allCompanies = useAppSelector((state) => state.companies.companies);
  const companyStatus = useAppSelector((state) => state.companies.status);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState<boolean>(false);
  const [editEmployeeData, setEditEmployeeData] = useState<Employee | undefined>(undefined);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchCompanies()); 
  }, [dispatch]);

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
        const method = values.id ? 'PUT' : 'POST';
        const url = values.id ? `http://localhost:3000/api/employees/${values.id}` : 'http://localhost:3000/api/employees';
        
        const payload = { ...values };
        if (!values.password) {
            delete payload.password; 
        }

        const response = await api.post<Employee | RawEmployeeApiResponse>(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

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
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
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
      { accessorKey: "employeeId", header: "ID Karyawan" },
      { accessorKey: "name", header: "Nama" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "phone", header: "Telepon" },
      { accessorKey: "position", header: "Posisi" },
      { accessorKey: "department", header: "Departemen" },
      {
        accessorKey: "gender", 
        header: "Jenis Kelamin",
        cell: ({ row }) => {
          const gender = row.original.gender;
          let genderColor: string;
          switch (gender) {
            case Gender.MALE:
              genderColor = "bg-blue-200 text-blue-800";
              break;
            case Gender.FEMALE:
              genderColor = "bg-pink-200 text-pink-800";
              break;
            default:
              genderColor = "bg-gray-200 text-gray-800";
          }
          return (
            <span className={`${genderColor} px-2 py-1 rounded-full text-xs font-semibold`}>{gender}</span>
          );
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const role = row.original.role;
          let roleColor: string;
          switch (role) {
            case EmployeeRole.ADMIN:
              roleColor = "bg-red-200 text-red-800";
              break;
            case EmployeeRole.SERVICE_MANAGER:
              roleColor = "bg-blue-200 text-blue-800";
              break;
            case EmployeeRole.MECHANIC:
              roleColor = "bg-green-200 text-green-800";
              break;
            case EmployeeRole.USER:
              roleColor = "bg-gray-200 text-gray-800";
              break;
            default:
              roleColor = "bg-gray-400 text-gray-800";
          }
          return (
            <span className={`${roleColor} px-2 py-1 rounded-full text-xs font-semibold`}>{role}</span>
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
            <span className={`${statusColor} px-2 py-1 rounded-full text-xs font-semibold`}>{status}</span>
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
                <DropdownMenuItem onClick={() => handleDetailEmployee(employee)}>
                  Lihat Detail
                </DropdownMenuItem>
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
    [handleDetailEmployee, handleEditEmployee]
  );

  const employeeTabItems = useMemo(() => {
    return [
      { value: "all", label: "All", count: allEmployees.length },
      {
        value: EmployeeStatus.ACTIVE.toLowerCase(),
        label: "Aktif",
        count: allEmployees.filter((emp) => emp.status === EmployeeStatus.ACTIVE).length,
      },
      {
        value: EmployeeStatus.INACTIVE.toLowerCase(),
        label: "Tidak Aktif",
        count: allEmployees.filter((emp) => emp.status === EmployeeStatus.INACTIVE).length,
      },
      {
        value: EmployeeStatus.ON_LEAVE.toLowerCase(),
        label: "Cuti",
        count: allEmployees.filter((emp) => emp.status === EmployeeStatus.ON_LEAVE).length,
      },
      {
        value: EmployeeStatus.TERMINATED.toLowerCase(),
        label: "Diberhentikan",
        count: allEmployees.filter((emp) => emp.status === EmployeeStatus.TERMINATED).length,
      },
      {
        value: EmployeeRole.ADMIN.toLowerCase(),
        label: "Admin",
        count: allEmployees.filter((emp) => emp.role === EmployeeRole.ADMIN).length,
      },
      {
        value: EmployeeRole.SERVICE_MANAGER.toLowerCase(),
        label: "Manager",
        count: allEmployees.filter((emp) => emp.role === EmployeeRole.SERVICE_MANAGER).length,
      },
      {
        value: EmployeeRole.MECHANIC.toLowerCase(),
        label: "Staff",
        count: allEmployees.filter((emp) => emp.role === EmployeeRole.MECHANIC).length,
      },
      {
        value: EmployeeRole.USER.toLowerCase(),
        label: "User",
        count: allEmployees.filter((emp) => emp.role === EmployeeRole.USER).length,
      },
      { 
        value: Gender.MALE.toLowerCase(),
        label: "Pria",
        count: allEmployees.filter((emp) => emp.gender === Gender.MALE).length,
      },
      { 
        value: Gender.FEMALE.toLowerCase(),
        label: "Wanita",
        count: allEmployees.filter((emp) => emp.gender === Gender.FEMALE).length,
      },
    ];
  }, [allEmployees]);

  const filteredEmployees = useMemo(() => {
    let data = allEmployees;

    if (activeTab !== "all") {
      data = data.filter((employee) => {
        const lowerCaseActiveTab = activeTab.toLowerCase();
        // Cek berdasarkan status
        if (Object.values(EmployeeStatus).some(s => s.toLowerCase() === lowerCaseActiveTab)) {
          return employee.status.toLowerCase() === lowerCaseActiveTab;
        }
        // Cek berdasarkan role
        if (Object.values(EmployeeRole).some(r => r.toLowerCase() === lowerCaseActiveTab)) {
          return employee.role.toLowerCase() === lowerCaseActiveTab;
        }
        // Cek berdasarkan gender
        if (Object.values(Gender).some(g => g.toLowerCase() === lowerCaseActiveTab)) { 
          return employee.gender.toLowerCase() === lowerCaseActiveTab;
        }
        return false;
      });
    }

    return data.filter((employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (employee.email && employee.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (employee.phone && employee.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (employee.position && employee.position.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (employee.department && employee.department.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allEmployees, activeTab, searchQuery]);

  const handleAddNewEmployeeClick = useCallback(() => {
    setEditEmployeeData(undefined);
    setIsEmployeeDialogOpen(true);
  }, []);

  const handleEmployeeDialogClose = useCallback(() => {
    setIsEmployeeDialogOpen(false);
    setEditEmployeeData(undefined);
  }, []);

  return (
    <>
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

      <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
        <EmDialogWrapper
          onClose={handleEmployeeDialogClose}
          initialData={editEmployeeData}
          onSubmit={handleSubmitEmployee}
          companies={allCompanies} 
          companyStatus={companyStatus} 
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
