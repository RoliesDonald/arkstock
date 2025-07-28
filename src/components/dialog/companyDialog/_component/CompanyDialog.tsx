// src/components/dialog/companyDialog/_components/CompanyDialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { Company } from "@/types/companies"; // Import Company type
import { companyFormSchema, CompanyFormValues } from "@/schemas/company"; // Import CompanyFormValues dari schemas
import { CompanyType, CompanyStatus, CompanyRole } from "@prisma/client"; // Import Enums dari Prisma

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox"; // Untuk taxRegistered

interface CompanyDialogProps {
  onClose: () => void;
  onSubmit: (values: CompanyFormValues) => Promise<void>;
  initialData?: Company;
  allCompanies: Company[]; // Untuk dropdown parent company
  companyStatus: 'idle' | 'loading' | 'succeeded' | 'failed'; // Untuk status loading companies
}

export default function CompanyDialog({
  onClose,
  initialData,
  onSubmit,
  allCompanies,
  companyStatus,
}: CompanyDialogProps) {

  const mapCompanyToFormValues = (company: Company): CompanyFormValues => {
    return {
      id: company.id,
      companyId: company.companyId,
      companyName: company.companyName,
      companyEmail: company.companyEmail || null,
      logo: company.logo || null,
      contact: company.contact || null,
      address: company.address || null,
      city: company.city || null,
      taxRegistered: company.taxRegistered,
      companyType: company.companyType,
      status: company.status,
      companyRole: company.companyRole,
      parentCompanyId: company.parentCompanyId || null,
    };
  };

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: initialData ? mapCompanyToFormValues(initialData) : {
      companyId: "",
      companyName: "",
      companyEmail: null,
      logo: null,
      contact: null,
      address: null,
      city: null,
      taxRegistered: false,
      companyType: CompanyType.CUSTOMER, // Default type
      status: CompanyStatus.ACTIVE, // Default status
      companyRole: CompanyRole.MAIN_COMPANY, // Default role
      parentCompanyId: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(mapCompanyToFormValues(initialData));
    } else {
      form.reset({
        companyId: "",
        companyName: "",
        companyEmail: null,
        logo: null,
        contact: null,
        address: null,
        city: null,
        taxRegistered: false,
        companyType: CompanyType.CUSTOMER,
        status: CompanyStatus.ACTIVE,
        companyRole: CompanyRole.MAIN_COMPANY,
        parentCompanyId: null,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: CompanyFormValues) => {
    await onSubmit(values);
    // onClose() akan dipanggil di wrapper setelah onSubmit selesai
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Perusahaan" : "Tambahkan Perusahaan Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail perusahaan yang sudah ada." : "Isi detail perusahaan untuk menambah data perusahaan baru ke sistem."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field Company ID */}
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Perusahaan</FormLabel>
                  <FormControl>
                    <Input placeholder="COMP-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Company Name */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Perusahaan</FormLabel>
                  <FormControl>
                    <Input placeholder="PT Maju Mundur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Company Email */}
            <FormField
              control={form.control}
              name="companyEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Perusahaan (Opsional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="info@example.com"
                      type="email"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Contact */}
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kontak (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="081234567890" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Jl. Raya No. 123" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field City */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kota (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Jakarta" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Company Type */}
            <FormField
              control={form.control}
              name="companyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Perusahaan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Tipe Perusahaan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(CompanyType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Perusahaan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Status Perusahaan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(CompanyStatus).map((status) => (
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
            {/* Field Company Role */}
            <FormField
              control={form.control}
              name="companyRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Perusahaan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Role Perusahaan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(CompanyRole).map((role) => (
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
            {/* Field Parent Company (Opsional) */}
            <FormField
              control={form.control}
              name="parentCompanyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perusahaan Induk (Opsional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Perusahaan Induk" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Tidak Ada</SelectItem> {/* Opsi untuk tidak memilih parent */}
                      {companyStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat perusahaan...
                        </SelectItem>
                      )}
                      {companyStatus === "succeeded" &&
                        allCompanies.length === 0 && (
                          <SelectItem value="" disabled>
                            Tidak ada perusahaan lain
                          </SelectItem>
                        )}
                      {allCompanies
                        .filter(comp => comp.id !== initialData?.id) // Jangan tampilkan perusahaan itu sendiri sebagai parent
                        .map((company) => (
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
            {/* Field Tax Registered */}
            <FormField
              control={form.control}
              name="taxRegistered"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Terdaftar Pajak (PPN)</FormLabel>
                    <FormDescription>
                      Centang jika perusahaan ini terdaftar PPN.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            {/* Field Logo URL */}
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Logo (Opsional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/logo.png"
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
