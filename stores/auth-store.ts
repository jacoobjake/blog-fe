import { createStore } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthState, AuthStore } from "@/stores/types";
import { User } from "@/lib/types";

export const defaultInitState: AuthState = {
  isAuthenticated: false,
  user: null,
};

export const createAuthStore = (initState: AuthState = defaultInitState) => {
  return createStore<AuthStore>()(
    persist(
      (set) => ({
        ...initState,
        setUser: (user: User) => {
          set({ isAuthenticated: true, user });
        },
        clearUser: () => {
          set({ isAuthenticated: false, user: null });
        },
      }),
      {
        name: "auth-storage",
      },
    ),
  );
};
