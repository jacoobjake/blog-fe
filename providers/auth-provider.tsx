"use client";

import { type ReactNode, createContext, useState } from "react";

import { createAuthStore } from "@/stores";
import type { AuthState } from "@/stores/types";

type AuthStoreApi = ReturnType<typeof createAuthStore>;

export const AuthContext = createContext<AuthStoreApi | undefined>(undefined);

type AuthStoreProviderProps = {
  initialState?: AuthState;
  children: ReactNode;
};

export const AuthContextProvider = ({
  initialState,
  children,
}: AuthStoreProviderProps) => {
  const [store] = useState(() => createAuthStore(initialState));

  return <AuthContext value={store}>{children}</AuthContext>;
};
