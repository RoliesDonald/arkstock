// src/components/dialog/unitDialog/_components/UnitDialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { Unit } from "@/types/unit"; 
import { unitFormSchema, UnitFormValues } from "@/schemas/unit"; 
import { UnitType, UnitCategory } from "@prisma/client"; 

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
import { Textarea } from "@/components/ui/textarea"; // For description
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UnitDialogProps {
  onClose: () => void;
  onSubmit: (values: UnitFormValues) => Promise<void>;
  initialData?: Unit;
}

export default function UnitDialog({
  onClose,
  initialData,
  onSubmit,
}: UnitDialogProps) {

  const mapUnitToFormValues = (unit: Unit): UnitFormValues => {
    return {
      id: unit.id,
      name: unit.name,
      symbol: unit.symbol || null,
      unitType: unit.unitType,
      unitCategory: unit.unitCategory,
      description: unit.description || null,
    };
  };

  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: initialData ? mapUnitToFormValues(initialData) : {
      name: "",
      symbol: null,
      unitType: UnitType.MEASUREMENT, // Default type
      unitCategory: UnitCategory.COUNT, // Default category
      description: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(mapUnitToFormValues(initialData));
    } else {
      form.reset({
        name: "",
        symbol: null,
        unitType: UnitType.MEASUREMENT,
        unitCategory: UnitCategory.COUNT,
        description: null,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: UnitFormValues) => {
    await onSubmit(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Unit" : "Tambahkan Unit Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail unit yang sudah ada." : "Isi detail unit untuk menambah data unit baru ke sistem."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Unit</FormLabel>
                  <FormControl>
                    <Input placeholder="Kilogram" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Symbol */}
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Simbol (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="kg" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Unit Type */}
            <FormField
              control={form.control}
              name="unitType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Unit</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Tipe Unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(UnitType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Unit Category */}
            <FormField
              control={form.control}
              name="unitCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Unit</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kategori Unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(UnitCategory).map((category) => (
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
            {/* Field Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Deskripsi unit..." {...field} value={field.value || ""} />
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
