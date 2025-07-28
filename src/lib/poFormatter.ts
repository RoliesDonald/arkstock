export function formatPoNumber(poSequenceNumber: number, poDate: Date): string {
  // nomor urut PO dalam bentuk string sebanyak 5 digit dengan nol didepan
  const paddedPoNumber = String(poSequenceNumber).padStart(5, "0");
  //   bulan dan tahun
  const month = poDate.getMonth() + 1;
  const year = poDate.getFullYear();
  //format bulan ke 2 digit
  const formattedMonth = String(month).padStart(2, "0");
  //gabungin semua menjadi format po
  return `PO/${year}/${formattedMonth}/${paddedPoNumber}`;
}

// --- Contoh Penggunaan ---
/*
import { formatPoNumber } from "@/lib/poFormatter";

const nextPoSequence = 1;
const today = new Date(); // Misal: 3 Juli 2025

const formattedPo = formatPoNumber(nextPoSequence, today);
console.log(formattedPo); // Contoh output: PO/2025/07/00001
*/
