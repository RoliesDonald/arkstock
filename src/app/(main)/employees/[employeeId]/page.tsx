"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCompanies } from "@/store/slices/companySlice";
import { fetchEmployees, updateEmployee } from "@/store/slices/employeeSlice";
import { Company } from "@/types/companies";
import { Employee, EmployeeFormValues, EmployeeStatus } from "@/types/employee";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import EmployeeDialog from "@/components/dialog/employeeDialog/_component";

export default function EmployeeDetailPage() {
  const params = useParams();
  const employeeId = params.employeeId as string;
  const dispatch = useAppDispatch();

  //get data karyawan
  const allEmployees = useAppSelector((state) => state.employee.employees);
  const employeeStatus = useAppSelector((state) => state.employee.status);
  const employeeError = useAppSelector((state) => state.employee.error);

  //get data perusahaan
  const allCompanies = useAppSelector((state) => state.companies.companies);
  const companyStatus = useAppSelector((state) => state.companies.status);

  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] =
    useState<boolean>(false);
  const [editEmployeeData, setEditEmployeeData] = useState<
    Employee | undefined
  >(undefined);

  const currentEmployees = allEmployees.find((emp) => emp.id === employeeId);

  useEffect(() => {
    if (employeeStatus === "idle") {
      dispatch(fetchEmployees());
    }
    if (companyStatus === "idle") {
      dispatch(fetchCompanies());
    }
  }, [dispatch, employeeStatus, companyStatus]);

  const getCompanyNameById = useCallback(
    (companyId: string | null | undefined) => {
      if (!companyId) {
        return "N/A";
      }
      const company = allCompanies.find((co: Company) => co.id === companyId);
      return company ? company.companyName : "N/A";
    },
    [allCompanies]
  );

  const handleEditClick = useCallback(() => {
    if (currentEmployees) {
      setEditEmployeeData(currentEmployees);
      setIsEmployeeDialogOpen(true);
    }
  }, [currentEmployees]);

  const handleSaveEmployee = useCallback(
    async (values: EmployeeFormValues) => {
      if (values.id) {
        const existingEmployee = allEmployees.find((em) => em.id === values.id);
        if (existingEmployee) {
          const fullUpdatedEmployee: Employee = {
            ...existingEmployee,
            ...values,
            tanggalLahir: values.tanggalLahir,
            tanggalBergabung: values.tanggalBergabung || null,
            email: values.email || null,
            currentCompanyId: values.currentCompanyId || null,
            updatedAt: new Date(),
          };
          await dispatch(updateEmployee(fullUpdatedEmployee));
        }
      }
      setIsEmployeeDialogOpen(false);
      setEditEmployeeData(undefined);
    },
    [dispatch, allEmployees]
  );
  const hanldeDialogClose = useCallback(() => {
    setIsEmployeeDialogOpen(false);
    setEditEmployeeData(undefined);
  }, []);

  if (employeeStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-arkBg-600">Loading ... detail karyawan</p>
      </div>
    );
  }
  if (employeeStatus === "failed") {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-arkRed-500">Error: {employeeError}</p>
      </div>
    );
  }
  if (!currentEmployees) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-arkBg-600">Karyawan tidak ditemukan.</p>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-4 space-y-5">
      <Card>
        <CardHeader className="text-3xl flex-row items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold text-arkBg-600">
              {currentEmployees.name}
            </CardTitle>
            <CardDescription className="text-gray-400 text-[1rem]">
              Detail Karyawan
            </CardDescription>
          </div>
          <Button
            onClick={handleEditClick}
            className="bg-arkOrange-500 text-arkBg-700 font-semibold"
          >
            Edit Detail Karyawan
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
          <div className="space-y-4">
            <p>
              <strong className="text-arkBg-600 mr-2">Jabatan : </strong>
              {currentEmployees.position}
            </p>

            <p>
              <strong className="text-arkBg-600 mr-2">Status : </strong>
              <span
                className={`x-2 py-1 rounded-full text-sm font-semibold p-2
              ${
                currentEmployees.status === EmployeeStatus.ACTIVE
                  ? "bg-arkGreen-100 text-arkGreen-800"
                  : currentEmployees.status === EmployeeStatus.ON_LEAVE
                  ? "bg-arkYellow-100 text-arkYellow-800"
                  : currentEmployees.status === EmployeeStatus.INACTIVE
                  ? "bg-arkRed-100 text-arkRed-800"
                  : "bg-arkBg-100 text-arkBg-800"
              }`}
              >
                {currentEmployees.status.replace(/_/g, "")}
              </span>
            </p>
            <p>
              <strong className="text-arkBg-600 mr-2">Email :</strong>
              {currentEmployees.email || "N/A"}
            </p>
            <p>
              <strong className="text-arkBg-600 mr-2">No. Telepon :</strong>
              {currentEmployees.phoneNumber}
            </p>
            <p>
              <strong className="text-arkBg-600 mr-2">Alamat : </strong>
              {currentEmployees.address}
            </p>
          </div>
          <div className="space-y-4 ">
            <p>
              <strong className="text-arkBg-600 mr-2">Tanggal Lahir :</strong>
              {format(currentEmployees.tanggalLahir, "dd-MM-yyyy", {
                locale: localeId,
              })}
            </p>
            <p>
              <strong className="text-arkBg-600 mr-2">
                Tanggal Bergabung :
              </strong>{" "}
              {currentEmployees.tanggalBergabung
                ? format(currentEmployees.tanggalBergabung, "dd-MM-yyyy", {
                    locale: localeId,
                  })
                : "N/A"}
            </p>
            <p>
              <strong className="text-arkBg-600 mr-2">Perusahaan :</strong>
              {getCompanyNameById(currentEmployees.currentCompanyId)}
            </p>
            <p>
              <strong className="text-arkBg-600 mr-2">Dibuat Pada : </strong>
              {format(currentEmployees.createdAt, "dd-MM-yyyy HH:mm", {
                locale: localeId,
              })}
            </p>
            <p>
              <strong className="text-arkBg-600 mr-2">
                Terakhir diperbaharui :
              </strong>
              {format(currentEmployees.updatedAt, "dd-MM-yyyy HH:mm", {
                locale: localeId,
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {isEmployeeDialogOpen && (
            <EmployeeDialog
              onSubmit={() => {}}
              onClose={hanldeDialogClose}
              initialData={editEmployeeData}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
