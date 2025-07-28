import { z } from "zod";
// Hapus import Prisma Enums langsung di sini!
// import { EmployeeRole, EmployeeStatus, Gender } from "@prisma/client";

export const employeeFormSchema = z.object({
  id: z.string().optional(),
  employeeId: z.string().min(1, "ID Karyawan wajib diisi."),
  name: z.string().min(1, "Nama Karyawan wajib diisi."),
  email: z.string().email("Format email tidak valid.").or(z.literal("")).nullable().optional(), // Tambahkan .or(z.literal("")) untuk string kosong
  photo: z.string().url("Format URL foto tidak valid.").or(z.literal("")).nullable().optional(), // Tambahkan .or(z.literal("")) untuk string kosong
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  position: z.string().min(1, "Posisi/Jabatan wajib dipilih"),

  // KUNCI PERBAIKAN: Ubah z.nativeEnum menjadi z.string()
  role: z.string().min(1, "Role Karyawan wajib dipilih."), // Sekarang akan divalidasi sebagai string

  department: z.string().nullable().optional(),

  // KUNCI PERBAIKAN: Ubah z.nativeEnum menjadi z.string()
  status: z.string().min(1, "Status Karyawan wajib dipilih."), // Sekarang akan divalidasi sebagai string

  tanggalLahir: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal lahir tidak valid (YYYY-MM-DD).")
    .or(z.literal("")) // Izinkan string kosong
    .nullable()
    .optional(),
  tanggalBergabung: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal bergabung tidak valid (YYYY-MM-DD).")
    .or(z.literal("")) // Izinkan string kosong
    .nullable()
    .optional(),
  companyId: z.string().nullable().optional(),
  password: z.string().min(6, "Password minimal 6 karakter.").or(z.literal("")).nullable().optional(), // Tambahkan .or(z.literal(""))

  // KUNCI PERBAIKAN: Ubah z.nativeEnum menjadi z.string()
  gender: z.string().min(1, "Jenis Kelamin wajib dipilih."), // Sekarang akan divalidasi sebagai string
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
