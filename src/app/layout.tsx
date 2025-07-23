// src/app/layout.tsx
// Hapus baris "use client"; dari sini. Ini harus menjadi Server Component.

import "./globals.css";
import React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Import Providers yang akan membungkus children
import { Toaster } from "@/components/ui/toaster";
import { ReduxProvider } from "../providers/ReduxProvider";
import { ThemeProvider } from "../providers/ThemeProvider";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--fonts-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "A Power Dashboard",
  description: "Fleet Maintenance",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/svg+xml" sizes="any" />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        {/* Providers ini adalah Client Components yang membungkus children */}
        <ReduxProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
