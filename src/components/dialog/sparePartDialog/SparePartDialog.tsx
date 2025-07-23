"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { SparePart } from "@/types/sparepart"; 
import { sparePartFormSchema, SparePartFormValues } from "@/schemas/sparePart"; 
import { PartVariant, SparePartCategory, SparePartStatus } from "@prisma/client"; 

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

interface SparePartDialogProps {
  onClose: () => void;
  onSubmit: (values: SparePartFormValues) => Promise<void>;
  initialData?: SparePart;
  // Jika ada data tambahan yang dibutuhkan dari Redux (misal daftar vehicles untuk SparePartSuitableVehicle),
  // maka akan diteruskan di sini sebagai props. Untuk saat ini, tidak ada.
}

export default function SparePartDialog({
  onClose,
  initialData,
  onSubmit,
}: SparePartDialogProps) {

  const mapSparePartToFormValues = (sparePart: SparePart): SparePartFormValues => {
    return {
      id: sparePart.id,
      partNumber: sparePart.partNumber,
      sku: sparePart.sku || null,
      partName: sparePart.partName,
      variant: sparePart.variant,
      make: sparePart.make || null,
      price: sparePart.price,
      unit: sparePart.unit,
      description: sparePart.description || null,
      stock: sparePart.stock,
      initialStock: sparePart.initialStock,
      brand: sparePart.brand || null,
      manufacturer: sparePart.manufacturer || null,
      category: sparePart.category,
      status: sparePart.status,
    };
  };

  const form = useForm<SparePartFormValues>({
    resolver: zodResolver(sparePartFormSchema),
    defaultValues: initialData ? mapSparePartToFormValues(initialData) : {
      partNumber: "",
      sku: null,
      partName: "",
      variant: PartVariant.OEM, // Default variant
      make: null,
      price: 0,
      unit: "",
      description: null,
      stock: 0, // Default stock
      initialStock: 0, // Default initial stock
      brand: null,
      manufacturer: null,
      category: SparePartCategory.ENGINE, // Default category
      status: SparePartStatus.AVAILABLE, // Default status
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(mapSparePartToFormValues(initialData));
    } else {
      form.reset({
        partNumber: "",
        sku: null,
        partName: "",
        variant: PartVariant.OEM,
        make: null,
        price: 0,
        unit: "",
        description: null,
        stock: 0,
        initialStock: 0,
        brand: null,
        manufacturer: null,
        category: SparePartCategory.ENGINE,
        status: SparePartStatus.AVAILABLE,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: SparePartFormValues) => {
    await onSubmit(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Spare Part" : "Tambahkan Spare Part Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail spare part yang sudah ada." : "Isi detail spare part untuk menambah data spare part baru ke sistem."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field Part Number */}
            <FormField
              control={form.control}
              name="partNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Part</FormLabel>
                  <FormControl>
                    <Input placeholder="PN-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field SKU */}
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="SKU-XYZ" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Part Name */}
            <FormField
              control={form.control}
              name="partName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Part</FormLabel>
                  <FormControl>
                    <Input placeholder="Filter Oli" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Variant */}
            <FormField
              control={form.control}
              name="variant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Varian Part</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Varian" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(PartVariant).map((variant) => (
                        <SelectItem key={variant} value={variant}>
                          {variant.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Make */}
            <FormField
              control={form.control}
              name="make"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Merk (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Toyota" {...field} value={field.value || ""} />
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
            {/* Field Unit */}
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input placeholder="pcs" {...field} />
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
                    <Input placeholder="Deskripsi spare part..." {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Stock */}
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Saat Ini</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Initial Stock */}
            <FormField
              control={form.control}
              name="initialStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Awal</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Brand */}
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Denso" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Manufacturer */}
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufaktur (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="PT Manufaktur Jaya" {...field} value={field.value || ""} />
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
                  <FormLabel>Kategori</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(SparePartCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(SparePartStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
