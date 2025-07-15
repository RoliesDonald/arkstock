import "./globals.css";
import React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ReduxProvider } from "@/providers/ReduxProvider"; // Impor Redux Provider
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster"; // Import Toaster dari shadcn/ui

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
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
