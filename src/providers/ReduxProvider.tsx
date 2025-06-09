"use client"; // WAJIB: Provider harus Client Component

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store"; // Impor store yang sudah kita buat

interface ReduxProviderProps {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
