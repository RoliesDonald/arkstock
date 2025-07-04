// src/app/(main)/purchase-orders/page.tsx
"use client";

import TableMain from "@/components/common/table/TableMain";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
// Nanti akan ada Redux slices untuk PO
// import { fetchPurchaseOrders, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder } from "@/store/slices/purchaseOrderSlice";

import {
  PurchaseOrder,
  PurchaseOrderFormValues,
  PurchaseOrderStatus,
} from "@/types/purchaseOrder";
import { Company } from "@/types/companies";
import { Employee } from "@/types/employee";
import { SparePart } from "@/types/sparepart";

// Data dummy (akan diganti dengan Redux store di masa depan)
import { purchaseOrderData as initialPurchaseOrderData } from "@/data/samplePurchaseOrderData";
import { companyData } from "@/data/sampleCompanyData";
import { employeeData } from "@/data/sampleEmployeeData";
import { sparePartData } from "@/data/sampleSparePartData";

import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4 for new PO creation
import PurchaseOrderDialog from "@/components/dialog/purchaseOrderDialog/_component/PurchaseOrderDialog";

export default function PurchaseOrderListPage() {
  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  // const dispatch = useAppDispatch(); // Akan diaktifkan saat Redux slice PO tersedia

  const [allPurchaseOrders, setAllPurchaseOrders] = useState<PurchaseOrder[]>(
    initialPurchaseOrderData
  );
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isPoDialogOpen, setIsPoDialogOpen] = useState<boolean>(false);
  const [editPoData, setEditPoData] = useState<
    PurchaseOrderFormValues | undefined
  >(undefined);

  // Helper untuk mendapatkan nama perusahaan/karyawan/sparepart berdasarkan ID
  const getCompanyNameById = useCallback(
    (companyId: string | null | undefined) => {
      if (!companyId) return "N/A";
      const company = companyData.find((c) => c.id === companyId);
      return company ? company.companyName : "Tidak Dikenal";
    },
    []
  );

  const getEmployeeNameById = useCallback(
    (employeeId: string | null | undefined) => {
      if (!employeeId) return "N/A";
      const employee = employeeData.find((e) => e.id === employeeId);
      return employee ? employee.name : "Tidak Dikenal";
    },
    []
  );

  const getSparePartNameById = useCallback(
    (sparePartId: string | null | undefined) => {
      if (!sparePartId) return "N/A";
      const sparePart = sparePartData.find((sp) => sp.id === sparePartId);
      return sparePart
        ? `${sparePart.name} (${sparePart.partNumber})`
        : "Tidak Dikenal";
    },
    []
  );

  const handleEditPurchaseOrder = useCallback((po: PurchaseOrder) => {
    // Konversi PurchaseOrder ke PurchaseOrderFormValues untuk edit
    setEditPoData({
      id: po.id,
      poNumber: po.poNumber,
      date: po.date,
      vendorId: po.vendorId,
      requestedById: po.requestedById,
      approvedById: po.approvedById,
      rejectionReason: po.rejectionReason,
      status: po.status,
      remark: po.remark,
      items: po.items.map((item) => ({
        id: item.id,
        sparePartId: item.sparePartId,
        itemName: item.itemName, // <-- PERUBAHAN: Menambahkan itemName
        partNumber: item.partNumber, // <-- PERUBAHAN: Menambahkan partNumber
        quantity: item.quantity,
        unit: item.unit, // <-- PERUBAHAN: Menambahkan unit
        unitPrice: item.unitPrice,
      })),
    });
    setIsPoDialogOpen(true);
  }, []);

  const handleSavePurchaseOrder = useCallback(
    async (values: PurchaseOrderFormValues) => {
      // Hitung totalAmount di sini
      const totalAmount = values.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );

      if (values.id) {
        // Mode edit
        setAllPurchaseOrders((prev) =>
          prev.map((po) =>
            po.id === values.id
              ? {
                  ...po,
                  ...values,
                  items: values.items.map((item) => ({
                    ...item,
                    totalPrice: item.quantity * item.unitPrice,
                  })),
                  totalAmount: totalAmount,
                  updatedAt: new Date(),
                }
              : po
          )
        );
      } else {
        // Mode tambah baru
        const newPo: PurchaseOrder = {
          id: uuidv4(),
          ...values,
          items: values.items.map((item) => ({
            ...item,
            totalPrice: item.quantity * item.unitPrice,
          })),
          poNumber: values.poNumber!, // poNumber seharusnya sudah terisi otomatis
          totalAmount: totalAmount,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setAllPurchaseOrders((prev) => [newPo, ...prev]);
      }
      setIsPoDialogOpen(false);
      setEditPoData(undefined);
    },
    []
  );

  const handleDeletePurchaseOrder = useCallback((poId: string) => {
    if (
      window.confirm("Apakah Anda yakin ingin menghapus Purchase Order ini?")
    ) {
      setAllPurchaseOrders((prev) => prev.filter((po) => po.id !== poId));
    }
  }, []);

  const purchaseOrderColumns: ColumnDef<PurchaseOrder>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      { accessorKey: "poNumber", header: "Nomor PO" },
      {
        accessorKey: "date",
        header: "Tanggal PO",
        cell: ({ row }) =>
          format(row.original.date, "dd-MM-yyyy", { locale: localeId }),
      },
      {
        accessorKey: "vendorId",
        header: "Vendor",
        cell: ({ row }) => getCompanyNameById(row.original.vendorId),
      },
      {
        accessorKey: "requestedById",
        header: "Diminta Oleh",
        cell: ({ row }) => getEmployeeNameById(row.original.requestedById),
      },
      {
        accessorKey: "approvedById",
        header: "Disetujui Oleh",
        cell: ({ row }) => getEmployeeNameById(row.original.approvedById),
      },
      {
        accessorKey: "totalAmount",
        header: "Total Jumlah",
        cell: ({ row }) =>
          `Rp${row.original.totalAmount.toLocaleString("id-ID")}`,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          let statusColor: string;
          switch (status) {
            case PurchaseOrderStatus.DRAFT:
              statusColor = "bg-gray-200 text-gray-800";
              break;
            case PurchaseOrderStatus.PENDING_APPROVAL:
              statusColor = "bg-yellow-200 text-yellow-800";
              break;
            case PurchaseOrderStatus.APPROVED:
              statusColor = "bg-green-200 text-green-800";
              break;
            case PurchaseOrderStatus.RECEIVED:
              statusColor = "bg-red-200 text-red-800";
              break;
            case PurchaseOrderStatus.COMPLETED:
              statusColor = "bg-blue-200 text-blue-800";
              break;
            case PurchaseOrderStatus.CANCELED:
              statusColor = "bg-purple-220 text-purple-800";
              break;
            default:
              statusColor = "bg-gray-100 text-gray-700";
          }
          return (
            <span
              className={`${statusColor} px-2 py-1 rounded-full text-xs font-semibold`}
            >
              {status.replace(/_/g, " ")}
            </span>
          );
        },
      },
      {
        accessorKey: "remark",
        header: "Catatan",
        cell: ({ row }) => row.original.remark || "-",
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const po = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open Menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => alert(`Lihat detail PO ${po.poNumber}`)}
                >
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditPurchaseOrder(po)}>
                  Edit Purchase Order
                </DropdownMenuItem>
                {po.status === PurchaseOrderStatus.PENDING_APPROVAL && (
                  <>
                    <DropdownMenuItem
                      onClick={() => alert(`Approve PO ${po.poNumber}`)}
                      className="text-green-600"
                    >
                      Setujui PO
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => alert(`Tolak PO ${po.poNumber}`)}
                      className="text-red-600"
                    >
                      Tolak PO
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem
                  onClick={() => handleDeletePurchaseOrder(po.id)}
                  className="text-red-600"
                >
                  Hapus Purchase Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [
      getCompanyNameById,
      getEmployeeNameById,
      handleEditPurchaseOrder,
      handleDeletePurchaseOrder,
    ]
  );

  const filteredPurchaseOrders = useMemo(() => {
    let currentPurchaseOrders = allPurchaseOrders;

    if (activeTab !== "all") {
      currentPurchaseOrders = currentPurchaseOrders.filter(
        (po) => po.status.toLowerCase() === activeTab
      );
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentPurchaseOrders = currentPurchaseOrders.filter(
        (po) =>
          Object.values(po).some(
            (value) =>
              (typeof value === "string" &&
                value.toLowerCase().includes(lowerCaseQuery)) ||
              (value instanceof Date &&
                format(value, "dd-MM-yyyy").includes(lowerCaseQuery)) ||
              (typeof value === "number" &&
                value.toString().includes(lowerCaseQuery))
          ) ||
          getCompanyNameById(po.vendorId)
            .toLowerCase()
            .includes(lowerCaseQuery) ||
          getEmployeeNameById(po.requestedById)
            .toLowerCase()
            .includes(lowerCaseQuery) ||
          getEmployeeNameById(po.approvedById)
            .toLowerCase()
            .includes(lowerCaseQuery) ||
          po.items.some((item) =>
            getSparePartNameById(item.sparePartId)
              .toLowerCase()
              .includes(lowerCaseQuery)
          )
      );
    }
    return currentPurchaseOrders;
  }, [
    allPurchaseOrders,
    activeTab,
    searchQuery,
    getCompanyNameById,
    getEmployeeNameById,
    getSparePartNameById,
  ]);

  const purchaseOrderTabItems = useMemo(() => {
    const allCount = allPurchaseOrders.length;
    const tabItems = [{ value: "all", label: "Semua PO", count: allCount }];

    Object.values(PurchaseOrderStatus).forEach((status) => {
      tabItems.push({
        value: status.toLowerCase(),
        label: status.replace(/_/g, " "),
        count: allPurchaseOrders.filter((po) => po.status === status).length,
      });
    });

    return tabItems;
  }, [allPurchaseOrders]);

  return (
    <TableMain<PurchaseOrder>
      searchQuery={searchQuery}
      data={filteredPurchaseOrders}
      columns={purchaseOrderColumns}
      tabItems={purchaseOrderTabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showAddButton={true}
      showDownloadPrintButtons={true}
      emptyMessage="Tidak ada Purchase Order ditemukan."
      isDialogOpen={isPoDialogOpen}
      onOpenChange={setIsPoDialogOpen}
      dialogContent={
        <PurchaseOrderDialog
          onClose={() => {
            setIsPoDialogOpen(false);
            setEditPoData(undefined);
          }}
          onSubmitPurchaseOrder={handleSavePurchaseOrder}
          initialData={editPoData}
        />
      }
      dialogTitle={
        editPoData ? "Edit Purchase Order" : "Buat Purchase Order Baru"
      }
      dialogDescription={
        editPoData
          ? "Perbarui detail Purchase Order ini."
          : "Isi detail Purchase Order untuk pengadaan suku cadang."
      }
    />
  );
}
