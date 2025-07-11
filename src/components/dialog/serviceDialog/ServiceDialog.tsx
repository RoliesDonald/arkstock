import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Service,
  ServiceFormValues,
  serviceFormSchema,
} from "@/types/services";
import { SparePart } from "@/types/sparepart"; // Import SparePart type
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, XCircle } from "lucide-react"; // Untuk ikon tambah/hapus

interface ServiceDialogProps {
  onClose: () => void;
  onSubmitService: (values: ServiceFormValues) => void;
  initialData?: Service;
  availableSpareParts: SparePart[];
}

const createDefaultValues = (initialData?: Service): ServiceFormValues => {
  return initialData
    ? {
        ...initialData,
        tasks:
          initialData.tasks && initialData.tasks.length > 0
            ? initialData.tasks
            : [""],
        requiredSpareParts:
          initialData.requiredSpareParts &&
          initialData.requiredSpareParts.length > 0
            ? initialData.requiredSpareParts
            : [{ sparePartId: "", quantity: 1 }],
      }
    : {
        serviceName: "",
        category: "",
        subCategory: "",
        description: "",
        unitPrice: 0,
        tasks: [""],
        requiredSpareParts: [{ sparePartId: "", quantity: 1 }],
      };
};

const ServiceDialog: React.FC<ServiceDialogProps> = ({
  onClose,
  onSubmitService,
  initialData,
  availableSpareParts,
}) => {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: createDefaultValues(initialData),
  });

  // Untuk mengelola daftar tugas secara dinamis
  const {
    fields: taskFields,
    append: appendTask,
    remove: removeTask,
  } = useFieldArray<ServiceFormValues>({
    control: form.control,
    name: "tasks", // This is correct for tasks
  });

  // Untuk mengelola daftar spare part yang dibutuhkan secara dinamis
  const {
    fields: sparePartFields,
    append: appendSparePart,
    remove: removeSparePart,
  } = useFieldArray<ServiceFormValues>({
    control: form.control,
    name: "requiredSpareParts",
  });

  // Setel nilai form jika initialData berubah (untuk mode edit)
  useEffect(() => {
    form.reset(createDefaultValues(initialData));
  }, [initialData, form.reset, form]);

  const onSubmit = (values: ServiceFormValues) => {
    // Filter tugas dan spare part yang kosong sebelum submit
    const filteredTasks =
      values.tasks?.filter((task) => task.trim() !== "") || [];
    const filteredSpareParts =
      values.requiredSpareParts?.filter((sp) => sp.sparePartId !== "") || [];

    onSubmitService({
      ...values,
      tasks: filteredTasks,
      requiredSpareParts: filteredSpareParts,
    });
    onClose(); // Tutup dialog setelah submit
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        <FormField
          control={form.control}
          name="serviceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Jasa</FormLabel>
              <FormControl>
                <Input placeholder="Nama Jasa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Perawatan berkala" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sub-Kategori</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Service Ringan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi (Opsional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Deskripsi jasa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unitPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga Satuan</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bagian Daftar Pekerjaan */}
        <div>
          <Label className="block mb-2">Daftar Pekerjaan</Label>
          {taskFields.map((item, index) => (
            <div key={item.id} className="flex items-center space-x-2 mb-2">
              <FormField
                control={form.control}
                name={`tasks.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input
                        placeholder={`Pekerjaan ${index + 1}`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeTask(index)}
              >
                <XCircle className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendTask("")} // Append an empty string for a new task
            className="mt-2"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pekerjaan
          </Button>
        </div>

        {/* Bagian Daftar Spare Part yang Dibutuhkan */}
        <div>
          <Label className="block mb-2">Spare Part yang Dibutuhkan</Label>
          {sparePartFields.map((item, index) => (
            <div key={item.id} className="flex items-center space-x-2 mb-2">
              <FormField
                control={form.control}
                name={`requiredSpareParts.${index}.sparePartId`}
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Spare Part" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableSpareParts.map((sp) => (
                          <SelectItem key={sp.id} value={sp.id}>
                            {sp.name} ({sp.partNumber})
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
                name={`requiredSpareParts.${index}.quantity`}
                render={({ field }) => (
                  <FormItem className="w-24">
                    <FormControl>
                      <Input type="number" placeholder="Qty" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeSparePart(index)}
              >
                <XCircle className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendSparePart({ sparePartId: "", quantity: 1 })}
            className="mt-2"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Spare Part
          </Button>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">Simpan Jasa</Button>
        </div>
      </form>
    </Form>
  );
};

export default ServiceDialog;
