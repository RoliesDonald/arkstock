// src/app/(admin)/(auth)/(main)/employees/[employeeId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchEmployeeById,
  updateEmployee,
} from "@/store/slices/employeeSlice";
import {
  Employee,
  EmployeeFormValues,
  EmployeeRole,
  EmployeeStatus,
} from "@/types/employee";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { fetchCompanies } from "@/store/slices/companySlice";
import { useToast } from "@/hooks/use-toast";
import EmployeeDialog from "@/components/dialog/employeeDialog/_component";

export default function EmployeeDetailPage() {
  const params = useParams();
  const employeeId = params.employeeId as string;
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const allEmployees = useAppSelector((state) => state.employee.employees);
  const employeeStatus = useAppSelector((state) => state.employee.status);
  const employeeError = useAppSelector((state) => state.employee.error);

  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] =
    useState<boolean>(false);
  const [editEmployeeData, setEditEmployeeData] = useState<
    Employee | undefined
  >(undefined);
  const [localEmployee, setLocalEmployee] = useState<Employee | undefined>(
    undefined
  );

  const employeeFromStore = allEmployees.find((emp) => emp.id === employeeId);

  useEffect(() => {
    if (employeeFromStore) {
      setLocalEmployee(employeeFromStore);
    } else if (employeeId && employeeStatus !== "loading") {
      dispatch(fetchEmployeeById(employeeId))
        .unwrap()
        .then((employee) => {
          setLocalEmployee(employee);
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.message || "Gagal memuat detail karyawan.",
            variant: "destructive",
          });
        });
    } else if (!employeeId) {
      toast({
        title: "Error",
        description: "ID karyawan tidak valid atau tidak ditemukan di URL.",
        variant: "destructive",
      });
      console.error("EmployeeDetailPage: employeeId is undefined or null.");
    }
    dispatch(fetchCompanies());
  }, [employeeId, employeeFromStore, dispatch, employeeStatus, toast]);

  const handleEditClick = useCallback(() => {
    if (localEmployee) {
      setEditEmployeeData(localEmployee);
      setIsEmployeeDialogOpen(true);
    }
  }, [localEmployee]);

  const handleSaveEmployee = useCallback(
    async (values: EmployeeFormValues) => {
      if (values.id) {
        try {
          await dispatch(updateEmployee(values)).unwrap();
          toast({
            title: "Sukses",
            description: "Karyawan berhasil diperbarui.",
          });
          dispatch(fetchEmployeeById(values.id));
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message || "Gagal memperbarui karyawan.",
            variant: "destructive",
          });
        }
      }
      setIsEmployeeDialogOpen(false);
      setEditEmployeeData(undefined);
    },
    [dispatch, toast]
  );

  const handleDialogClose = useCallback(() => {
    setIsEmployeeDialogOpen(false);
    setEditEmployeeData(undefined);
  }, []);

  if (employeeStatus === "loading" && !localEmployee) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Memuat detail karyawan...</p>
      </div>
    );
  }

  if (employeeStatus === "failed" && !localEmployee) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-red-500">Error: {employeeError}</p>
      </div>
    );
  }

  if (!localEmployee) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Karyawan tidak ditemukan.</p>
      </div>
    );
  }

  const displayEmployee = localEmployee;

  return (
    <div className="container mx-auto py-8 space-y-3 ">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              {displayEmployee.name}
            </CardTitle>
            <CardDescription className="text-arkBg-600">
              Detail Lengkap Karyawan
            </CardDescription>
          </div>
          <Button onClick={handleEditClick}>Edit Karyawan</Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">User ID</p>
              <p>: {displayEmployee.userId || "N/A"}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Email</p>
              <p>: {displayEmployee.email || "N/A"}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Telepon</p>
              <p>: {displayEmployee.phone || "N/A"}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Posisi</p>
              <p>: {displayEmployee.position || "N/A"}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Departemen</p>
              <p>: {displayEmployee.department || "N/A"}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Role</p>
              <p>
                :
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                  {displayEmployee.role.replace(/_/g, " ")}
                </span>
              </p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Status</p>
              <p>
                :
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${
                      displayEmployee.status === EmployeeStatus.ACTIVE
                        ? "bg-green-100 text-green-800"
                        : displayEmployee.status === EmployeeStatus.INACTIVE
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {displayEmployee.status?.replace(/_/g, " ")}
                </span>
              </p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Alamat</p>
              <p>: {displayEmployee.address || "N/A"}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Perusahaan</p>
              <p>: {displayEmployee.company?.companyName || "N/A"}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Tanggal Lahir</p>
              <p>
                :
                {displayEmployee.tanggalLahir
                  ? format(
                      new Date(displayEmployee.tanggalLahir),
                      "dd MMMM yyyy",
                      { locale: localeId }
                    )
                  : "N/A"}
              </p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Tanggal Bergabung</p>
              <p>
                :
                {displayEmployee.tanggalBergabung
                  ? format(
                      new Date(displayEmployee.tanggalBergabung),
                      "dd MMMM yyyy",
                      { locale: localeId }
                    )
                  : "N/A"}
              </p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Dibuat Pada</p>
              <p>
                :
                {format(
                  new Date(displayEmployee.createdAt),
                  "dd MMMM yyyy HH:mm",
                  { locale: localeId }
                )}
              </p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Di Update pada</p>
              <p>
                :
                {format(
                  new Date(displayEmployee.updatedAt),
                  "dd MMMM yyyy HH:mm",
                  { locale: localeId }
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="py-4 border-0 shadow-none">
        <CardContent>
          {isEmployeeDialogOpen && (
            <EmployeeDialog
              isOpen={isEmployeeDialogOpen}
              onClose={handleDialogClose}
              initialData={editEmployeeData}
              onSubmit={handleSaveEmployee}
              dialogTitle={
                editEmployeeData ? "Edit Karyawan" : "Tambahkan Karyawan Baru"
              }
              dialogDescription={
                editEmployeeData
                  ? "Edit detail karyawan yang sudah ada."
                  : "Isi detail karyawan untuk menambah data karyawan baru ke sistem."
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
