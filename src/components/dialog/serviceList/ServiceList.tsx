"use client";

import React, { useMemo, useState } from "react";
import { Service, ServiceFormValues } from "@/types/services";
import { SparePart } from "@/types/sparepart"; // Import SparePart type
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ServiceDialog from "@/components/dialog/serviceDialog/ServiceDialog";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { ChevronDown, ChevronUp } from "lucide-react"; // Untuk ikon expand/collapse

interface ServiceListProps {
  services: Service[];
  onAddService: (values: ServiceFormValues) => void;
  onUpdateService: (values: Service) => void;
  onDeleteService: (id: string) => void;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  availableSpareParts: SparePart[]; // Tambahkan prop ini
}

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  onAddService,
  onUpdateService,
  onDeleteService,
  status,
  error,
  availableSpareParts, // Terima prop ini
}) => {
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>(
    undefined
  );
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(
    null
  );

  const handleEditClick = (service: Service) => {
    setEditingService(service);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (serviceId: string, serviceName: string) => {
    if (
      window.confirm(`Apakah Anda yakin ingin menghapus jasa "${serviceName}"?`)
    ) {
      onDeleteService(serviceId);
    }
  };

  const toggleExpand = (serviceId: string) => {
    setExpandedServiceId((prevId) => (prevId === serviceId ? null : serviceId));
  };

  const sparePartMap = useMemo(
    () => new Map(availableSpareParts.map((part) => [part.id, part])),
    [availableSpareParts]
  );

  // Fungsi helper untuk mendapatkan nama spare part dari ID
  const getSparePartName = (id: string) => {
    const part = sparePartMap.get(id);
    return part ? `${part.name} (${part.partNumber})` : "Tidak Dikenal";
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Daftar Paket</CardTitle>
        <Dialog
          open={isAddEditDialogOpen}
          onOpenChange={setIsAddEditDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>Paket Baru</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Jasa Baru</DialogTitle>
              <DialogDescription>
                Masukkan detail jasa yang akan ditambahkan, termasuk pekerjaan
                dan spare part yang dibutuhkan.
              </DialogDescription>
            </DialogHeader>
            <ServiceDialog
              onClose={() => setIsAddEditDialogOpen(false)}
              onSubmitService={onAddService}
              availableSpareParts={availableSpareParts} // Teruskan prop ini
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {status === "loading" && (
          <div className="text-center py-4">Memuat jasa...</div>
        )}
        {status === "failed" && (
          <div className="text-center py-4 text-red-500">Error: {error}</div>
        )}
        {status === "succeeded" && services.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            Tidak ada jasa yang terdaftar.
          </div>
        )}

        {status === "succeeded" && services.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>Nama Paket</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Sub-Kategori</TableHead>
                  <TableHead className="text-right">Harga Satuan</TableHead>
                  <TableHead className="text-center">Dibuat</TableHead>
                  <TableHead className="text-center">Diperbarui</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service, index) => (
                  <React.Fragment key={service.id}>
                    <TableRow>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        {service.serviceName}
                        {(service.tasks?.length > 0 ||
                          service.requiredSpareParts?.length > 0) && (
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto ml-2"
                            onClick={() => toggleExpand(service.id!)}
                          >
                            {expandedServiceId === service.id ? (
                              <ChevronUp className="h-4 w-4 mr-1" />
                            ) : (
                              <ChevronDown className="h-4 w-4 mr-1" />
                            )}
                            Detail
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>{service.category}</TableCell>
                      <TableCell>{service.subCategory}</TableCell>
                      <TableCell className="text-right">
                        Rp{service.unitPrice.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-center">
                        {format(service.createdAt!, "dd-MM-yyyy HH:mm", {
                          locale: localeId,
                        })}
                      </TableCell>
                      <TableCell className="text-center">
                        {format(service.updatedAt!, "dd-MM-yyyy HH:mm", {
                          locale: localeId,
                        })}
                      </TableCell>
                      <TableCell className="flex justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(service)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleDeleteClick(service.id!, service.serviceName)
                          }
                        >
                          Hapus
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedServiceId === service.id && (
                      <TableRow>
                        <TableCell colSpan={8} className="py-4 px-6 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Pekerjaan:</h4>
                              {service.tasks && service.tasks.length > 0 ? (
                                <ul className="list-disc list-inside text-sm text-gray-700">
                                  {service.tasks.map((task, taskIdx) => (
                                    <li key={taskIdx}>{task}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  Tidak ada pekerjaan terdaftar.
                                </p>
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">
                                Spare Part yang Dibutuhkan:
                              </h4>
                              {service.requiredSpareParts &&
                              service.requiredSpareParts.length > 0 ? (
                                <ul className="list-disc list-inside text-sm text-gray-700">
                                  {service.requiredSpareParts.map(
                                    (sp, spIdx) => (
                                      <li key={spIdx}>
                                        {getSparePartName(sp.sparePartId)} -
                                        Qty: {sp.quantity}
                                      </li>
                                    )
                                  )}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  Tidak ada spare part yang dibutuhkan.
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Dialog Edit Jasa */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Jasa</DialogTitle>
              <DialogDescription>
                Ubah detail jasa ini. Klik simpan saat Anda selesai.
              </DialogDescription>
            </DialogHeader>
            {editingService && (
              <ServiceDialog
                onClose={() => setIsEditDialogOpen(false)}
                onSubmitService={(values) =>
                  onUpdateService({ ...editingService, ...values })
                }
                initialData={editingService}
                availableSpareParts={availableSpareParts} // Teruskan prop ini
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ServiceList;
