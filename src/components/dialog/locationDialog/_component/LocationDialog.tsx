"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { Location } from "@/types/locations"; 
import { locationFormSchema, LocationFormValues } from "@/schemas/locations"; 

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // For address/description

interface LocationDialogProps {
  onClose: () => void;
  onSubmit: (values: LocationFormValues) => Promise<void>;
  initialData?: Location;
}

export default function LocationDialog({
  onClose,
  initialData,
  onSubmit,
}: LocationDialogProps) {

  const mapLocationToFormValues = (location: Location): LocationFormValues => {
    return {
      id: location.id,
      name: location.name,
      address: location.address || null,
    };
  };

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: initialData ? mapLocationToFormValues(initialData) : {
      name: "",
      address: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(mapLocationToFormValues(initialData));
    } else {
      form.reset({
        name: "",
        address: null,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: LocationFormValues) => {
    await onSubmit(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Lokasi" : "Tambahkan Lokasi Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail lokasi yang sudah ada." : "Isi detail lokasi untuk menambah data lokasi baru ke sistem."}
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
                  <FormLabel>Nama Lokasi</FormLabel>
                  <FormControl>
                    <Input placeholder="Kantor Pusat" {...field} />
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
                    <Textarea placeholder="Jl. Sudirman No. 1" {...field} value={field.value || ""} />
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
