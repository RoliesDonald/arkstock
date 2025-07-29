"use client";

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EmployeeForm from "./EmployeeDialog";
import { Employee, EmployeeFormValues } from "@/schemas/employee";
import { EnumsApiResponse } from "@/app/(main)/employees/page";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/utils/api";
import { useAppSelector } from "@/store/hooks";
import { format } from "date-fns";

interface EmployeeDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: EmployeeFormValues) => void;
  initialData?: Employee;
  enums: EnumsApiResponse | null;
}

const toRoman = (num: number): string => {
  if (num < 1 || num > 12) return String(num);
  const numerals = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
    8: "VIII",
    9: "IX",
    10: "X",
    11: "XI",
    12: "XII",
  };
  return numerals[num as keyof typeof numerals];
};

export default function EmployeeDialogWrapper({
  onClose,
  initialData,
  onSubmit,
  enums,
}: EmployeeDialogWrapperProps) {
  const { toast } = useToast();
  const allEmployees = useAppSelector((state) => state.employee.employees);
  const [generatedEmployeeId, setGeneratedEmployeeId] = useState<string | undefined>(undefined);
  const [companyNamePrefix, setCompanyNamePrefix] = useState<string | undefined>(undefined);
  const [loadingCompany, setLoadingCompany] = useState<boolean>(true);
  const [currentCompanyId, setCurrentCompanyId] = useState<string | undefined>(undefined);

  const getCompanyPrefix = useCallback(
    async (companyId: string) => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          toast({
            title: "Error",
            description: "Tidak ada token otentikasi. Silakan login kembali.",
            variant: "destructive",
          });
          return null;
        }

        const url = `/api/companies/${companyId}`; // URL yang akan dipanggil
        console.log(`Attempting to fetch company from: ${url}`); // LOGGING: URL yang dipanggil

        const response = await api.get<{ companyName: string }>(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Company API Response:", response); // LOGGING: Respons dari API

        const companyName = response.companyName;
        const cleanName = companyName.replace(/^(PT\.|CV\.|UD\.)\s*/i, "").trim();
        return cleanName.substring(0, 3).toUpperCase();
      } catch (error: any) {
        console.error("Failed to fetch company name:", error);
        // KRUSIAL: Tambahkan logging detail error HTTP jika ada
        if (error.response) {
          console.error("Error response status:", error.response.status);
          console.error("Error response data:", error.response.data);
        }
        toast({
          title: "Error",
          description: "Gagal mengambil nama perusahaan untuk ID karyawan.",
          variant: "destructive",
        });
        return null;
      }
    },
    [toast]
  );

  useEffect(() => {
    const initializeCompanyAndGenerateId = async () => {
      setLoadingCompany(true);
      try {
        let resolvedCompanyId: string | undefined;

        if (initialData) {
          resolvedCompanyId = initialData.companyId;
          setGeneratedEmployeeId(initialData.employeeId || undefined);
          setCompanyNamePrefix(
            initialData.company?.companyName
              ? initialData.company.companyName
                  .replace(/^(PT\.|CV\.|UD\.)\s*/i, "")
                  .trim()
                  .substring(0, 3)
                  .toUpperCase()
              : undefined
          );
        } else {
          // KRUSIAL: Pastikan ID perusahaan ini benar-benar ada di database Anda
          resolvedCompanyId = allEmployees.length > 0 ? allEmployees[0].companyId : "ARKSTOK-MAIN-001";

          if (resolvedCompanyId) {
            const prefix = await getCompanyPrefix(resolvedCompanyId);
            setCompanyNamePrefix(prefix || "XXX");

            const lastEmployeeNumber = allEmployees.length;
            const nextEmployeeNumber = (lastEmployeeNumber + 1).toString().padStart(6, "0");

            const joinDate = new Date();
            const romanMonth = toRoman(joinDate.getMonth() + 1);
            const year = joinDate.getFullYear();

            const newEmployeeId = `${nextEmployeeNumber}/${prefix || "XXX"}/${romanMonth}/${year}`;
            setGeneratedEmployeeId(newEmployeeId);
          } else {
            setGeneratedEmployeeId("ID_GENERATION_FAILED");
            toast({
              title: "Error",
              description: "Tidak dapat menentukan ID perusahaan untuk generasi ID karyawan.",
              variant: "destructive",
            });
          }
        }
        setCurrentCompanyId(resolvedCompanyId);
      } finally {
        setLoadingCompany(false);
      }
    };

    initializeCompanyAndGenerateId();
  }, [initialData, allEmployees, getCompanyPrefix, toast]);

  const handleSubmit = useCallback(
    (values: EmployeeFormValues) => {
      const payload: EmployeeFormValues = {
        ...values,
        companyId: currentCompanyId,
        employeeId: !initialData && generatedEmployeeId ? generatedEmployeeId : values.employeeId,
        email: values.email === "" ? null : values.email,
        photo: values.photo === "" ? null : values.photo,
        phone: values.phone === "" ? null : values.phone,
        address: values.address === "" ? null : values.address,
        department: values.department === "" ? null : values.department,
        gender: values.gender === "" ? null : values.gender,
        password: values.password === "" ? null : values.password,
      };
      onSubmit(payload);
    },
    [initialData, generatedEmployeeId, onSubmit, currentCompanyId]
  );

  return (
    <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Karyawan" : "Tambah Karyawan Baru"}</DialogTitle>
        <DialogDescription>
          {initialData
            ? "Perbarui detail karyawan."
            : "Isi detail untuk menambahkan karyawan baru ke sistem."}
        </DialogDescription>
      </DialogHeader>
      {loadingCompany ? (
        <div className="flex justify-center items-center h-40">Memuat data perusahaan...</div>
      ) : (
        <EmployeeForm
          onClose={onClose}
          initialData={initialData}
          onSubmit={handleSubmit}
          enums={enums}
          generatedEmployeeId={generatedEmployeeId}
          companyNamePrefix={companyNamePrefix}
        />
      )}
    </DialogContent>
  );
}
