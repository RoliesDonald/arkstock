"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { WorkOrderService } from "@/types/workOrderServices"; 
import { WorkOrder } from "@/types/workOrder"; 
import { Service } from "@/types/services"; 
import { workOrderServiceFormSchema, WorkOrderServiceFormValues } from "@/schemas/workOrderService"; 

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

interface WorkOrderServiceDialogProps {
  onClose: () => void;
  onSubmit: (values: WorkOrderServiceFormValues) => Promise<void>;
  initialData?: WorkOrderService;
  workOrders: WorkOrder[];
  services: Service[];
  workOrdersStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  servicesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export default function WorkOrderServiceDialog({
  onClose,
  initialData,
  onSubmit,
  workOrders,
  services,
  workOrdersStatus,
  servicesStatus,
}: WorkOrderServiceDialogProps) {

  const mapWorkOrderServiceToFormValues = (wos: WorkOrderService): WorkOrderServiceFormValues => {
    return {
      id: wos.id,
      workOrderId: wos.workOrderId,
      serviceId: wos.serviceId,
      quantity: wos.quantity,
      unitPrice: wos.unitPrice,
      totalPrice: wos.totalPrice,
    };
  };

  const form = useForm<WorkOrderServiceFormValues>({
    resolver: zodResolver(workOrderServiceFormSchema),
    defaultValues: initialData ? mapWorkOrderServiceToFormValues(initialData) : {
      workOrderId: "",
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
      form.reset(mapWorkOrderServiceToFormValues(initialData));
    } else {
      form.reset({
        workOrderId: "",
        serviceId: "",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: WorkOrderServiceFormValues) => {
    await onSubmit(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Jasa Work Order" : "Tambahkan Jasa Work Order Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail jasa work order yang sudah ada." : "Isi detail jasa work order untuk menambah data baru ke sistem."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field Work Order ID */}
            <FormField
              control={form.control}
              name="workOrderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Order</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Work Order" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workOrdersStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat Work Order...
                        </SelectItem>
                      )}
                      {workOrdersStatus === "succeeded" && workOrders.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada Work Order
                        </SelectItem>
                      )}
                      {workOrders.map((wo: WorkOrder) => (
                        <SelectItem key={wo.id} value={wo.id}>
                          {wo.workOrderNumber}
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
