// src/components/dialog/employeeDialog/_component/EmployeeDialog.tsx
"use client";

import { Employee, EmployeeFormValues, employeeFormSchema } from "@/schemas/employee";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, CameraIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { EnumsApiResponse } from "@/app/(main)/employees/page";

interface EmployeeDialogProps {
  onClose: () => void;
  initialData?: Employee;
  onSubmit: (values: EmployeeFormValues) => void;
  enums: EnumsApiResponse | null;
  generatedEmployeeId?: string; // KRUSIAL: Ganti nama prop
  companyNamePrefix?: string;
}

export default function EmployeeDialog({
  onClose,
  initialData,
  onSubmit,
  enums,
  generatedEmployeeId, // KRUSIAL: Ganti nama prop
  companyNamePrefix,
}: EmployeeDialogProps) {
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          tanggalLahir: initialData.tanggalLahir || undefined,
          tanggalBergabung: initialData.tanggalBergabung || undefined,
          email: initialData.email || "",
          photo: initialData.photo || "",
          phone: initialData.phone || "",
          address: initialData.address || "",
          department: initialData.department || "",
          gender: initialData.gender || "",
          password: "",
        }
      : {
          employeeId: generatedEmployeeId, // KRUSIAL: Gunakan employeeId
          name: "",
          email: "",
          password: "",
          photo: "",
          phone: "",
          address: "",
          position: "",
          role: "",
          department: "",
          status: "",
          tanggalLahir: undefined,
          tanggalBergabung: undefined,
          gender: "",
          companyId: "ARKSTOK-MAIN-001",
        },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  useEffect(() => {
    // KRUSIAL: Update form value for employeeId
    if (!initialData && generatedEmployeeId) {
      form.setValue("employeeId", generatedEmployeeId);
    }
  }, [generatedEmployeeId, initialData, form]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        tanggalLahir: initialData.tanggalLahir || undefined,
        tanggalBergabung: initialData.tanggalBergabung || undefined,
        email: initialData.email || "",
        photo: initialData.photo || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        department: initialData.department || "",
        gender: initialData.gender || "",
        password: "",
        companyId: initialData.companyId || undefined,
      });
      setPreviewPhoto(initialData.photo || null);
    } else {
      form.reset({
        employeeId: generatedEmployeeId, // KRUSIAL: Gunakan employeeId
        name: "",
        email: "",
        password: "",
        photo: "",
        phone: "",
        address: "",
        position: "",
        role: "",
        department: "",
        status: "",
        tanggalLahir: undefined,
        tanggalBergabung: undefined,
        gender: "",
        companyId: "ARKSTOK-MAIN-001",
      });
      setPreviewPhoto(null);
    }
  }, [initialData, form, generatedEmployeeId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result as string);
        form.setValue("photo", reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewPhoto(null);
      form.setValue("photo", "");
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFormSubmit = (values: EmployeeFormValues) => {
    onSubmit(values);
  };

  if (!enums) {
    return <div className="text-center p-4">Memuat data enum karyawan...</div>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-4"
      >
        {/* Kolom Kiri */}
        <div className="space-y-4">
          {/* Tampilan Foto Profil */}
          <FormItem className="flex flex-col items-center justify-center col-span-2 md:col-span-1">
            <FormLabel className="text-center">Foto Profil</FormLabel>
            <FormControl>
              <div
                className="relative w-32 h-32 rounded-lg overflow-hidden cursor-pointer border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center group"
                onClick={handlePhotoClick}
              >
                {previewPhoto ? (
                  <Image
                    src={previewPhoto}
                    alt="Pratinjau Foto Profil"
                    layout="fill"
                    objectFit="cover"
                    className="transition-opacity duration-300 group-hover:opacity-75"
                  />
                ) : (
                  <div className="text-gray-400 dark:text-gray-500 text-sm flex flex-col items-center">
                    <CameraIcon className="h-10 w-10 mb-2" />
                    <span>Unggah Foto</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <CameraIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </FormControl>
            <FormMessage />
            {/* Input file tersembunyi */}
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </FormItem>

          {/* Field ID Karyawan */}
          <FormField
            control={form.control}
            name="employeeId" // KRUSIAL: Gunakan employeeId
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Karyawan</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ID Karyawan"
                    {...field}
                    disabled={!!initialData || (!!generatedEmployeeId && !initialData)} // KRUSIAL: Gunakan generatedEmployeeId
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Karyawan</FormLabel>
                <FormControl>
                  <Input placeholder="Nama Karyawan" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} type="email" />
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
                <FormLabel>Telepon</FormLabel>
                <FormControl>
                  <Input placeholder="Nomor Telepon" {...field} type="tel" />
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
                <FormLabel>Alamat</FormLabel>
                <FormControl>
                  <Textarea placeholder="Alamat Karyawan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jabatan</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Jabatan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {enums?.EmployeePosition.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position.replace(/_/g, " ")}
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
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role Karyawan</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {enums?.EmployeeRole.map((role) => (
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
          {/* Field Departemen (Sekarang Opsional) */}
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departemen (Opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="Departemen" {...field} value={field.value || ""} />
                </FormControl>
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {enums?.EmployeeStatus.map((status) => (
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
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Kelamin</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Jenis Kelamin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {enums?.Gender.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Tanggal Lahir */}
          <FormField
            control={form.control}
            name="tanggalLahir"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="mb-2">Tanggal Lahir</FormLabel>
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
                          format(field.value, "PPP", { locale: id })
                        ) : (
                          <span>Pilih Tanggal Lahir</span>
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
                      captionLayout="dropdown"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      initialFocus
                      locale={id}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Tanggal Bergabung */}
          <FormField
            control={form.control}
            name="tanggalBergabung"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="mb-2">Tanggal Bergabung</FormLabel>
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
                          format(field.value, "PPP", { locale: id })
                        ) : (
                          <span>Pilih Tanggal Bergabung</span>
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
                      captionLayout="dropdown"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      initialFocus
                      locale={id}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Password field hanya untuk tambah karyawan baru atau jika ingin mengubah */}
          {!initialData && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {initialData && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubah Password (kosongkan jika tidak diubah)</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Isi untuk mengubah password"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {/* Field Company ID (Hidden, diisi otomatis atau dari konteks user) */}
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormLabel>Company ID</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-2 flex justify-end space-x-2 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </Form>
  );
}
