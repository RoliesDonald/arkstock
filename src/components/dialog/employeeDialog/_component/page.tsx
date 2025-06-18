"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppStore } from "@/store/hooks";
import {
  employeeFormSchema,
  EmployeeFormValues,
  EmployeeRole,
  EmployeeStatus,
} from "@/types/employee";
import { zodResolver } from "@hookform/resolvers/zod";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";

interface EmployeeDialogProps {
  onSubmit: (values: EmployeeFormValues) => void;
  onClose?: () => void;
  initialData?: EmployeeFormValues;
}
const EmployeeDialog: React.FC<EmployeeDialogProps> = ({
  onClose,
  onSubmit,
  initialData,
}) => {
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      position: "",
      role: EmployeeRole.STAFF,
      status: EmployeeStatus.ACTIVE,
      tanggalBergabung: new Date(),
    },
  });

  const handleSubmit = (values: EmployeeFormValues) => {
    console.log("Data Karyawan Disubmit:", values);
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4"
      >
        {/* Nama */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Karyawan</FormLabel>
              <FormControl>
                <Input placeholder="Nama Lengkap" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Email  */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="email.your@company.com"
                  {...field}
                  value={field.value || ""}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value === "" ? null : event.target.value
                    )
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Email  */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="email.your@company.com"
                  {...field}
                  value={field.value || ""}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value === "" ? null : event.target.value
                    )
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Nomor Telepon */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telepon</FormLabel>
              <FormControl>
                <Input placeholder="081234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Alamat */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Textarea placeholder="Alamat lengkap karyawan..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Jabatan */}
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jabatan</FormLabel>
              <FormControl>
                <Input placeholder="Mekanik, Staf Admin, dll." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Peran (Role) */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peran (Role)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih peran karyawan..." />
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

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status karyawan..." />
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

        {/* Tanggal Bergabung (Opsional, dengan Popover) */}
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
                        format(field.value, "PPPP", { locale: id })
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
                    selected={field.value || undefined} // Handle null/undefined
                    onSelect={(date) => field.onChange(date || null)} // Handle null/undefined
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="pt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">
            {initialData ? "Simpan Perubahan" : "Tambah Karyawan"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
export default EmployeeDialog;
