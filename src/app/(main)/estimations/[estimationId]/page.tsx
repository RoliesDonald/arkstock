"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchEstimates } from "@/store/slices/estimationSlice";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Estimation } from "@/types/estimation";
import { EstimationStatus } from "@/types/estimation";

// Komponen EstimateDetail yang digabungkan
interface EstimateDetailProps {
  estimate: Estimation;
}

const EstimateDetail: React.FC<EstimateDetailProps> = ({ estimate }) => {
  // Hitung total estimasi dari estimationItems dan estimationServices
  const totalServices =
    estimate.estimationServices?.reduce(
      (sum, service) => sum + service.totalPrice,
      0
    ) || 0;
  const totalItems =
    estimate.estimationItems?.reduce((sum, item) => sum + item.totalPrice, 0) ||
    0;
  // Grand total diambil dari totalEstimatedAmount yang sudah ada di objek estimate
  // const grandTotal = totalServices + totalItems; // Ini tidak lagi diperlukan jika totalEstimatedAmount sudah ada

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden my-8 p-6">
      <CardHeader className="pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-2xl font-extrabold text-blue-700 mr-2">
              DSF
            </span>
            <span className="text-sm text-gray-600">
              SMART WAY FOR BETTER LIFE
            </span>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800">
            DETAIL ESTIMASI
          </CardTitle>
        </div>

        {/* Informasi Perusahaan Penerbit */}
        <div className="text-sm text-gray-700 mb-4">
          <p className="font-semibold">PT. DIPO STAR FINANCE</p>
          <p>SENTRAL SENAYAN 2, 3RD FLOOR JL. ASIA AFRIKA NO. 8 SENAYAN</p>
          <p>JAKARTA 10270</p>
          <p>T. (021)-(57954100) (Hunting) / F. (021)-(30051316)</p>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Detail Estimasi & Tanggal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-gray-700 border-b pb-4">
          <div>
            <p className="font-medium">Nomor Estimasi:</p>
            <p>{estimate.estNum}</p>
          </div>
          <div>
            <p className="font-medium">Tanggal Estimasi:</p>
            {/* Pastikan estimate.estimationDate adalah Date object atau string yang bisa di-parse */}
            <p>
              {format(new Date(estimate.estimationDate), "dd/MM/yyyy", {
                locale: localeId,
              })}
            </p>
          </div>
          <div>
            <p className="font-medium">Status Estimasi:</p>
            <p
              className={`font-semibold ${
                estimate.estStatus === EstimationStatus.APPROVED
                  ? "text-green-600"
                  : estimate.estStatus === EstimationStatus.PENDING
                  ? "text-orange-600"
                  : "text-gray-600"
              }`}
            >
              {estimate.estStatus.replace(/_/g, " ")}
            </p>
          </div>
          {estimate.finishedDate && (
            <div>
              <p className="font-medium">Tanggal Selesai:</p>
              <p>
                {format(new Date(estimate.finishedDate), "dd/MM/yyyy", {
                  locale: localeId,
                })}
              </p>
            </div>
          )}
        </div>

        {/* Detail Pelanggan (dari relasi vehicle owner atau langsung customer) */}
        {estimate.customer && (
          <div className="mb-6 border-b pb-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Kepada:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700">
              <div className="flex">
                <span className="w-24 font-medium">Nama:</span>
                <span>{estimate.customer.companyName}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-medium">UP:</span>
                <span>{estimate.customer.contact}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-medium">Alamat:</span>
                <span>{estimate.customer.address || "-"}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-medium">Telp:</span>
                <span>{estimate.customer.phone || "-"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Detail Kendaraan */}
        {estimate.vehicle && (
          <div className="mb-6 border-b pb-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Data Kendaraan:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700">
              <div className="flex">
                <span className="w-24 font-medium">No. Polisi:</span>
                <span>{estimate.vehicle.plateNumber}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-medium">Merk / Type:</span>
                <span>
                  {estimate.vehicle.make} / {estimate.vehicle.model}
                </span>
              </div>
              <div className="flex">
                <span className="w-24 font-medium">Tahun / Warna:</span>
                <span>
                  {estimate.vehicle.year} / {estimate.vehicle.color}
                </span>
              </div>
              <div className="flex">
                <span className="w-24 font-medium">No. Rangka:</span>
                <span>{estimate.vehicle.chassisNumber}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-medium">No. Mesin:</span>
                <span>{estimate.vehicle.engineNumber}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-medium">Odometer Request:</span>
                <span>{estimate.requestOdo.toLocaleString("id-ID")} KM</span>
              </div>
              <div className="flex">
                <span className="w-24 font-medium">Odometer Aktual:</span>
                <span>{estimate.actualOdo.toLocaleString("id-ID")} KM</span>
              </div>
            </div>
          </div>
        )}

        {/* Remark/Keluhan */}
        <div className="mb-6 border-b pb-4 text-sm text-gray-700">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Remark/Keluhan:
          </h2>
          <p className="mb-2">{estimate.remark || "-"}</p>
        </div>

        {/* Daftar Estimasi Jasa */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Estimasi Jasa:
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    No
                  </th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Jasa
                  </th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Qty
                  </th>
                  <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Harga Satuan
                  </th>
                  <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {estimate.estimationServices &&
                estimate.estimationServices.length > 0 ? (
                  estimate.estimationServices.map((service, index) => (
                    <tr key={service.id}>
                      <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-800">
                        {index + 1}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-800">
                        {service.service?.serviceName || "N/A"}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-800">
                        {service.quantity}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-800 text-right">
                        Rp{service.unitPrice.toLocaleString("id-ID")}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-800 text-right">
                        Rp{service.totalPrice.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 px-4 text-center text-sm text-gray-500"
                    >
                      Tidak ada estimasi jasa.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={4}
                    className="py-2 px-4 text-right text-sm font-semibold text-gray-800"
                  >
                    Total Jasa:
                  </td>
                  <td className="py-2 px-4 text-right text-sm font-bold text-gray-800">
                    Rp{totalServices.toLocaleString("id-ID")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Daftar Estimasi Item (Suku Cadang) */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Estimasi Item (Suku Cadang):
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    No
                  </th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Item
                  </th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Qty
                  </th>
                  <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Harga Satuan
                  </th>
                  <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {estimate.estimationItems &&
                estimate.estimationItems.length > 0 ? (
                  estimate.estimationItems.map((item, index) => (
                    <tr key={item.id}>
                      <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-800">
                        {index + 1}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-800">
                        {item.sparePart?.name || "N/A"}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-800">
                        {item.quantity}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-800 text-right">
                        Rp{item.unitPrice.toLocaleString("id-ID")}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-800 text-right">
                        Rp{item.totalPrice.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 px-4 text-center text-sm text-gray-500"
                    >
                      Tidak ada estimasi item suku cadang.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={4}
                    className="py-2 px-4 text-right text-sm font-semibold text-gray-800"
                  >
                    Total Item:
                  </td>
                  <td className="py-2 px-4 text-right text-sm font-bold text-gray-800">
                    Rp{totalItems.toLocaleString("id-ID")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Total Estimasi */}
        <div className="flex justify-end mb-6">
          <div className="w-full max-w-xs space-y-2 text-sm text-gray-700">
            <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
              <span>GRAND TOTAL ESTIMASI:</span>
              <span>
                Rp{estimate.totalEstimatedAmount.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* Catatan */}
        <div className="mb-6 text-sm text-gray-700">
          <p className="font-semibold mb-2">Catatan:</p>
          <p className="italic text-gray-600">{estimate.remark || "-"}</p>
        </div>

        {/* Informasi Tambahan (Mekanik, Disetujui Oleh) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-gray-700">
          {estimate.mechanic && (
            <div>
              <p className="font-medium">Mekanik:</p>
              <p>{estimate.mechanic.name}</p>
            </div>
          )}
          {estimate.approvedBy && (
            <div>
              <p className="font-medium">Disetujui Oleh:</p>
              <p>{estimate.approvedBy.name}</p>
            </div>
          )}
        </div>

        {/* Tanda Tangan */}
        <div className="text-right mt-8">
          <p className="font-semibold text-gray-800">PT. DIPO STAR FINANCE</p>
          <div className="mt-12 mb-2">
            <p className="font-bold text-gray-800">
              {/* {estimate.issuedBy?.name || "Nama Petugas"} */}
              Nama Petugas
            </p>
            <p className="text-sm text-gray-600">
              {/* ({estimate.issuedBy?.title || "Jabatan"}) */}
              (Jabatan)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function EstimateDetailPage() {
  const params = useParams();
  const estimateId = params.estimateId as string;
  const dispatch = useAppDispatch();

  const allEstimates = useAppSelector((state) => state.estimations.estimates);
  const estimateStatus = useAppSelector((state) => state.estimations.status);
  const estimateError = useAppSelector((state) => state.estimations.error);

  // Menggunakan useState untuk mengelola foundEstimate
  const [foundEstimate, setFoundEstimate] = useState<Estimation | undefined>(
    undefined
  );

  // Efek untuk memuat data estimasi saat komponen dimuat atau status berubah
  useEffect(() => {
    console.log(
      "useEffect [dispatch, estimateStatus]: Status saat ini:",
      estimateStatus
    );
    if (estimateStatus === "idle") {
      dispatch(fetchEstimates());
    }
  }, [dispatch, estimateStatus]);

  // Efek untuk memperbarui foundEstimate saat allEstimates atau estimateId berubah
  useEffect(() => {
    console.log(
      "useEffect [allEstimates, estimateId]: estimateId =",
      estimateId
    );
    console.log(
      "useEffect [allEstimates, estimateId]: allEstimates.length =",
      allEstimates.length
    );
    if (estimateId && allEstimates.length > 0) {
      const estimate = allEstimates.find(
        (estimation: Estimation) => estimation.id === estimateId
      );
      setFoundEstimate(estimate);
    } else {
      console.log(
        "useEffect [allEstimates, estimateId]: Resetting foundEstimate (ID not found or data empty)."
      );
      setFoundEstimate(undefined); // Reset jika ID tidak ada atau data kosong
    }
  }, [allEstimates, estimateId]);

  // Tampilkan pesan loading jika data masih dimuat
  if (estimateStatus === "loading") {
    console.log("Rendering: Loading...");
    return <div className="text-center py-8">Memuat detail Estimasi...</div>;
  }

  // Tampilkan pesan error jika fetching gagal
  if (estimateStatus === "failed") {
    console.log("Rendering: Failed with error:", estimateError);
    return (
      <div className="text-center py-8 text-red-500">
        Error: {estimateError}
      </div>
    );
  }

  // Hanya render EstimateDetail jika foundEstimate sudah terdefinisi
  if (foundEstimate) {
    console.log("Rendering: EstimateDetail with foundEstimate.");
    return (
      <div className="container mx-auto py-8">
        <EstimateDetail estimate={foundEstimate} />
      </div>
    );
  }

  // Jika status sudah 'succeeded' tetapi tidak ada estimasi yang ditemukan (misal: ID tidak valid)
  if (estimateStatus === "succeeded" && !foundEstimate) {
    console.log(
      "Rendering: Estimate not found after succeeded fetch. ID:",
      estimateId
    );
    return (
      <div className="text-center py-8 text-red-500">
        Estimasi tidak ditemukan. Pastikan ID estimasi benar. ID: {estimateId}
      </div>
    );
  }

  // Fallback untuk kondisi awal sebelum loading dimulai atau jika ada hal tak terduga
  console.log("Rendering: Initial or unexpected state.");
  return <div className="text-center py-8">Memuat data...</div>;
}
