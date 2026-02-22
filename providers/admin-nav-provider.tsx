"use client";

import { type ReactNode, createContext, useState } from "react";

import type { AdminNavState } from "@/stores/types";
import { createAdminNavStore } from "@/stores/admin-nav";

type AdminNavStoreApi = ReturnType<typeof createAdminNavStore>;

export const AdminNavContext = createContext<AdminNavStoreApi | undefined>(
  undefined,
);

type AdminNavStoreProviderProps = {
  initialState?: AdminNavState;
  children: ReactNode;
};

export const AdminNavContextProvider = ({
  initialState,
  children,
}: AdminNavStoreProviderProps) => {
  const [store] = useState(() => createAdminNavStore(initialState));

  return (
    <AdminNavContext.Provider value={store}>
      {children}
    </AdminNavContext.Provider>
  );
};
