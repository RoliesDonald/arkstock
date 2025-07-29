import { z } from "zod";

// Helper untuk mengonversi string tanggal ke Date atau null
const dateSchema = z.preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  return arg;
}, z.date().nullable().optional());

export const employeeFormSchema = z.object({
  id: z.string().optional(),
  employeeId: z.string().optional(),
  name: z.string().min(1, { message: "Nama karyawan wajib diisi." }),
  email: z.string().email({ message: "Format email tidak valid." }).or(z.literal("")).nullable().optional(),
  photo: z.string().url({ message: "Format URL foto tidak valid." }).or(z.literal("")).nullable().optional(),
  phone: z.string().min(1, { message: "Nomor telepon wajib diisi." }).or(z.literal("")).nullable().optional(),
  address: z.string().min(1, { message: "Alamat wajib diisi." }).or(z.literal("")).nullable().optional(),
  position: z.string().min(1, { message: "Jabatan wajib dipilih." }),
  role: z.string().min(1, { message: "Role karyawan wajib dipilih." }),
  department: z.string().optional().or(z.literal("")).nullable(),
  status: z.string().min(1, { message: "Status karyawan wajib dipilih." }),

  // KRUSIAL: Gunakan dateSchema untuk tanggal
  tanggalLahir: dateSchema,
  tanggalBergabung: dateSchema,

  gender: z.string().min(1, { message: "Jenis Kelamin wajib dipilih." }),
  companyId: z.string().min(1, { message: "ID Perusahaan wajib diisi." }),
  password: z
    .string()
    .min(6, { message: "Password minimal 6 karakter." })
    .or(z.literal(""))
    .nullable()
    .optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export const rawEmployeeApiResponseSchema = z.object({
  id: z.string(),
  employeeId: z.string().nullable(),
  name: z.string(),
  email: z.string().nullable(),
  password: z.string().nullable(),
  photo: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  position: z.string(),
  role: z.string(),
  department: z.string().nullable(),
  status: z.string(),
  tanggalLahir: z.string().nullable(), // API mengembalikan string
  tanggalBergabung: z.string().nullable(), // API mengembalikan string
  gender: z.string().nullable(),
  companyId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  company: z
    .object({
      id: z.string(),
      companyId: z.string(),
      companyName: z.string(),
      address: z.string().nullable(),
      contact: z.string().nullable(),
      companyEmail: z.string().nullable(),
      city: z.string().nullable(),
      taxRegistered: z.boolean(),
      companyType: z.string(),
      status: z.string(),
      companyRole: z.string(),
      logo: z.string().nullable(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
    .optional()
    .nullable(),
});

export type RawEmployeeApiResponse = z.infer<typeof rawEmployeeApiResponseSchema>;

export const employeeSchema = z.object({
  id: z.string(),
  employeeId: z.string().nullable(),
  name: z.string(),
  email: z.string().nullable(),
  password: z.string().nullable(),
  photo: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  position: z.string(),
  role: z.string(),
  department: z.string().nullable(),
  status: z.string(),
  tanggalLahir: z.date().nullable(), // Frontend menggunakan objek Date
  tanggalBergabung: z.date().nullable(), // Frontend menggunakan objek Date
  gender: z.string().nullable(),
  companyId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  company: z
    .object({
      id: z.string(),
      companyId: z.string(),
      companyName: z.string(),
      address: z.string().nullable(),
      contact: z.string().nullable(),
      companyEmail: z.string().nullable(),
      city: z.string().nullable(),
      taxRegistered: z.boolean(),
      companyType: z.string(),
      status: z.string(),
      companyRole: z.string(),
      logo: z.string().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
    .optional()
    .nullable(),
});

export type Employee = z.infer<typeof employeeSchema>;
