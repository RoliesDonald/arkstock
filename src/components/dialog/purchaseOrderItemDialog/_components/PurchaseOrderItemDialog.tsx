"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { PurchaseOrderItem } from "@/types/purchaseOrderItems"; 
import { PurchaseOrder } from "@/types/purchaseOrder"; 
import { SparePart } from "@/types/sparepart"; 
import { purchaseOrderItemFormSchema, PurchaseOrderItemFormValues } from "@/schemas/purchaseOrderItem"; 

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

interface PurchaseOrderItemDialogProps {
  onClose: () => void;
  onSubmit: (values: PurchaseOrderItemFormValues) => Promise<void>;
  initialData?: PurchaseOrderItem;
  purchaseOrders: PurchaseOrder[];
  spareParts: SparePart[];
  purchaseOrdersStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  sparePartsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export default function PurchaseOrderItemDialog({
  onClose,
  initialData,
  onSubmit,
  purchaseOrders,
  spareParts,
  purchaseOrdersStatus,
  sparePartsStatus,
}: PurchaseOrderItemDialogProps) {

  const mapPurchaseOrderItemToFormValues = (poi: PurchaseOrderItem): PurchaseOrderItemFormValues => {
    return {
      id: poi.id,
      poId: poi.poId,
      sparePartId: poi.sparePartId,
      quantity: poi.quantity,
      unitPrice: poi.unitPrice,
      totalPrice: poi.totalPrice,
    };
  };

  const form = useForm<PurchaseOrderItemFormValues>({
    resolver: zodResolver(purchaseOrderItemFormSchema),
    defaultValues: initialData ? mapPurchaseOrderItemToFormValues(initialData) : {
      poId: "",
      sparePartId: "",
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
      form.reset(mapPurchaseOrderItemToFormValues(initialData));
    } else {
      form.reset({
        poId: "",
        sparePartId: "",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: PurchaseOrderItemFormValues) => {
    await onSubmit(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Item Purchase Order" : "Tambahkan Item Purchase Order Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail item purchase order yang sudah ada." : "Isi detail item purchase order untuk menambah data baru ke sistem."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field Purchase Order ID */}
            <FormField
              control={form.control}
              name="poId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Order</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Purchase Order" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {purchaseOrdersStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat Purchase Order...
                        </SelectItem>
                      )}
                      {purchaseOrdersStatus === "succeeded" && purchaseOrders.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada Purchase Order
                        </SelectItem>
                      )}
                      {purchaseOrders.map((po: PurchaseOrder) => (
                        <SelectItem key={po.id} value={po.id}>
                          {po.poNumber}
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
