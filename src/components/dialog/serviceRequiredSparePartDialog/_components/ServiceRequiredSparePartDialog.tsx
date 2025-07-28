// src/components/dialog/serviceRequiredSparePartDialog/_components/ServiceRequiredSparePartDialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { ServiceRequiredSparePart } from "@/types/serviceRequiredSpareParts"; 
import { Service } from "@/types/services"; 
import { SparePart } from "@/types/sparepart"; 
import { serviceRequiredSparePartFormSchema, ServiceRequiredSparePartFormValues } from "@/schemas/serviceRequiredSparePart"; 

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ServiceRequiredSparePartDialogProps {
  onClose: () => void;
  onSubmit: (values: ServiceRequiredSparePartFormValues) => Promise<void>;
  initialData?: ServiceRequiredSparePart;
  services: Service[];
  spareParts: SparePart[];
  servicesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  sparePartsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export default function ServiceRequiredSparePartDialog({
  onClose,
  initialData,
  onSubmit,
  services,
  spareParts,
  servicesStatus,
  sparePartsStatus,
}: ServiceRequiredSparePartDialogProps) {

  const mapServiceRequiredSparePartToFormValues = (srsp: ServiceRequiredSparePart): ServiceRequiredSparePartFormValues => {
    return {
      id: srsp.id,
      serviceId: srsp.serviceId,
      sparePartId: srsp.sparePartId,
      quantity: srsp.quantity,
    };
  };

  const form = useForm<ServiceRequiredSparePartFormValues>({
    resolver: zodResolver(serviceRequiredSparePartFormSchema),
    defaultValues: initialData ? mapServiceRequiredSparePartToFormValues(initialData) : {
      serviceId: "",
      sparePartId: "",
      quantity: 1,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(mapServiceRequiredSparePartToFormValues(initialData));
    } else {
      form.reset({
        serviceId: "",
        sparePartId: "",
        quantity: 1,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: ServiceRequiredSparePartFormValues) => {
    await onSubmit(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Spare Part Jasa" : "Tambahkan Spare Part Jasa Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail spare part yang dibutuhkan jasa yang sudah ada." : "Isi detail spare part yang dibutuhkan jasa untuk menambah data baru ke sistem."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field Service ID */}
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jasa</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Jasa" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {servicesStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat jasa...
                        </SelectItem>
                      )}
                      {servicesStatus === "succeeded" && services.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada jasa
                        </SelectItem>
                      )}
                      {services.map((service: Service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Spare Part ID */}
            <FormField
              control={form.control}
              name="sparePartId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spare Part</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Spare Part" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sparePartsStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat spare part...
                        </SelectItem>
                      )}
                      {sparePartsStatus === "succeeded" && spareParts.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada spare part
                        </SelectItem>
                      )}
                      {spareParts.map((part: SparePart) => (
                        <SelectItem key={part.id} value={part.id}>
                          {part.partName} ({part.partNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Quantity */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kuantitas</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1" {...field} onChange={e => field.onChange(Number(e.target.value))} />
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
