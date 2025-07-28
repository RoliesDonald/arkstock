"use client";
import { MainLayout } from "@/components/layouts/MainLayout";
import React from "react";

interface MainGroupRootLayoutProps {
  children: React.ReactNode;
}

export default function MainGroupRootLayout({
  children,
}: MainGroupRootLayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}
