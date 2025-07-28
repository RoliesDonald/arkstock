// src/components/dialog/sparePartDialog/SparePartDialog.tsx
import { SparePart } from "@/types/sparepart";
import { SparePartFormValues,sparePartFormSchema } from "@/schemas/sparePart";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

// Hapus import Prisma enum langsung dari @prisma/client di sini
// import { PartVariant, SparePartCategory, SparePartStatus } from "@prisma/client";

// Definisikan tipe untuk enum yang akan kita ambil dari API
interface EnumsApiResponse {
  SparePartCategory: string[];
  SparePartStatus: string[];
  PartVariant: string[];
}

interface SparePartDialogProps {
  onClose: () => void;
  initialData?: SparePart;
  onSubmit: (values: SparePartFormValues) => void;
  enums: EnumsApiResponse | null; // KUNCI PERBAIKAN: Terima enums sebagai prop
}

export default function SparePartDialog({ onClose, initialData, onSubmit, enums }: SparePartDialogProps) {
  const form = useForm<SparePartFormValues>({
    resolver: zodResolver(sparePartFormSchema),
    defaultValues: initialData || {
      partNumber: "",
      partName: "",
      category: undefined, // Set to undefined for initial empty state
      unit: "",
      stock: 0,
      price: 0,
      variant: undefined, // Set to undefined
      status: undefined, // Set to undefined
      sku: "",
      make: "",
      brand: "",
      manufacturer: "",
      description: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = (values: SparePartFormValues) => {
    onSubmit(values);
  };

  if (!enums) {
    return <div className="text-center p-4">Memuat data enum...</div>; // Tampilkan loading jika enum belum ada
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="partNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Part</FormLabel>
              <FormControl>
                <Input placeholder="Nomor Part" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="partName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Part</FormLabel>
              <FormControl>
                <Input placeholder="Nama Part" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {enums.SparePartCategory.map((category) => ( // KUNCI PERBAIKAN: Gunakan enums dari prop
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
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormControl>
                <Input placeholder="Unit" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stok Saat Ini</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Stok" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga Satuan</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Harga" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="variant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Varian</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Varian" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {enums.PartVariant.map((variant) => ( // KUNCI PERBAIKAN: Gunakan enums dari prop
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
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {enums.SparePartStatus.map((status) => ( // KUNCI PERBAIKAN: Gunakan enums dari prop
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
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input placeholder="SKU" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="make"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Merk</FormLabel>
              <FormControl>
                <Input placeholder="Merk" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <FormControl>
                <Input placeholder="Brand" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="manufacturer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manufaktur</FormLabel>
              <FormControl>
                <Input placeholder="Manufaktur" {...field} />
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
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea placeholder="Deskripsi Spare Part" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </Form>
  );
}
