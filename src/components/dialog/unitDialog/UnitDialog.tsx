"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { unitFormSchema, UnitFormValues } from "@/types/unit";
import { zodResolver } from "@hookform/resolvers/zod";
import { on } from "events";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

interface UnitDialogProps {
  onClose: () => void;
  onSubmitUnit: (values: UnitFormValues) => void;
  initialData?: UnitFormValues;
}

const UnitDialog: React.FC<UnitDialogProps> = ({
  onClose,
  onSubmitUnit,
  initialData,
}) => {
  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: useMemo(() => {
      return initialData
        ? { ...initialData, description: initialData.description ?? null }
        : { name: "", description: null };
    }, [initialData]),
  });

  const onSubmit = async (values: UnitFormValues) => {
    console.log("Mengirim data unit:", values);
    onSubmitUnit(values);
    onClose();
    form.reset;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 py-4 max-h-[70vh] overflow-auto pr-4"
      >
        <Card>
          <CardHeader>
            <CardTitle>Info Unit</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Unit</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Pcs, Liter...." {...field} />
                  </FormControl>
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
                    <Textarea
                      placeholder="Deskripsi singkat tentang satuan ini"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <DialogFooter>
          <Button variant={"outline"} type="button" onClick={onClose}>
            Batal
          </Button>
          <Button type={"submit"}>{initialData ? "Update" : "Tambah"}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
export default UnitDialog;
