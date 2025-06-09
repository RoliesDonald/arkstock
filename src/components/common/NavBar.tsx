"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react"; // Impor useState dan useEffect
import { FaMoon, FaSun } from "react-icons/fa";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import CustAvtar from "../ui/CustAvtar";
import SearchInput from "../search-input";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSearchQuery } from "@/store/slices/tableSearchSlice";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  bengkelId?: string;
  rentalCompanyId?: string;
}

interface NavBarProps {
  currentUser: User | null;
}

const NavBar: React.FC<NavBarProps> = ({ currentUser }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const dispatch = useDispatch();
  const searchQuery = useSelector(
    (state: RootState) => state.tableSearch.searchQuery
  );

  const handleSearchChange = (value: string) => {
    dispatch(setSearchQuery(value));
  };

  // useEffect akan berjalan hanya di sisi klien setelah render pertama
  useEffect(() => {
    setMounted(true);
  }, []);

  // Jika belum di-mount, jangan render ikon yang menyebabkan hidrasi.
  // Anda bisa mengembalikan null atau placeholder jika diperlukan.
  if (!mounted) {
    return (
      <div className="bg-background flex items-center sticky top-0 z-1 justify-between px-6 py-3  shadow ">
        {/* SEARCH INPUT (tetap dirender) */}
        <div className="hidden md:flex bg-background p-2 rounded-full items-center gap-2 border-2 peer-focus:border-red-500 peer-focus:ring-5 border-slate-200 ">
          <Image src="/search.png" width={20} height={20} alt="search" />
          <input
            type="text"
            placeholder="search"
            className="peer w-[100%] bg-transparent focus:ring-0 focus:outline-none focus:border-red-500 text-slate-500"
          />
        </div>
        {/* RIGHT GROUP BAR (tetap dirender) */}
        <div className="flex gap-6 justify-end items-center w-full">
          <div className="flex flex-col justify-end gap-1">
            <span className="text-xs text-arkBlue-700  font-semibold leading-3">
              {currentUser?.name}
            </span>
            <span className="text-xs text-arkBlue-700 font-semibold leading-3 text-right">
              {currentUser?.role}
            </span>
          </div>
          <CustAvtar
            src="https://images.unsplash.com/photo-1535713875000-ef7455d3212b?fit=facearea&facepad=2&w=256&h=256&q=80"
            alt={currentUser?.name}
            fallbackText={currentUser?.name?.charAt(0)}
          />
          {/* Render tombol tanpa ikon, atau dengan ikon placeholder, saat belum di-mount */}
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            title="Loading theme toggle..."
          >
            {/* Opsi: Placeholder visual agar tata letak tidak bergeser */}
            <div className="w-5 h-5" /> {/* Sesuaikan ukuran dengan ikon */}
          </Button>
        </div>
      </div>
    );
  }

  // Setelah di-mount, render UI lengkap dengan ikon
  return (
    <div className="bg-background flex items-center sticky top-0 z-1 justify-between px-6 py-3  shadow ">
      {/* SEARCH INPUT  */}
      <div className="hidden sm:block sm:animate-fadeIn ">
        <SearchInput value={searchQuery} onChange={handleSearchChange} />
      </div>
      {/* RIGHT GROUP BAR */}
      <div className="flex gap-6 justify-end items-center w-full">
        <div className="flex flex-col justify-end gap-1">
          <span className="text-xs text-arkBlue-800  font-semibold leading-3">
            {currentUser?.name}
          </span>
          <span className="text-xs text-arkBlue-500 font-semibold leading-3 text-right">
            {currentUser?.role}
          </span>
        </div>
        <CustAvtar
          src="https://images.unsplash.com/photo-1535713875000-ef7455d3212b?fit=facearea&facepad=2&w=256&h=256&q=80"
          alt={currentUser?.name}
          fallbackText={currentUser?.name?.charAt(0)}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="rounded-full bg-arkBg-100 hover:border-arkBg-300 hover:borer-2"
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <FaMoon size={20} className=" text-arkBlue-700" />
          ) : (
            <FaSun size={20} className="text-arkBlue-700" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </div>
  );
};

export default NavBar;
