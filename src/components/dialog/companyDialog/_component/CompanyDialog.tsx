"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Resolver, FieldErrors } from "react-hook-form";
import {
  CompanyFormValues,
  companyFormSchema,
  Company,
  CompanyType,
  CompanyStatus,
  CompanyRole,
  CompanyNameAndId,
} from "@/types/companies";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchCompanies } from "@/store/slices/companySlice";

interface CompanyDialogProps {
  onClose: () => void;
  onSubmit: (values: CompanyFormValues) => void;
  initialData?: Company; // Data yang akan diisi saat mode edit
}

// Fungsi helper untuk mendapatkan nilai default yang aman dan lengkap
const getSafeDefaultValues = (data?: Company): CompanyFormValues => {
  return {
    id: data?.id || undefined,
    companyId: data?.companyId || "",
    companyName: data?.companyName || "",
    companyEmail: data?.companyEmail || "",
    logo: data?.logo || "",
    contact: data?.contact || "",
    address: data?.address || "",
    city: data?.city || "",
    taxRegistered:
      typeof data?.taxRegistered === "boolean" ? data.taxRegistered : false,
    companyType: data?.companyType || CompanyType.CUSTOMER,
    status: data?.status || CompanyStatus.ACTIVE,
    companyRole: data?.parentCompanyId
      ? CompanyRole.CHILD_COMPANY
      : CompanyRole.MAIN_COMPANY,
    parentCompanyId: data?.parentCompanyId || "",
  };
};

const customZodResolver: Resolver<CompanyFormValues> = async (values) => {
  try {
    // Validasi nilai form menggunakan skema Zod
    companyFormSchema.parse(values);
    return {
      values,
      errors: {}, // Tidak ada error
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: FieldErrors<CompanyFormValues> = {};
      // Iterasi melalui error Zod dan format untuk react-hook-form
      for (const issue of error.issues) {
        // Pastikan path adalah string dan merupakan key yang valid di CompanyFormValues
        const path = issue.path.join(".") as keyof CompanyFormValues;
        if (path) {
          errors[path] = {
            type: issue.code,
            message: issue.message,
          };
        }
      }
      return {
        values: {}, // Jika ada error, nilai form dianggap tidak valid
        errors,
      };
    }
    // Tangani error non-Zod
    return {
      values: {},
      errors: {
        root: {
          type: "manual",
          message: (error as Error).message || "An unknown error occurred",
        },
      },
    };
  }
};

export default function CompanyDialog({
  onClose,
  onSubmit,
  initialData,
}: CompanyDialogProps) {
  const dispatch = useDispatch();
  const allCompanies = useSelector(
    (state: RootState) => state.companies.companies
  );
  const companiesStatus = useSelector(
    (state: RootState) => state.companies.status
  );

  // State untuk menyimpan daftar perusahaan (ID dan Nama) untuk dropdown
  const [parentCompanyOptions, setParentCompanyOptions] = useState<
    CompanyNameAndId[]
  >([]);
  const [isFetchingCompanies, setIsFetchingCompanies] = useState(false);

  const form = useForm<CompanyFormValues>({
    resolver: customZodResolver,
    defaultValues: getSafeDefaultValues(initialData),
  });

  const companyRole = form.watch("companyRole");

  // Fetch daftar perusahaan saat komponen dimuat
  useEffect(() => {
    setIsFetchingCompanies(true);
    dispatch(fetchCompanies() as any).then((action: any) => {
      if (fetchCompanies.fulfilled.match(action)) {
        // Map fetched companies to { id, companyName } format
        const options = action.payload.map((company) => ({
          id: company.id,
          companyName: company.companyName,
        }));
        setParentCompanyOptions(options);
      }
      setIsFetchingCompanies(false);
    });
  }, [dispatch]);

  useEffect(() => {
    // Reset form saat initialData berubah (untuk edit mode)
    // Pastikan form di-reset dengan nilai yang aman dan lengkap
    form.reset(getSafeDefaultValues(initialData));

    // Jika dalam mode edit dan initialData memiliki parentCompanyId,
    // set companyRole menjadi CHILD_COMPANY. Jika tidak, MAIN_COMPANY.
    if (initialData) {
      form.setValue(
        "companyRole",
        initialData.parentCompanyId
          ? CompanyRole.CHILD_COMPANY
          : CompanyRole.MAIN_COMPANY
      );
    } else {
      // Untuk form tambah baru, set default role ke MAIN_COMPANY
      form.setValue("companyRole", CompanyRole.MAIN_COMPANY);
    }
  }, [initialData, form]);

  //  const form = useForm<CompanyFormValues>({
  //   resolver: zodResolver(companyFormSchema) as Resolver<CompanyFormValues, any, CompanyFormValues>,
  //   defaultValues: getSafeDefaultValues(initialData),
  // });

  // useEffect(() => {
  //   form.reset(getSafeDefaultValues(initialData));
  // }, [initialData, form]);

  const handleSubmit: SubmitHandler<CompanyFormValues> = (values) => {
    // Logika tambahan sebelum submit:
    // Jika perusahaan adalah MAIN_COMPANY, pastikan parentCompanyId adalah null
    const finalValues = { ...values };
    if (finalValues.companyRole === CompanyRole.MAIN_COMPANY) {
      finalValues.parentCompanyId = null;
    }
    onSubmit(finalValues);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[calc(100dvh)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Perusahaan" : "Tambah Perusahaan Baru"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Perusahaan</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Perusahaan</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Email Perusahaan</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kontak Utama</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
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
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kota</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Logo</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taxRegistered"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Terdaftar Pajak</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Perusahaan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
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
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Perusahaan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
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
            <FormField
              control={form.control}
              name="parentCompanyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Perusahaan Induk (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit">Simpan Perusahaan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
