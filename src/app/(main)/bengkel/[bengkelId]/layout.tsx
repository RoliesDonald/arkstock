import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Super Admin Dashboard | Ark Power Apps",
  description: "Overview and management for Super Admin.",
};

interface BengkelPageLayoutProps {
  children: React.ReactNode;
}

export default function BengkelPageLayout({
  children,
}: BengkelPageLayoutProps) {
  return <>{children}</>;
}
