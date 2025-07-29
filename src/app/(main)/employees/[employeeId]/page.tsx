// src/app/(main)/employees/[employeeId]/page.tsx
// Ini adalah komponen halaman detail karyawan untuk Next.js App Router (Server Component).

import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import BackButton from "./_components/backButton";

const prisma = new PrismaClient();

interface EmployeeDetailPageProps {
  params: {
    employeeId: string; // Ini adalah ID UUID dari URL (id utama), bukan ID kustom
  };
}

export default async function EmployeeDetailPage({ params }: EmployeeDetailPageProps) {
  const { employeeId } = params; // employeeId di sini adalah UUID dari URL

  const employee = await prisma.employee.findUnique({
    where: {
      id: employeeId, // Cari berdasarkan ID UUID
    },
    include: {
      company: true,
    },
  });

  if (!employee) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-3xl mx-auto rounded-lg shadow-lg dark:bg-gray-800 dark:text-gray-100">
        <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Detail Karyawan
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
            Informasi lengkap mengenai {employee.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {employee.photo && (
            <div className="flex justify-center mb-6">
              <Image
                src={employee.photo}
                alt={`Foto ${employee.name}`}
                width={150}
                height={150}
                className="rounded-full object-cover border-4 border-blue-500 dark:border-blue-400 shadow-md"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">ID Karyawan</Label>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {employee.employeeId || "-"}
              </p>{" "}
              {/* KRUSIAL: Tampilkan employeeId */}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nama</Label>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{employee.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {employee.email || "-"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Telepon</Label>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {employee.phone || "-"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jabatan</Label>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {employee.position || "-"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</Label>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{employee.role}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</Label>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{employee.status}</p>
            </div>
          </div>

          <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Alamat</Label>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{employee.address || "-"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Departemen</Label>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{employee.department || "-"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Lahir</Label>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                {employee.tanggalLahir ? new Date(employee.tanggalLahir).toLocaleDateString("id-ID") : "-"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tanggal Bergabung
              </Label>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                {employee.tanggalBergabung
                  ? new Date(employee.tanggalBergabung).toLocaleDateString("id-ID")
                  : "-"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Kelamin</Label>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{employee.gender || "-"}</p>
            </div>
            {employee.company && (
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Perusahaan</Label>
                <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                  {employee.company.companyName}
                </p>
              </div>
            )}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dibuat Pada</Label>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                {new Date(employee.createdAt).toLocaleDateString("id-ID")}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Diperbarui Pada</Label>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                {new Date(employee.updatedAt).toLocaleDateString("id-ID")}
              </p>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <BackButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
