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
import { PurchaseOrder, RawPurchaseOrderApiResponse } from "@/types/purchaseOrder"; 
import { PurchaseOrderFormValues } from "@/schemas/purchaseOrder"; 
import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog } from "@/components/ui/dialog"; 
import { useToast } from "@/hooks/use-toast";
import { fetchPurchaseOrders, formatPurchaseOrderDates } from "@/store/slices/purchaseOrderSlice"; 
import { PurchaseOrderStatus } from "@prisma/client"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import PurchaseOrderDialogWrapper from "@/components/dialog/purchaseOrderDialog/_component/PurchaseOrderDialogWrapper";

export default function PurchaseOrderListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allPurchaseOrders = useAppSelector((state) => state.purchaseOrders.purchaseOrders);
  const loading = useAppSelector((state) => state.purchaseOrders.status === 'loading');
  const error = useAppSelector((state) => state.purchaseOrders.error);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isPurchaseOrderDialogOpen, setIsPurchaseOrderDialogOpen] = useState<boolean>(false);
  const [editPurchaseOrderData, setEditPurchaseOrderData] = useState<PurchaseOrder | undefined>(undefined);
  const [purchaseOrderToDelete, setPurchaseOrderToDelete] = useState<PurchaseOrder | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchPurchaseOrders());
  }, [dispatch]);

  const handleDetailPurchaseOrder = useCallback(
    (purchaseOrder: PurchaseOrder) => {
      router.push(`/purchase-orders/${purchaseOrder.id}`);
    },
    [router]
  );

  const handleEditPurchaseOrder = useCallback((purchaseOrder: PurchaseOrder) => {
    setEditPurchaseOrderData(purchaseOrder);
    setIsPurchaseOrderDialogOpen(true);
  }, []);

  const handleSubmitPurchaseOrder = useCallback(
    async (values: PurchaseOrderFormValues) => {
      console.log("Submit Purchase Order:", values);
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Error",
          description: "Tidak ada token otentikasi. Silakan login kembali.",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }

      try {
        const url = `http://localhost:3000/api/purchase-orders${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<PurchaseOrder | RawPurchaseOrderApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<PurchaseOrder | RawPurchaseOrderApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Purchase Order berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsPurchaseOrderDialogOpen(false);
        setEditPurchaseOrderData(undefined);
        dispatch(fetchPurchaseOrders()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan Purchase Order.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeletePurchaseOrder = useCallback(
    async (purchaseOrderId: string) => {
      console.log("Delete Purchase Order ID:", purchaseOrderId);
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Error",
          description: "Tidak ada token otentikasi. Silakan login kembali.",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }

      try {
        await api.delete(`http://localhost:3000/api/purchase-orders/${purchaseOrderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Purchase Order berhasil dihapus.",
        });
        setPurchaseOrderToDelete(undefined);
        dispatch(fetchPurchaseOrders()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus Purchase Order.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const purchaseOrderColumns: ColumnDef<PurchaseOrder>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() ? true : (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all rows"
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
        accessorKey: "poDate",
        header: "Tanggal PO",
        cell: ({ row }) => format(row.original.poDate, "PPP", { locale: localeId }),
      },
      { accessorKey: "supplier.companyName", header: "Supplier" },
      { accessorKey: "totalAmount", header: "Total Jumlah", cell: ({ row }) => `Rp${row.original.totalAmount.toLocaleString('id-ID')}` },
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
            case PurchaseOrderStatus.REJECTED:
              statusColor = "bg-red-200 text-red-800";
              break;
            case PurchaseOrderStatus.COMPLETED:
              statusColor = "bg-blue-200 text-blue-800";
              break;
            case PurchaseOrderStatus.CANCELED:
              statusColor = "bg-purple-200 text-purple-800";
              break;
            case PurchaseOrderStatus.ORDERED:
              statusColor = "bg-indigo-200 text-indigo-800";
              break;
            case PurchaseOrderStatus.SHIPPED:
              statusColor = "bg-teal-200 text-teal-800";
              break;
            case PurchaseOrderStatus.RECEIVED:
              statusColor = "bg-lime-200 text-lime-800";
              break;
            case PurchaseOrderStatus.PARTIALLY_RECEIVED:
              statusColor = "bg-orange-200 text-orange-800";
              break;
            default:
              statusColor = "bg-gray-400 text-gray-800";
          }
          return (
            <span className={`${statusColor} px-2 py-1 rounded-full text-xs font-semibold`}>{status.replace(/_/g, " ")}</span>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const purchaseOrder = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open Menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleDetailPurchaseOrder(purchaseOrder)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditPurchaseOrder(purchaseOrder)}>
                  Edit Purchase Order
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPurchaseOrderToDelete(purchaseOrder)} className="text-red-600">
                  Hapus Purchase Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailPurchaseOrder, handleEditPurchaseOrder]
  );

  const purchaseOrderTabItems = useMemo(() => {
    return [
      { value: "all", label: "All", count: allPurchaseOrders.length },
      // Tabs for PurchaseOrderStatus
      {
        value: PurchaseOrderStatus.DRAFT.toLowerCase(),
        label: "Draft",
        count: allPurchaseOrders.filter((po) => po.status === PurchaseOrderStatus.DRAFT).length,
      },
      {
        value: PurchaseOrderStatus.PENDING_APPROVAL.toLowerCase(),
        label: "Menunggu Persetujuan",
        count: allPurchaseOrders.filter((po) => po.status === PurchaseOrderStatus.PENDING_APPROVAL).length,
      },
      {
        value: PurchaseOrderStatus.APPROVED.toLowerCase(),
        label: "Disetujui",
        count: allPurchaseOrders.filter((po) => po.status === PurchaseOrderStatus.APPROVED).length,
      },
      {
        value: PurchaseOrderStatus.REJECTED.toLowerCase(),
        label: "Ditolak",
        count: allPurchaseOrders.filter((po) => po.status === PurchaseOrderStatus.REJECTED).length,
      },
      {
        value: PurchaseOrderStatus.COMPLETED.toLowerCase(),
        label: "Selesai",
        count: allPurchaseOrders.filter((po) => po.status === PurchaseOrderStatus.COMPLETED).length,
      },
      {
        value: PurchaseOrderStatus.CANCELED.toLowerCase(),
        label: "Dibatalkan",
        count: allPurchaseOrders.filter((po) => po.status === PurchaseOrderStatus.CANCELED).length,
      },
      {
        value: PurchaseOrderStatus.ORDERED.toLowerCase(),
        label: "Dipesan",
        count: allPurchaseOrders.filter((po) => po.status === PurchaseOrderStatus.ORDERED).length,
      },
      {
        value: PurchaseOrderStatus.SHIPPED.toLowerCase(),
        label: "Dikirim",
        count: allPurchaseOrders.filter((po) => po.status === PurchaseOrderStatus.SHIPPED).length,
      },
      {
        value: PurchaseOrderStatus.RECEIVED.toLowerCase(),
        label: "Diterima",
        count: allPurchaseOrders.filter((po) => po.status === PurchaseOrderStatus.RECEIVED).length,
      },
      {
        value: PurchaseOrderStatus.PARTIALLY_RECEIVED.toLowerCase(),
        label: "Diterima Sebagian",
        count: allPurchaseOrders.filter((po) => po.status === PurchaseOrderStatus.PARTIALLY_RECEIVED).length,
      },
    ];
  }, [allPurchaseOrders]);

  const filteredPurchaseOrders = useMemo(() => {
    let data = allPurchaseOrders;

    if (activeTab !== "all") {
      data = data.filter((po) => {
        const lowerCaseActiveTab = activeTab.toLowerCase();
        // Cek berdasarkan PurchaseOrderStatus
        if (Object.values(PurchaseOrderStatus).some(s => s.toLowerCase() === lowerCaseActiveTab)) {
          return po.status.toLowerCase() === lowerCaseActiveTab;
        }
        return false;
      });
    }

    return data.filter((po) =>
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (po.deliveryAddress && po.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (po.remark && po.remark.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (po.rejectionReason && po.rejectionReason.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (po.supplier?.companyName && po.supplier.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (po.requestedBy?.name && po.requestedBy.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (po.approvedBy?.name && po.approvedBy.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allPurchaseOrders, activeTab, searchQuery]);

  const handleAddNewPurchaseOrderClick = useCallback(() => {
    setEditPurchaseOrderData(undefined);
    setIsPurchaseOrderDialogOpen(true);
  }, []);

  const handlePurchaseOrderDialogClose = useCallback(() => {
    setIsPurchaseOrderDialogOpen(false);
    setEditPurchaseOrderData(undefined);
  }, []);

  return (
    <>
      <TableMain<PurchaseOrder>
        searchQuery={searchQuery}
        data={filteredPurchaseOrders}
        columns={purchaseOrderColumns}
        tabItems={purchaseOrderTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewPurchaseOrderClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Purchase Order ditemukan."
        }
      />

      <Dialog open={isPurchaseOrderDialogOpen} onOpenChange={setIsPurchaseOrderDialogOpen}>
        <PurchaseOrderDialogWrapper 
          onClose={handlePurchaseOrderDialogClose}
          initialData={editPurchaseOrderData}
          onSubmit={handleSubmitPurchaseOrder}
        />
      </Dialog>

      <AlertDialog open={!!purchaseOrderToDelete} onOpenChange={(open) => !open && setPurchaseOrderToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus Purchase Order &quot;
              {purchaseOrderToDelete?.poNumber}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPurchaseOrderToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => purchaseOrderToDelete && handleDeletePurchaseOrder(purchaseOrderToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
