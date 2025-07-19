"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils"; // Pastikan path ini benar
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Employee,
  EmployeeFormValues,
  EmployeeRole,
  EmployeeStatus,
  employeeFormSchema,
} from "@/types/employee";
import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks"; // Untuk mengambil daftar perusahaan
import { Company } from "@/types/companies"; // Import Company type

interface EmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EmployeeFormValues) => void;
  initialData?: Employee;
  dialogTitle: string;
  dialogDescription: string;
}

export default function EmployeeDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  dialogTitle,
  dialogDescription,
}: EmployeeDialogProps) {
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: initialData || {
      userId: "",
      name: "",
      email: "",
      password: "", // Password biasanya tidak diisi ulang di form edit
      photo: "",
      phone: "",
      address: "",
      position: "",
      role: EmployeeRole.USER, // Default role
      department: "",
      status: EmployeeStatus.ACTIVE, // Default status
      tanggalLahir: null,
      tanggalBergabung: null,
      companyId: null,
    },
  });

  // Ambil daftar perusahaan dari Redux store (jika diperlukan untuk dropdown)
  const allCompanies = useAppSelector((state) => state.companies.companies);
  const companyStatus = useAppSelector((state) => state.companies.status);

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        // Konversi string ISO ke Date objek untuk DatePicker
        tanggalLahir: initialData.tanggalLahir
          ? new Date(initialData.tanggalLahir)
          : null,
        tanggalBergabung: initialData.tanggalBergabung
          ? new Date(initialData.tanggalBergabung)
          : null,
      });
    } else {
      form.reset({
        userId: "",
        name: "",
        email: "",
        password: "",
        photo: "",
        phone: "",
        address: "",
        position: "",
        role: EmployeeRole.USER,
        department: "",
        status: EmployeeStatus.ACTIVE,
        tanggalLahir: null,
        tanggalBergabung: null,
        companyId: null,
      });
    }
  }, [initialData, form]);

  const handleSubmit = useCallback(
    (values: EmployeeFormValues) => {
      // Konversi Date objek dari DatePicker kembali ke string ISO sebelum submit
      const formattedValues = {
        ...values,
        tanggalLahir:
          values.tanggalLahir instanceof Date
            ? values.tanggalLahir.toISOString()
            : values.tanggalLahir,
        tanggalBergabung:
          values.tanggalBergabung instanceof Date
            ? values.tanggalBergabung.toISOString()
            : values.tanggalBergabung,
      };
      onSubmit(formattedValues);
    },
    [onSubmit]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Karyawan</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama Lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="ID Karyawan Internal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Opsional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password (Opsional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="081234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Alamat Lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posisi (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departemen (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: IT" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Karyawan</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(EmployeeRole).map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Karyawan</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(EmployeeStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tanggalLahir"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Lahir (Opsional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: localeId })
                            ) : (
                              <span>Pilih tanggal lahir</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          locale={localeId}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tanggalBergabung"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Bergabung (Opsional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: localeId })
                            ) : (
                              <span>Pilih tanggal bergabung</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          locale={localeId}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perusahaan (Opsional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Perusahaan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companyStatus === "loading" && (
                          <SelectItem value="" disabled>
                            Memuat perusahaan...
                          </SelectItem>
                        )}
                        {companyStatus === "succeeded" &&
                          allCompanies.length === 0 && (
                            <SelectItem value="" disabled>
                              Tidak ada perusahaan
                            </SelectItem>
                          )}
                        {allCompanies.map((company: Company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.companyName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Tambahkan field untuk photo jika diperlukan */}
            </div>
            <DialogDescription className="text-right text-sm text-gray-500">
              *Password hanya diisi saat membuat karyawan baru atau mengganti
              password. Biarkan kosong jika tidak ingin mengubah.
            </DialogDescription>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
