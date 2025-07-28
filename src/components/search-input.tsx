"use client";
import React from "react";
import { CiSearch } from "react-icons/ci";
import { Input } from "./ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div
      className={`flex w-full md:auto bg-arkBg-50 p-2 rounded-full items-center gap-2 border ${
        isFocused
          ? "border-arkBlue-200 ring-5 bg-arkBlue-100"
          : "border-arkBg-200"
      }`}
    >
      <CiSearch size={20} className="text-ring" />
      <Input
        type="text"
        placeholder="search"
        className="h-5 w-[100%] bg-none focus:ring-0 focus:outline-none text-arkBg-500"
        onFocus={() => setIsFocused(false)}
        onBlur={() => setIsFocused(false)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
