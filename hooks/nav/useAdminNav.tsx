"use client";

import { AdminNavContext } from "@/providers/admin-nav-provider";
import { type AdminNavStore } from "@/stores/types";
import { useContext } from "react";
import { useStore } from "zustand";

export const useAdminNav = <T,>(selector: (store: AdminNavStore) => T): T => {
  const adminNavStoreContext = useContext(AdminNavContext);

  if (!adminNavStoreContext) {
    throw new Error(`useAdminNav must be used within AdminNavProvider`);
  }

  return useStore(adminNavStoreContext, selector);
};
