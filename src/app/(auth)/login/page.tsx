"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Menggunakan komponen Input Shadcn UI
import { Label } from "@/components/ui/label"; // Menggunakan komponen Label Shadcn UI
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast"; // Pastikan useToast sudah diinstal
import { useRouter } from "next/navigation"; // Menggunakan useRouter dari next/navigation

// Skema validasi untuk form login
const loginFormSchema = z.object({
  email: z.string().email({ message: "Email tidak valid." }),
  password: z.string().min(1, { message: "Password wajib diisi." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const LoginPage = () => {
  const { toast } = useToast();
  const router = useRouter(); // Inisialisasi router

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset, // Tambahkan reset untuk membersihkan form setelah submit
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        // Jika login gagal, tampilkan pesan error dari API
        toast({
          title: "Login Gagal",
          description: data.message || "Email atau password salah.",
          variant: "destructive",
        });
        return;
      }

      // Login berhasil
      toast({
        title: "Login Berhasil",
        description: "Selamat datang di Arkstok!",
        variant: "default",
      });

      // Simpan token JWT ke localStorage
      if (typeof window !== "undefined" && data.token) {
        localStorage.setItem("jwt_token", data.token);
        // Anda juga bisa menyimpan informasi user jika diperlukan
        // localStorage.setItem("user_data", JSON.stringify(data.user));
      }

      // Redirect ke halaman admin-dashboard
      router.push("/admin-dashboard");
    } catch (error: any) {
      console.error("Error during login:", error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat mencoba login.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center p-5 bg-arkBlue-100">
      {/* sisi kiri */}
      <div className="flex w-[60%] h-full relative overflow-hidden rounded-tl-3xl rounded-bl-3xl ">
        <div className="absolute inset-0 flex items-center justify-end z-10">
          <p className="font-bold text-arkRed-600 text-[2rem] text-end leading-none dark:bg-arkBlue-800 rounded-bl-3xl rounded-tl-3xl px-10 py-5 w-fit">
            Partner Terpercaya untuk Armada anda
          </p>
        </div>
        <Image
          src="/welcome-door.jpg"
          alt="bg-login"
          layout="fill"
          objectFit="cover"
          className="opacity-70"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />
      </div>
      {/* sisi kanan */}
      <div className="w-[40%] h-full bg-arkBg-50 flex flex-col items-center justify-center rounded-tr-3xl rounded-br-3xl px-5 overflow-hidden">
        <div className="w-[80%]">
          <div className="flex flex-col items-center">
            <Image
              src="/logo-01.png"
              alt="logo"
              width={60}
              height={60}
              className="mb-2"
            />
            <p className="font-bold flex items-center text-arkBlue-800 text-md">
              Login to Your Account
            </p>
          </div>
          <div className="flex mt-5 items-center justify-center w-full py-0 border-2 border-arkBg-300 bg-arkBg-100 rounded-md">
            <Image
              src="/google.png"
              alt="logo"
              width={40}
              height={40}
              className="p-0.5 mr-2 "
            />
            <p className="text-arkBlue-800 text-sm font-bold">
              Login with Google
            </p>
          </div>
          <p className="flex w-full justify-center item-center my-4 text-arkBlue-500 text-sm font-semibold italic ">
            or Login with email
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 w-full">
            <div className="my-2">
              <Label
                htmlFor="email"
                className="text-arkBg-500 text-sm font-semibold italic mt-3 pl-2"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Your Email"
                {...register("email")}
                className="focus:outline-none w-full placeholder:italic mt-2 text-sm rounded-lg h-[35px] border-2 p-5 bg-arkBg-100 text-arkBlue-800"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 pl-2">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="password"
                className="text-arkBg-500 text-sm font-semibold italic mt-3 pl-2"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                {...register("password")}
                className="focus:outline-none w-full placeholder:italic text-sm mt-2 rounded-lg h-[35px] border-2 p-5 bg-arkBg-100 text-arkBlue-800"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 pl-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant={"default"}
              className="w-full mt-10 text-sm bg-arkBlue-700"
              disabled={isSubmitting} // Disable tombol saat submit
            >
              {isSubmitting ? "Logging In..." : "Log In"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
