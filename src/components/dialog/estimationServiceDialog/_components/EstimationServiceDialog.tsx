"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { EstimationService } from "@/types/estimationServices"; 
import { Estimation } from "@/types/estimation"; 
import { Service } from "@/types/services"; 
import { estimationServiceFormSchema, EstimationServiceFormValues } from "@/schemas/estimationService"; 

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

interface EstimationServiceDialogProps {
  onClose: () => void;
  onSubmit: (values: EstimationServiceFormValues) => Promise<void>;
  initialData?: EstimationService;
  estimations: Estimation[];
  services: Service[];
  estimationsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  servicesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export default function EstimationServiceDialog({
  onClose,
  initialData,
  onSubmit,
  estimations,
  services,
  estimationsStatus,
  servicesStatus,
}: EstimationServiceDialogProps) {

  const mapEstimationServiceToFormValues = (es: EstimationService): EstimationServiceFormValues => {
    return {
      id: es.id,
      estimationId: es.estimationId,
      serviceId: es.serviceId,
      quantity: es.quantity,
      unitPrice: es.unitPrice,
      totalPrice: es.totalPrice,
    };
  };

  const form = useForm<EstimationServiceFormValues>({
    resolver: zodResolver(estimationServiceFormSchema),
    defaultValues: initialData ? mapEstimationServiceToFormValues(initialData) : {
      estimationId: "",
      serviceId: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    },
  });

  // Calculate totalPrice whenever quantity or unitPrice changes
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name === 'quantity' || name === 'unitPrice') {
        const qty = value.quantity || 0;
        const price = value.unitPrice || 0;
        form.setValue('totalPrice', qty * price, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    if (initialData) {
      form.reset(mapEstimationServiceToFormValues(initialData));
    } else {
      form.reset({
        estimationId: "",
        serviceId: "",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: EstimationServiceFormValues) => {
    await onSubmit(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Jasa Estimasi" : "Tambahkan Jasa Estimasi Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail jasa estimasi yang sudah ada." : "Isi detail jasa estimasi untuk menambah data baru ke sistem."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field Estimation ID */}
            <FormField
              control={form.control}
              name="estimationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimasi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Estimasi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {estimationsStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat estimasi...
                        </SelectItem>
                      )}
                      {estimationsStatus === "succeeded" && estimations.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada estimasi
                        </SelectItem>
                      )}
                      {estimations.map((estimation: Estimation) => (
                        <SelectItem key={estimation.id} value={estimation.id}>
                          {estimation.estimationNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                          {service.name} (Rp{service.price.toLocaleString('id-ID')})
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
            {/* Field Unit Price */}
            <FormField
              control={form.control}
              name="unitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Satuan</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Total Price (Read-only) */}
            <FormField
              control={form.control}
              name="totalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Harga</FormLabel>
                  <FormControl>
                    <Input type="number" readOnly placeholder="0" {...field} />
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
