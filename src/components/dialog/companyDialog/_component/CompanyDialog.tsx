"use client";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  companyFormSchema,
  CompanyFormValue,
  CompanyStatus,
  CompanyType,
} from "@/types/companies";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Checkbox as UiCheckbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CompanyDialogProps {
  onClose: () => void;
  onSubmit: (values: CompanyFormValue) => void;
  initialData?: CompanyFormValue;
}

export default function CompanyDialog({
  onClose,
  onSubmit,
  initialData,
}: CompanyDialogProps) {
  const form = useForm<CompanyFormValue>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: initialData || {
      companyId: "", // kalaubisa ini di generate otomatis dengan accuan dari nama perusahaan dan penamaan dari bung mekanik sendiri
      companyName: "",
      address: "",
      contact: "",
      companyEmail: "",
      logo: "",
      taxRegistered: false,
      companyType: CompanyType.CUSTOMER, // Default company type
      status: CompanyStatus.ACTIVE, // Default company status
    },
  });
  const handleSubmit = (values: CompanyFormValue) => {
    onSubmit(values);
    form.reset();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Perusahaan</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: MB001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Perusahaan</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama perusahaan" {...field} />
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
                <Textarea placeholder="Masukkan alamat lengkap" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telepon</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="Nomor telepon" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Opsional)</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Alamat email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Logo (Opsional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/logo.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="companyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Perusahaan</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(CompanyType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Status tetap di sini karena tidak ada di Prisma tapi penting untuk UI */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Perusahaan</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(CompanyStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="taxRegistered"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <UiCheckbox // Menggunakan UiCheckbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Terdaftar Pajak (PPN)</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose} type="button">
            Batal
          </Button>
          <Button type="submit">Simpan Perusahaan</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
