"use client";

import {
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
import { cn } from "@/lib/utils"; 
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns"; 
import { id as localeId } from "date-fns/locale";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Employee } from "@/types/employee"; 
import { useEffect } from "react";
import { Company } from "@/types/companies"; 
import { employeeFormSchema, EmployeeFormValues } from "@/schemas/employee"; 
import { EmployeeRole, EmployeeStatus, Gender } from "@prisma/client"; // <--- IMPORT GENDER DARI @PRISMA/CLIENT

interface EmployeeDialogProps {
  onClose: () => void;
  onSubmit: (values: EmployeeFormValues) => Promise<void>;
  initialData?: Employee;
  companies: Company[]; 
  companyStatus: 'idle' | 'loading' | 'succeeded' | 'failed'; 
}

export default function EmployeeDialog({
  onClose,
  initialData,
  onSubmit,
  companies, 
  companyStatus, 
}: EmployeeDialogProps) {

  const mapEmployeeToFormValues = (employee: Employee): EmployeeFormValues => {
    return {
      id: employee.id,
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email || null,
      photo: employee.photo || null,
      phone: employee.phone || null,
      address: employee.address || null,
      position: employee.position || null,
      role: employee.role,
      department: employee.department || null,
      status: employee.status,
      companyId: employee.companyId,
      tanggalLahir: employee.tanggalLahir ? format(employee.tanggalLahir, "yyyy-MM-dd") : null,
      tanggalBergabung: employee.tanggalBergabung ? format(employee.tanggalBergabung, "yyyy-MM-dd") : null,
      gender: employee.gender, 
    }
  }

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: initialData ? mapEmployeeToFormValues(initialData) : {
      employeeId: "",
      name: "",
      email: null,
      photo: null,
      phone: null,
      address: null,
      position: null,
      role: EmployeeRole.USER, 
      department: null, 
      status: EmployeeStatus.ACTIVE, 
      tanggalLahir: null,
      tanggalBergabung: null,
      companyId: null,
      password: null, 
      gender: Gender.MALE, 
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(mapEmployeeToFormValues(initialData));
    } else {
      form.reset({
        employeeId: "",
        name: "",
        email: null,
        photo: null,
        phone: null,
        address: null,
        position: null,
        role: EmployeeRole.USER,
        department: null,
        status: EmployeeStatus.ACTIVE,
        tanggalLahir: null,
        tanggalBergabung: null,
        companyId: null,
        password: null, 
        gender: Gender.MALE, 
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: EmployeeFormValues)=> {
    await onSubmit(values);
  };

  return (
     <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Karyawan":"Tambahkan Karyawan Baru"}</DialogTitle>
          <DialogDescription>{initialData ? "Edit detail karyawan yang sudah ada." : "Isi detail karyawan untuk menambah data karyawan baru ke sistem."}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employeeId" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Karyawan</FormLabel>
                    <FormControl>
                      <Input placeholder="EMP-001" {...field} />
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
                      <Input placeholder="Nama Lengkap" {...field} />
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
                        value={field.value || ""} 
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
                        value={field.value || ""} 
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
                      <Input placeholder="081234567890" {...field} value={field.value || ""} />
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
                      <Input placeholder="Alamat Lengkap" {...field} value={field.value || ""} />
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
                      <Input placeholder="Contoh: Manager" {...field} value={field.value || ""} />
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
                      <Input placeholder="Contoh: IT" {...field} value={field.value || ""} />
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
              {/* Tanggal Lahir */}
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
                              format(parseISO(field.value), "PPP", { locale: localeId })
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
                          selected={field.value ? parseISO(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : null)}
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
              {/* Tanggal Bergabung */}
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
                              format(parseISO(field.value), "PPP", { locale: localeId })
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
                          selected={field.value ? parseISO(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : null)}
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
              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Kelamin</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Gender).map((gender) => (
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
              {/* Company ID */}
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
                          companies.length === 0 && ( 
                            <SelectItem value="" disabled>
                              Tidak ada perusahaan
                            </SelectItem>
                          )}
                        {companies.map((company: Company) => ( 
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
              {/* Photo URL */}
              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Foto (Opsional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/foto.jpg"
                        type="url"
                        {...field}
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogDescription className="text-right text-sm text-gray-500">
              *Password hanya diisi saat membuat karyawan baru atau mengganti
              password. Biarkan kosong jika tidak ingin mengubah.
            </DialogDescription>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
  );
}
