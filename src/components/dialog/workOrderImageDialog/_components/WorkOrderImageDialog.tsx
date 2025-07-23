"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { WorkOrderImage } from "@/types/workOrderImages"; 
import { WorkOrder } from "@/types/workOrder"; 
import { workOrderImageFormSchema, WorkOrderImageFormValues } from "@/schemas/workOrderImage"; 

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
import { Textarea } from "@/components/ui/textarea";

interface WorkOrderImageDialogProps {
  onClose: () => void;
  onSubmit: (values: WorkOrderImageFormValues) => Promise<void>;
  initialData?: WorkOrderImage;
  workOrders: WorkOrder[];
  workOrdersStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export default function WorkOrderImageDialog({
  onClose,
  initialData,
  onSubmit,
  workOrders,
  workOrdersStatus,
}: WorkOrderImageDialogProps) {

  const mapWorkOrderImageToFormValues = (woi: WorkOrderImage): WorkOrderImageFormValues => {
    return {
      id: woi.id,
      workOrderId: woi.workOrderId,
      imageUrl: woi.imageUrl,
      description: woi.description,
      uploadedBy: woi.uploadedBy,
    };
  };

  const form = useForm<WorkOrderImageFormValues>({
    resolver: zodResolver(workOrderImageFormSchema),
    defaultValues: initialData ? mapWorkOrderImageToFormValues(initialData) : {
      workOrderId: "",
      imageUrl: "",
      description: null,
      uploadedBy: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(mapWorkOrderImageToFormValues(initialData));
    } else {
      form.reset({
        workOrderId: "",
        imageUrl: "",
        description: null,
        uploadedBy: null,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: WorkOrderImageFormValues) => {
    await onSubmit(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Gambar Work Order" : "Tambahkan Gambar Work Order Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail gambar work order yang sudah ada." : "Isi detail gambar work order untuk menambah data baru ke sistem."}
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
            {/* Field Image URL */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Gambar</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
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
                    <Textarea placeholder="Deskripsi gambar..." {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Uploaded By (Jika ingin diisi manual, atau bisa diisi otomatis dari auth user) */}
            <FormField
              control={form.control}
              name="uploadedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diunggah Oleh (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="ID Karyawan" {...field} value={field.value || ""} />
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
