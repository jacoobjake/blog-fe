"use client";

import { AuthContext } from "@/providers/auth-provider";
import { type AuthStore } from "@/stores/types";
import { useContext } from "react";
import { useStore } from "zustand";

export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
  const authStoreContext = useContext(AuthContext);
  if (!authStoreContext) {
    throw new Error(`useAuthStore must be used within AuthStoreProvider`);
  }

  return useStore(authStoreContext, selector);
};
