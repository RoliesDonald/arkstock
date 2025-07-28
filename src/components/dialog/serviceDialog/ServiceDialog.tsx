"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { Service } from "@/types/services"; 
import { serviceFormSchema, ServiceFormValues } from "@/schemas/service"; 

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
import { Textarea } from "@/components/ui/textarea"; // Import Textarea

interface ServiceDialogProps {
  onClose: () => void;
  onSubmit: (values: ServiceFormValues) => Promise<void>;
  initialData?: Service;
  // Jika ada data tambahan yang dibutuhkan dari Redux (misal daftar spare part untuk ServiceRequiredSparePart),
  // maka akan diteruskan di sini sebagai props. Untuk saat ini, tidak ada langsung di dialog ini.
}

export default function ServiceDialog({
  onClose,
  initialData,
  onSubmit,
}: ServiceDialogProps) {

  const mapServiceToFormValues = (service: Service): ServiceFormValues => {
    return {
      id: service.id,
      name: service.name,
      description: service.description || null,
      price: service.price,
      category: service.category || null,
      subCategory: service.subCategory || null,
      tasks: service.tasks, // Array of strings
    };
  };

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: initialData ? mapServiceToFormValues(initialData) : {
      name: "",
      description: null,
      price: 0,
      category: null,
      subCategory: null,
      tasks: [], // Default empty array
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(mapServiceToFormValues(initialData));
    } else {
      form.reset({
        name: "",
        description: null,
        price: 0,
        category: null,
        subCategory: null,
        tasks: [],
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: ServiceFormValues) => {
    // Pastikan tasks dikirim sebagai array of strings
    const payload = {
      ...values,
      tasks: values.tasks ? (Array.isArray(values.tasks) ? values.tasks : String(values.tasks).split(',').map(task => task.trim()).filter(task => task !== '')) : [],
    };
    await onSubmit(payload);
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Jasa" : "Tambahkan Jasa Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail jasa yang sudah ada." : "Isi detail jasa untuk menambah data jasa baru ke sistem."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Jasa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ganti Oli" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Perawatan Mesin" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Sub Category */}
            <FormField
              control={form.control}
              name="subCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub Kategori (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Oli Mesin" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Deskripsi lengkap jasa..." {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Tasks (String[]) */}
            <FormField
              control={form.control}
              name="tasks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tugas-tugas (Pisahkan dengan koma)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cek filter udara, Ganti oli, Cek busi"
                      {...field}
                      value={Array.isArray(field.value) ? field.value.join(', ') : field.value || ""}
                      onChange={(e) => field.onChange(e.target.value.split(',').map(task => task.trim()).filter(task => task !== ''))}
                    />
                  </FormControl>
                  <FormDescription>
                    Masukkan tugas-tugas yang terkait dengan jasa ini, pisahkan dengan koma.
                  </FormDescription>
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
