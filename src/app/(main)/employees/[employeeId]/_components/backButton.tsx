"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

export default function BackButton() {
  const router = useRouter();
  const handleBackClick = () => {
    router.back();
  };
  return (
    <Button
      onClick={handleBackClick}
      className="bg-arkBlue-600 hover:bg-arkBlue-700 text-arkBg-50 font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
    >
      kembali
    </Button>
  );
}
