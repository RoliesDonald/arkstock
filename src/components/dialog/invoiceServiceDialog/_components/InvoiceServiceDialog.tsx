"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { InvoiceService } from "@/types/invoiceServices"; 
import { Invoice } from "@/types/invoice"; 
import { Service } from "@/types/services"; 
import { invoiceServiceFormSchema, InvoiceServiceFormValues } from "@/schemas/invoiceService"; 

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

interface InvoiceServiceDialogProps {
  onClose: () => void;
  onSubmit: (values: InvoiceServiceFormValues) => Promise<void>;
  initialData?: InvoiceService;
  invoices: Invoice[];
  services: Service[];
  invoicesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  servicesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export default function InvoiceServiceDialog({
  onClose,
  initialData,
  onSubmit,
  invoices,
  services,
  invoicesStatus,
  servicesStatus,
}: InvoiceServiceDialogProps) {

  const mapInvoiceServiceToFormValues = (is: InvoiceService): InvoiceServiceFormValues => {
    return {
      id: is.id,
      invoiceId: is.invoiceId,
      serviceId: is.serviceId,
      quantity: is.quantity,
      unitPrice: is.unitPrice,
      totalPrice: is.totalPrice,
    };
  };

  const form = useForm<InvoiceServiceFormValues>({
    resolver: zodResolver(invoiceServiceFormSchema),
    defaultValues: initialData ? mapInvoiceServiceToFormValues(initialData) : {
      invoiceId: "",
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
      form.reset(mapInvoiceServiceToFormValues(initialData));
    } else {
      form.reset({
        invoiceId: "",
        serviceId: "",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: InvoiceServiceFormValues) => {
    await onSubmit(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Jasa Invoice" : "Tambahkan Jasa Invoice Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail jasa invoice yang sudah ada." : "Isi detail jasa invoice untuk menambah data baru ke sistem."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field Invoice ID */}
            <FormField
              control={form.control}
              name="invoiceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Invoice" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {invoicesStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat Invoice...
                        </SelectItem>
                      )}
                      {invoicesStatus === "succeeded" && invoices.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada Invoice
                        </SelectItem>
                      )}
                      {invoices.map((invoice: Invoice) => (
                        <SelectItem key={invoice.id} value={invoice.id}>
                          {invoice.invoiceNumber}
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
