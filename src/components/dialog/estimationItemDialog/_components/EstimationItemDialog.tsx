// src/components/dialog/estimationItemDialog/_components/EstimationItemDialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { EstimationItem } from "@/types/estimationItems"; 
import { Estimation } from "@/types/estimation"; 
import { SparePart } from "@/types/sparepart"; 
import { estimationItemFormSchema, EstimationItemFormValues } from "@/schemas/estimationItem"; 

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

interface EstimationItemDialogProps {
  onClose: () => void;
  onSubmit: (values: EstimationItemFormValues) => Promise<void>;
  initialData?: EstimationItem;
  estimations: Estimation[];
  spareParts: SparePart[];
  estimationsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  sparePartsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export default function EstimationItemDialog({
  onClose,
  initialData,
  onSubmit,
  estimations,
  spareParts,
  estimationsStatus,
  sparePartsStatus,
}: EstimationItemDialogProps) {

  const mapEstimationItemToFormValues = (ei: EstimationItem): EstimationItemFormValues => {
    return {
      id: ei.id,
      estimationId: ei.estimationId,
      sparePartId: ei.sparePartId,
      quantity: ei.quantity,
      price: ei.price,
      subtotal: ei.subtotal,
    };
  };

  const form = useForm<EstimationItemFormValues>({
    resolver: zodResolver(estimationItemFormSchema),
    defaultValues: initialData ? mapEstimationItemToFormValues(initialData) : {
      estimationId: "",
      sparePartId: "",
      quantity: 1,
      price: 0,
      subtotal: 0,
    },
  });

  // Calculate subtotal whenever quantity or price changes
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name === 'quantity' || name === 'price') {
        const qty = value.quantity || 0;
        const price = value.price || 0;
        form.setValue('subtotal', qty * price, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);


  useEffect(() => {
    if (initialData) {
      form.reset(mapEstimationItemToFormValues(initialData));
    } else {
      form.reset({
        estimationId: "",
        sparePartId: "",
        quantity: 1,
        price: 0,
        subtotal: 0,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: EstimationItemFormValues) => {
    await onSubmit(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Item Estimasi" : "Tambahkan Item Estimasi Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail item estimasi yang sudah ada." : "Isi detail item estimasi untuk menambah data baru ke sistem."}
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
            {/* Field Price */}
            <FormField
              control={form.control}
              name="price"
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
            {/* Field Subtotal (Read-only) */}
            <FormField
              control={form.control}
              name="subtotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtotal</FormLabel>
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
